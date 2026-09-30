import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Channel, ContentCalendarItem, ContentStatus, VideoMetadata, AgentLog } from './types.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Local fallback store file path for offline development or sandbox testing
const DATA_DIR = path.resolve(process.cwd(), 'data');
const LOCAL_DB_PATH = path.join(DATA_DIR, 'local_db.json');

interface LocalStore {
  channels: Channel[];
  content_calendar: ContentCalendarItem[];
  video_metadata: VideoMetadata[];
  agent_logs: AgentLog[];
}

function initLocalStore(): LocalStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
    } catch {
      // fallback if corrupted
    }
  }

  const defaultStore: LocalStore = {
    channels: [
      {
        id: 'c001-ai-engineering',
        niche: 'Autonomous AI Agents & Multi-Agent Architecture',
        target_audience: 'Software Engineers, AI Practitioners, Founders',
        upload_frequency: 'daily',
        active_status: true,
        created_at: new Date().toISOString()
      }
    ],
    content_calendar: [
      {
        id: 'cal001-daily-agent',
        channel_id: 'c001-ai-engineering',
        scheduled_date: new Date().toISOString(),
        topic_brief: 'Building production autonomous multi-agent swarms with Model Context Protocol (MCP) and Gemini 2.5',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ],
    video_metadata: [],
    agent_logs: []
  };

  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(defaultStore, null, 2), 'utf-8');
  return defaultStore;
}

function saveLocalStore(store: LocalStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to save local store:', err);
  }
}

export class DatabaseService {
  private client: SupabaseClient | null = null;
  private isSupabaseActive: boolean = false;
  private localStore: LocalStore;

  constructor() {
    this.localStore = initLocalStore();

    if (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project-id')) {
      try {
        this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        this.isSupabaseActive = true;
        console.log('[DB] Initialized live Supabase Client:', SUPABASE_URL);
      } catch (err) {
        console.warn('[DB] Supabase initialization failed, falling back to local store:', err);
      }
    } else {
      console.log('[DB] Live Supabase credentials not detected; using local fallback store.');
    }
  }

  public isConnectedToSupabase(): boolean {
    return this.isSupabaseActive;
  }

  public async fetchActiveChannels(): Promise<Channel[]> {
    if (this.isSupabaseActive && this.client) {
      const { data, error } = await this.client
        .from('channels')
        .select('*')
        .eq('active_status', true);

      if (!error && data && data.length > 0) {
        return data as Channel[];
      }
      if (error) console.warn('[DB] Supabase channels query error, using local store:', error.message);
    }

    return this.localStore.channels.filter((c) => c.active_status);
  }

  public async upsertChannel(channel: Channel): Promise<void> {
    if (this.isSupabaseActive && this.client) {
      try {
        await this.client.from('channels').upsert(channel);
      } catch (err: any) {
        console.warn('[DB] Supabase upsertChannel error:', err.message);
      }
    }

    const idx = this.localStore.channels.findIndex((c) => c.id === channel.id);
    if (idx >= 0) {
      this.localStore.channels[idx] = channel;
    } else {
      this.localStore.channels.push(channel);
    }
    saveLocalStore(this.localStore);
  }

  public async fetchPendingBriefs(channelId?: string): Promise<ContentCalendarItem[]> {
    if (this.isSupabaseActive && this.client) {
      let query = this.client
        .from('content_calendar')
        .select('*')
        .eq('status', 'pending')
        .order('scheduled_date', { ascending: true });

      if (channelId) {
        query = query.eq('channel_id', channelId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as ContentCalendarItem[];
      }
      if (error) console.warn('[DB] Supabase content_calendar query error, using local store:', error.message);
    }

    let items = this.localStore.content_calendar.filter((c) => c.status === 'pending');
    if (channelId) {
      items = items.filter((c) => c.channel_id === channelId);
    }
    return items;
  }

  public async createBrief(channelId: string, topicBrief: string, scheduledDate?: string): Promise<ContentCalendarItem> {
    const item: ContentCalendarItem = {
      id: `cal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      channel_id: channelId,
      scheduled_date: scheduledDate || new Date().toISOString(),
      topic_brief: topicBrief,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (this.isSupabaseActive && this.client) {
      const { data, error } = await this.client
        .from('content_calendar')
        .insert(item)
        .select()
        .single();

      if (!error && data) {
        return data as ContentCalendarItem;
      }
      if (error) console.warn('[DB] Failed to insert brief into Supabase, saving locally:', error.message);
    }

    this.localStore.content_calendar.push(item);
    saveLocalStore(this.localStore);
    return item;
  }

  public async updateBriefStatus(calendarId: string, status: ContentStatus): Promise<void> {
    if (this.isSupabaseActive && this.client) {
      const { error } = await this.client
        .from('content_calendar')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', calendarId);

      if (error) console.warn('[DB] Failed to update brief in Supabase:', error.message);
    }

    const item = this.localStore.content_calendar.find((c) => c.id === calendarId);
    if (item) {
      item.status = status;
      item.updated_at = new Date().toISOString();
      saveLocalStore(this.localStore);
    }
  }

  public async saveVideoMetadata(metadata: Omit<VideoMetadata, 'id'>): Promise<VideoMetadata> {
    const record: VideoMetadata = {
      id: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...metadata,
      created_at: new Date().toISOString()
    };

    if (this.isSupabaseActive && this.client) {
      const { data, error } = await this.client
        .from('video_metadata')
        .insert(record)
        .select()
        .single();

      if (!error && data) {
        return data as VideoMetadata;
      }
      if (error) console.warn('[DB] Failed to insert video_metadata into Supabase, saving locally:', error.message);
    }

    this.localStore.video_metadata.push(record);
    saveLocalStore(this.localStore);
    return record;
  }

  public async logAgentExecution(log: AgentLog): Promise<void> {
    const entry: AgentLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...log,
      created_at: new Date().toISOString()
    };

    if (this.isSupabaseActive && this.client) {
      const { error } = await this.client.from('agent_logs').insert(entry);
      if (error) console.warn('[DB] Failed to save agent log to Supabase:', error.message);
    }

    this.localStore.agent_logs.unshift(entry);
    if (this.localStore.agent_logs.length > 500) {
      this.localStore.agent_logs = this.localStore.agent_logs.slice(0, 500);
    }
    saveLocalStore(this.localStore);
  }

  public async getRecentLogs(limit = 20): Promise<AgentLog[]> {
    if (this.isSupabaseActive && this.client) {
      const { data, error } = await this.client
        .from('agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) return data as AgentLog[];
    }

    return this.localStore.agent_logs.slice(0, limit);
  }

  public async getSystemStats() {
    return {
      channelsCount: this.localStore.channels.length,
      pendingBriefs: this.localStore.content_calendar.filter((c) => c.status === 'pending').length,
      generatedVideos: this.localStore.video_metadata.length,
      totalAgentLogs: this.localStore.agent_logs.length,
      isSupabaseActive: this.isSupabaseActive
    };
  }
}

export const db = new DatabaseService();
