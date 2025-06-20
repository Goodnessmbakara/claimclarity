import { ClaimStatus } from '../types';

export interface ChatApiResponse {
  success: boolean;
  response: string;
  claimData?: ClaimStatus;
  error?: string;
  usingMockData?: boolean;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  openaiConfigured: boolean;
}

// Use environment variable for API URL or fallback to localhost
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return `${envUrl}/api`;
  }
  
  // Fallback to localhost for development
  const protocol = window.location.protocol;
  return `${protocol}//localhost:3001/api`;
};

export async function sendChatMessage(message: string, sessionId: string = 'default'): Promise<ChatApiResponse> {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Chat API Error:', error);
    return {
      success: false,
      response: 'Sorry, I\'m experiencing technical difficulties. Please try again in a moment.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Clear conversation history
export async function clearConversation(sessionId: string = 'default'): Promise<{ success: boolean; message: string }> {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/clear-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Clear conversation error:', error);
    return {
      success: false,
      message: 'Failed to clear conversation history'
    };
  }
}

// Health check function
export async function checkServerHealth(): Promise<HealthResponse> {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Health check failed');
  } catch (error) {
    console.error('Server health check failed:', error);
    return {
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      openaiConfigured: false
    };
  }
}

export async function createClaim(claimData: {
  policyNumber: string;
  claimType: string;
  description: string;
  estimatedAmount: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}): Promise<{ success: boolean; claim?: any; message?: string; error?: string }> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claimData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create claim'
      };
    }

    return {
      success: true,
      claim: data.claim,
      message: data.message
    };
  } catch (error) {
    console.error('Error creating claim:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}