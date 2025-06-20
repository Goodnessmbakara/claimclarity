import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Conversation state management
const conversations = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API configuration
const API_URL = process.env.CURACEL_API_URL;
const API_KEY = process.env.CURACEL_API_KEY;

// Mock claims database (fallback when API is not configured)
const mockClaims = {
  'CLAIM-123': {
    claimId: 'CLAIM-123',
    status: 'Approved',
    details: 'Payment of $1,500 has been processed and will be deposited within 3-5 business days.',
    amount: 1500,
    submissionDate: '2024-01-15',
    expectedResolution: 'Completed'
  },
  'CLAIM-456': {
    claimId: 'CLAIM-456',
    status: 'Under Review',
    details: 'Your claim is currently being reviewed by our claims adjuster. We may contact you for additional documentation.',
    amount: 2800,
    submissionDate: '2024-01-20',
    expectedResolution: '2024-02-05'
  },
  'CLAIM-789': {
    claimId: 'CLAIM-789',
    status: 'Pending',
    details: 'Additional documentation required. Please submit proof of damage and repair estimates.',
    amount: 950,
    submissionDate: '2024-01-18',
    expectedResolution: 'Pending documentation'
  },
  'CLAIM-321': {
    claimId: 'CLAIM-321',
    status: 'Denied',
    details: 'Claim denied due to policy exclusions. Damage occurred outside of coverage period.',
    submissionDate: '2024-01-10',
    expectedResolution: 'Final decision'
  }
};

// Generate unique claim ID
function generateClaimId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CLAIM-${timestamp}${random}`;
}

// Create claim data structure
function createClaimData(claimDetails) {
  const claimId = generateClaimId();
  const submissionDate = new Date().toISOString().split('T')[0];
  
  return {
    claimId: claimId,
    status: 'Submitted',
    details: claimDetails.description || 'Claim submitted successfully. Our team will review your submission.',
    amount: claimDetails.estimatedAmount || 0,
    submissionDate: submissionDate,
    expectedResolution: 'Under review',
    policyNumber: claimDetails.policyNumber || 'N/A',
    claimType: claimDetails.claimType || 'General',
    contactInfo: claimDetails.contactInfo || {},
    documents: claimDetails.documents || []
  };
}

// Helper function to extract claim ID from message
function extractClaimId(message) {
  const claimIdPattern = /CLAIM-\d+/i;
  const match = message.match(claimIdPattern);
  return match ? match[0].toUpperCase() : null;
}

// Fetch claim data from API
async function fetchClaimData(claimId) {
  if (!API_KEY) {
    console.log('API key not configured, using mock data');
    return mockClaims[claimId] || null;
  }

  try {
    const response = await fetch(`${API_URL}/claims/${claimId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    if (response.status === 404) {
      return null; // Claim not found
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const claimData = await response.json();
    
    // Normalize the response to match our expected format
    return {
      claimId: claimData.claimId || claimData.id || claimId,
      status: claimData.status || 'Unknown',
      details: claimData.details || claimData.description || 'No additional details available',
      amount: claimData.amount || claimData.claimAmount,
      submissionDate: claimData.submissionDate || claimData.createdAt,
      expectedResolution: claimData.expectedResolution || claimData.estimatedResolution
    };
  } catch (error) {
    console.error('API Error:', error);
    
    // If API fails, fall back to mock data for demo purposes
    console.log('Falling back to mock data due to API error');
    return mockClaims[claimId] || null;
  }
}

// Generate AI response using OpenAI
async function generateAIResponse(userMessage, claimData = null, apiError = null, conversationHistory = []) {
  try {
    let systemPrompt = `You are a professional, empathetic insurance claims assistant. Your role is to help customers understand their claim status in a clear, friendly, and reassuring manner. Always be professional but warm in your communication.`;
    
    let userPrompt = userMessage;
    
    if (apiError) {
      systemPrompt += ` There was an issue retrieving the claim information: ${apiError}. Please provide a helpful response explaining that there might be a temporary issue with the system and suggest they try again or contact support.`;
    } else if (claimData) {
      systemPrompt += ` The customer has asked about claim ${claimData.claimId}. Here is the claim information: Status: ${claimData.status}, Details: ${claimData.details}`;
      
      if (claimData.amount) {
        systemPrompt += `, Amount: $${claimData.amount}`;
      }
      
      if (claimData.submissionDate) {
        systemPrompt += `, Submitted: ${claimData.submissionDate}`;
      }
      
      if (claimData.expectedResolution && claimData.expectedResolution !== 'Completed' && claimData.expectedResolution !== 'Final decision') {
        systemPrompt += `, Expected resolution: ${claimData.expectedResolution}`;
      }
      
      systemPrompt += `. Please provide a helpful, human-like explanation of their claim status. Keep it concise but informative.`;
    } else {
      systemPrompt += ` The customer's message doesn't contain a valid claim ID or the claim was not found. Please ask them to provide their claim ID in a helpful and professional manner, or suggest they verify the claim ID if they provided one.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        ...conversationHistory,
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Get or create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const conversationHistory = conversations.get(sessionId);

    // Extract claim ID from message
    const claimId = extractClaimId(message);
    let claimData = null;
    let apiError = null;
    
    if (claimId) {
      // Validate claim ID format
      const claimIdPattern = /^CLAIM-\d+$/i;
      if (!claimIdPattern.test(claimId)) {
        const aiResponse = await generateAIResponse(message, null, null, conversationHistory);
        return res.json({
          success: true,
          response: aiResponse || 'Invalid claim ID format. Please enter a valid claim ID (e.g., CLAIM-123).',
          claimData: null
        });
      }

      try {
        // Fetch claim data from API
        claimData = await fetchClaimData(claimId);
      } catch (error) {
        console.error('Error fetching claim data:', error);
        apiError = 'Unable to retrieve claim information at this time';
      }
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(message, claimData, apiError, conversationHistory);
    
    // Update conversation history
    conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );
    
    // Keep only last 10 messages to prevent context overflow
    if (conversationHistory.length > 10) {
      conversations.set(sessionId, conversationHistory.slice(-10));
    }
    
    res.json({
      success: true,
      response: aiResponse,
      claimData: claimData,
      usingMockData: !API_KEY
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Sorry, I couldn\'t process your request. Please try again in a moment.'
    });
  }
});

// Create new claim endpoint
app.post('/api/claims', async (req, res) => {
  try {
    const {
      policyNumber,
      claimType,
      description,
      estimatedAmount,
      contactInfo,
      documents = []
    } = req.body;

    // Validate required fields
    if (!policyNumber || !claimType || !description) {
      return res.status(400).json({
        success: false,
        error: 'Policy number, claim type, and description are required'
      });
    }

    // Validate claim type
    const validClaimTypes = ['Auto', 'Home', 'Health', 'Life', 'Business', 'General'];
    if (!validClaimTypes.includes(claimType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid claim type. Must be one of: ' + validClaimTypes.join(', ')
      });
    }

    // Validate estimated amount
    if (estimatedAmount && (isNaN(estimatedAmount) || estimatedAmount < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Estimated amount must be a positive number'
      });
    }

    const claimDetails = {
      policyNumber,
      claimType,
      description,
      estimatedAmount: parseFloat(estimatedAmount) || 0,
      contactInfo: contactInfo || {},
      documents
    };

    let newClaim;

    if (API_KEY) {
      // Try to create claim via external API
      try {
        const response = await fetch(`${API_URL}/claims`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(claimDetails),
          timeout: 10000
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const apiResponse = await response.json();
        newClaim = {
          claimId: apiResponse.claimId || apiResponse.id,
          status: apiResponse.status || 'Submitted',
          details: apiResponse.details || 'Claim submitted successfully',
          amount: apiResponse.amount || estimatedAmount,
          submissionDate: apiResponse.submissionDate || new Date().toISOString().split('T')[0],
          expectedResolution: apiResponse.expectedResolution || 'Under review',
          policyNumber,
          claimType,
          contactInfo,
          documents
        };
      } catch (error) {
        console.error('External API Error:', error);
        // Fall back to mock creation
        newClaim = createClaimData(claimDetails);
        mockClaims[newClaim.claimId] = newClaim;
      }
    } else {
      // Create mock claim
      newClaim = createClaimData(claimDetails);
      mockClaims[newClaim.claimId] = newClaim;
    }

    res.status(201).json({
      success: true,
      message: 'Claim created successfully',
      claim: newClaim,
      usingMockData: !API_KEY
    });

  } catch (error) {
    console.error('Create Claim Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create claim. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    openaiConfigured: !!process.env.OPENAI_API_KEY
  });
});

// Clear conversation history endpoint
app.post('/api/clear-conversation', (req, res) => {
  const { sessionId = 'default' } = req.body;
  
  if (conversations.has(sessionId)) {
    conversations.delete(sessionId);
  }
  
  res.json({ 
    success: true, 
    message: 'Conversation history cleared' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
  console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
  if (!API_KEY) {
    console.log('⚠️  Using mock data - Configure API_KEY for live data');
  }
});