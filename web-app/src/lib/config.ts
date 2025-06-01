// Environment variables and configuration settings
// In production, these would be loaded from .env files

export const config = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
  },
  
  // USDA FoodData Central API
  usda: {
    apiKey: process.env.USDA_API_KEY || 'your-usda-api-key',
    apiUrl: 'https://api.nal.usda.gov/fdc/v1',
  },
  
  // Hugging Face API
  huggingFace: {
    apiKey: process.env.HUGGINGFACE_API_KEY || 'your-huggingface-api-key',
    imageSegmentationModel: 'facebook/maskformer-swin-base-ade',
    speechRecognitionModel: 'facebook/wav2vec2-base-960h',
    textGenerationModel: 'gpt2', // Replace with your fine-tuned model
  },
  
  // Backend API
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    endpoints: {
      profiles: '/profiles',
      meals: '/meals',
      badges: '/badges',
      events: '/events',
    },
  },
};
