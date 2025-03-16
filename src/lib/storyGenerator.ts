type StoryParams = {
  motif: string;
  readLength: 'short' | 'long';
};

export async function generateStory({ motif, readLength }: StoryParams): Promise<string> {
  try {
    const response = await fetch('/.netlify/functions/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motif, readLength }),
    });

    const responseText = await response.text();
    
    // Try to parse as JSON first
    try {
      const data = JSON.parse(responseText);
      
      // If we got a JSON response but it's an error
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      
      return data.story;
    } catch (parseError) {
      // If it's not JSON, it's probably an HTML error page
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        // Extract error message from HTML if possible
        const errorMatch = responseText.match(/<pre>(.*?)<\/pre>/s) || 
                         responseText.match(/<h1>(.*?)<\/h1>/s) ||
                         responseText.match(/<body>(.*?)<\/body>/s);
                         
        const errorMessage = errorMatch 
          ? `Server Error: ${errorMatch[1].trim()}`
          : `Server Error: ${response.status} ${response.statusText}`;
          
        throw new Error(errorMessage);
      }
      
      // If it's neither valid JSON nor HTML
      throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
    }
  } catch (error) {
    // Convert all errors to a consistent format
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
      
    console.error('Story generation error:', error);
    throw new Error(errorMessage);
  }
}