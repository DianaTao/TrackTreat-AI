# TrackTreat AI

A comprehensive nutrition tracking and wellness application that combines AI-powered food recognition, speech recognition, personalized recommendations, and gamification.

## Features

- **Food Recognition**: Recognizes & quantifies food items using image segmentation and classification
- **Voice Transcription**: Transcribes spoken meal details using automatic speech recognition
- **Nutrient Data**: Fetches real-time nutrient data from the USDA FoodData Central API
- **Personalized Advice**: Generates dietary recommendations using a fine-tuned text generation model
- **Visualization**: Displays habits through calendar views and progress dashboards
- **Gamification**: Motivates users with streak-based badges, levels, and XP

## Architecture

![TrackTreat AI Architecture](https://via.placeholder.com/800x400?text=TrackTreat+AI+Architecture)

## Project Components

1. **Web App**: Next.js application hosted on Vercel
2. **iOS App**: React Native with Expo
3. **Backend**: FastAPI microservices deployed on Render
4. **Database**: Supabase for authentication, storage, and data persistence
5. **AI Services**: Hugging Face models for image segmentation, speech recognition, and text generation

## Getting Started

There are multiple ways to run TrackTreat AI:

1. **Standard Installation**: Set up each component individually
2. **Docker Containers**: Run the entire stack with Docker

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Expo CLI (for iOS app development)
- Docker & Docker Compose (for containerized deployment)
- Supabase account
- USDA FoodData Central API key
- Hugging Face account for model access

### Standard Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tracktreat-ai.git
   cd tracktreat-ai
   ```

2. **Set up Supabase**
   - Create a Supabase project at https://supabase.io
   - Run the SQL commands in `supabase/schema.sql` in the SQL editor
   - Create storage buckets for `meal-images` and `voice-notes`

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env     # Edit .env with your API keys
   python run.py
   ```
   Your FastAPI backend will be running at http://localhost:8000

4. **Web App Setup**
   ```bash
   cd web-app
   npm install
   cp .env.local.example .env.local   # Edit with your credentials
   npm run dev
   ```
   Your Next.js app will be running at http://localhost:3000

5. **iOS App Setup**
   ```bash
   cd ios-app
   npm install
   # Edit src/utils/supabase.js with your Supabase URL and anon key
   npm start
   ```

See the detailed [SETUP.md](./SETUP.md) guide for complete instructions.

### Docker Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tracktreat-ai.git
   cd tracktreat-ai
   ```

2. **Set up environment variables**
   ```bash
   cp .env.docker.example .env.docker
   # Edit .env.docker with your API keys and credentials
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose --env-file .env.docker up --build
   ```
   - Web App: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

See the detailed [DOCKER.md](./DOCKER.md) guide for more Docker-specific instructions.

## Running the Application

### Web App

After setup, you can access the web application at http://localhost:3000

- **Login/Signup**: Create an account or sign in with existing credentials
- **Dashboard**: View your nutrition summary and progress
- **Log Meal**: Capture food photos and voice notes about your meals
- **Calendar**: Review your meal history and nutrition data
- **Profile**: Set up your personal details and nutrition targets

### iOS App

- Launch the app on your iOS device or simulator
- Sign in with your credentials (same account as web app)
- Use the camera and microphone to log meals on the go

### Backend API

- API Documentation is available at http://localhost:8000/docs
- All API endpoints are RESTful and follow standard conventions

## Deployment

### Web App Deployment (Vercel)

```bash
cd web-app
vercel
```

### Backend Deployment (Render)

1. Set up a new Web Service on Render pointing to your repository
2. Configure the build settings:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python run.py`
3. Add your environment variables in the Render dashboard

## License

MIT

## Acknowledgements

- [Hugging Face](https://huggingface.co/) for their amazing AI models
- [USDA FoodData Central](https://fdc.nal.usda.gov/) for nutrition data
- [Supabase](https://supabase.io/) for authentication and database services
- [Next.js](https://nextjs.org/), [React Native](https://reactnative.dev/), and [FastAPI](https://fastapi.tiangolo.com/) communities
