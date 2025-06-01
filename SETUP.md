# TrackTreat AI Setup Guide

This guide provides step-by-step instructions for setting up and running the TrackTreat AI application locally for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Python** (v3.10+) - [Download](https://www.python.org/downloads/)
- **Expo CLI** - Install with `npm install -g expo-cli`
- **Supabase Account** - [Sign up](https://supabase.com/)
- **USDA FoodData Central API Key** - [Get API Key](https://fdc.nal.usda.gov/api-key-signup.html)
- **Hugging Face Account** - [Sign up](https://huggingface.co/join)

## Project Structure

The project consists of several components:

- `web-app/` - Next.js web application
- `ios-app/` - React Native iOS application using Expo
- `backend/` - FastAPI backend services
- `supabase/` - Database schema and configuration

## 1. Supabase Setup

### Create a Supabase Project

1. Log in to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys (anon key and service role key)

### Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL commands to create the necessary tables and functions

### Create Storage Buckets

1. Go to the Storage section in your Supabase dashboard
2. Create two buckets:
   - `meal-images` - For storing food photos
   - `voice-notes` - For storing audio recordings
3. Set the privacy settings to allow file uploads and downloads

## 2. Backend Setup

### Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
```

### Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your credentials:
```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_ANON_KEY=your-supabase-anon-key
USDA_API_KEY=your-usda-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### Run the Backend Server

```bash
python run.py
```

The server will start at http://localhost:8000.

## 3. Web App Setup

### Install Dependencies

```bash
cd web-app
npm install
```

### Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run the Web App

```bash
npm run dev
```

The web app will be available at http://localhost:3000.

## 4. iOS App Setup

### Install Dependencies

```bash
cd ios-app
npm install
```

### Configure Supabase URL and Key

Edit `src/utils/supabase.js` and update the Supabase URL and anon key:

```javascript
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';
```

### Run the iOS App

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open in iOS simulator (requires Xcode on macOS)
- Press `a` to open in Android emulator (requires Android Studio)
- Scan the QR code with the Expo Go app on your device

## 5. Deployment

### Web App (Vercel)

1. Create a Vercel account and connect your GitHub repository
2. Configure environment variables in the Vercel dashboard
3. Deploy with:
```bash
cd web-app
vercel
```

### Backend (Render)

1. Create a Render account and a new Web Service
2. Point to your repository and configure:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python run.py`
3. Add environment variables in the Render dashboard

### iOS App (Expo/App Store)

1. Set up app signing and certificates using Expo EAS
2. Build the app with:
```bash
cd ios-app
eas build --platform ios
```
3. Submit to App Store using EAS Submit

## Troubleshooting

### API Connection Issues
- Ensure the backend server is running
- Check that CORS settings in the backend allow your frontend origins
- Verify environment variables are correctly set

### Supabase Authentication
- Check that the RLS policies are correctly configured
- Ensure your API keys have the necessary permissions
- Verify your Supabase project is on the correct plan for your usage

### AI Model Performance
- For development, you can use smaller models from Hugging Face
- Consider hosting your own models for production if you need lower latency

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)
- [Hugging Face Documentation](https://huggingface.co/docs)
