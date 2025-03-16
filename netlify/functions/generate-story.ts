import { Handler } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const { motif, readLength } = body;

    if (!motif || !readLength) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    const wordCount = readLength === 'short' ? '1000-2000' : '3000-5000';
    
    const prompt = `Write a horror story in the style of r/nosleep with the following requirements:
    
    1. Theme/Motif: ${motif === 'Surprise Me' ? '[random horror element]' : motif}
    2. Word count: ${wordCount} words
    3. Style guidelines:
       - Written in first person
       - Must feel realistic and plausible
       - Include specific details and timestamps
       - Build tension gradually
       - Create a sense of immediate danger
       - End with a clear resolution or haunting revelation
    4. Format:
       - Use proper paragraphing
       - Include a compelling title
       - End with a clear conclusion
    
    The story should follow r/nosleep's style: realistic, personal accounts of horror that could plausibly be true.`;

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: readLength === 'short' ? 2500 : 7000,
      temperature: 0.8,
      system: "You are an expert horror writer who specializes in creating realistic, terrifying stories in the style of r/nosleep. Your stories are known for their believability, attention to detail, and haunting conclusions.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ story: message.content[0].text }),
    };
  } catch (error) {
    console.error('Story generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate story',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }),
    };
  }
};