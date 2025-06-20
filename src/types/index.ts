export interface ClaimStatus {
  claimId: string;
  status: 'Approved' | 'Pending' | 'Denied' | 'Under Review';
  details: string;
  amount?: number;
  submissionDate?: string;
  expectedResolution?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  claimData?: ClaimStatus;
}

export interface ApiResponse {
  success: boolean;
  data?: ClaimStatus;
  error?: string;
}