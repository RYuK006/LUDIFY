
export enum AgentStatus {
  IDLE = 'IDLE',
  STRATEGIZING = 'STRATEGIZING',
  HUNTING = 'HUNTING',
  CLOSING = 'CLOSING',
  COMPLETED = 'COMPLETED'
}

export interface Listing {
  id: string;
  title: string;
  price: string;
  location: string;
  commuteTime: string;
  source: string;
  url: string;
  imageUrl: string;
  status: 'new' | 'contacted' | 'replied' | 'rejected';
  agentNote?: string;
}

export interface SearchQuery {
  workLocation: string;
  budget: string;
  currency: string;
  transport: 'driving' | 'transit' | 'walking';
  maxCommute: number;
}

export interface AgentLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'agent';
}
