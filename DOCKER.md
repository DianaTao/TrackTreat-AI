# TrackTreat AI Docker Guide

This guide explains how to run the TrackTreat AI application using Docker containers.

## Prerequisites

- Docker Engine (v20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose (v2.0+) - Included with Docker Desktop
- Supabase account with project set up (see `SETUP.md`)

## Setup Instructions

### 1. Environment Configuration

Create a `.env.docker` file from the template:

```bash
cp .env.docker.example .env.docker
```

Edit the `.env.docker` file and fill in your credentials:

```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_ANON_KEY=your-supabase-anon-key
USDA_API_KEY=your-usda-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### 2. Building and Starting the Containers

Build and start all services using Docker Compose:

```bash
docker-compose --env-file .env.docker up --build
```

This command will:
- Build the Docker images for backend and web app
- Start the containers in the foreground with log output

To run the services in the background, use:

```bash
docker-compose --env-file .env.docker up -d
```

### 3. Accessing the Applications

Once the containers are running, you can access:

- Web App: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Managing Containers

#### Stop the services:

```bash
docker-compose down
```

#### View logs:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs web-app

# Follow logs
docker-compose logs -f
```

#### Restart a service:

```bash
docker-compose restart backend
```

### 5. Development with Docker

The Docker setup includes volume mounting for the backend to enable hot reloading:

- Changes to the backend code will be reflected immediately
- For web app changes, you'll need to rebuild the container:
  ```bash
  docker-compose --env-file .env.docker up -d --build web-app
  ```

## Container Structure

### Backend Container

- Base image: `python:3.10-slim`
- Exposes port 8000
- Runs FastAPI application through `run.py`
- Environment variables are passed from `.env.docker`

### Web App Container

- Base image: `node:18-alpine`
- Exposes port 3000
- Builds and serves the Next.js web application
- Environment variables are passed as build arguments

## Production Deployment

For production deployment:

1. Update the `docker-compose.yml` file to remove development-specific settings:
   - Remove volume mounts
   - Set `DEBUG=False` for the backend
   - Consider adding health checks

2. Set up proper domain name and HTTPS:
   - Add a reverse proxy service (like Nginx or Traefik)
   - Configure SSL certificates

3. Configure proper resource limits for containers.

## Troubleshooting

### Container fails to start

Check the logs for error messages:

```bash
docker-compose logs [service-name]
```

### Connection issues between services

Make sure both services are on the same Docker network:

```bash
docker network ls
docker network inspect tracktreat-network
```

### Environment variable problems

Verify that the variables are correctly passed to the containers:

```bash
docker-compose exec backend env
```
