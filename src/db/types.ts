export interface Channel {
  id: string;
  niche: string;
  target_audience: string;
  upload_frequency: string;
  active_status: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ContentStatus = 'pending' | 'generating' | 'generated' | 'published' | 'failed';

export interface ContentCalendarItem {
  id: string;
  channel_id: string;
  scheduled_date: string;
  topic_brief: string;
  status: ContentStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ThumbnailSpecs {
  primary_color: string;
  text_overlay: string;
  font_style: string;
  reaction_face: string;
  visual_elements?: string[];
  composition_layout?: string;
}

export interface VideoMetadata {
  id: string;
  content_calendar_id: string;
  final_title: string;
  description: string;
  tags: string[];
  thumbnail_specs: ThumbnailSpecs;
  youtube_video_id?: string | null;
  publication_status?: string;
  scheduled_publish_time?: string;
  created_at?: string;
  updated_at?: string;
}

export type AgentLogStatus = 'success' | 'failure' | 'retry' | 'running';

export interface AgentLog {
  id?: string;
  agent_name: string;
  execution_time: number; // in milliseconds
  payload: Record<string, any>;
  status: AgentLogStatus;
  error_message?: string | null;
  created_at?: string;
}
