import { API_URL, API_TIMEOUT } from '../config';

export const analyzeMeal = async (imageBase64) => {
  try {
    console.log('=== MEAL ANALYSIS START ===');
    console.log('API URL:', `${API_URL}/analyze-meal`);
    console.log('Timeout setting:', API_TIMEOUT, 'ms');
    
    // Log image details
    console.log('Image data length:', imageBase64.length);
    console.log('Image format:', imageBase64.substring(0, 20));
    
    // Ensure the image data is properly formatted
    let processedImageData = imageBase64;
    if (imageBase64.startsWith('data:image')) {
      console.log('Processing data URL format image');
      processedImageData = imageBase64.split(',')[1];
    }
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Request timeout reached after', API_TIMEOUT, 'ms');
      controller.abort();
    }, API_TIMEOUT);
    
    try {
      console.log('Sending request to backend...');
      const startTime = Date.now();
      
      const response = await fetch(`${API_URL}/analyze-meal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: processedImageData,
        }),
        signal: controller.signal
      });

      const endTime = Date.now();
      console.log('Request completed in:', endTime - startTime, 'ms');
      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('❌ API Error Response:', responseText);
        throw new Error(`Server responded with ${response.status}: ${responseText}`);
      }

      try {
        const result = JSON.parse(responseText);
        console.log('✅ Analysis result:', result);
        
        // Validate the response structure
        if (!result.nutrition || !result.food_items) {
          console.warn('⚠️ Incomplete analysis result:', result);
        }
        
        return result;
      } catch (parseError) {
        console.error('❌ Error parsing API response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.error('❌ Request timed out after', API_TIMEOUT, 'ms');
        throw new Error('Request timed out. The image processing is taking longer than expected. Please try again.');
      }
      console.error('❌ Fetch error:', fetchError);
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
      console.log('=== MEAL ANALYSIS END ===');
    }
  } catch (error) {
    console.error('❌ Error in analyzeMeal:', error);
    throw error;
  }
};

export const logMeal = async (mealData) => {
  try {
    console.log('Logging meal:', mealData);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      const response = await fetch(`${API_URL}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to log meal: ${errorText}`);
      }

      const result = await response.json();
      console.log('Meal logged successfully:', result);
      return result;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Error logging meal:', error);
    throw error;
  }
};
