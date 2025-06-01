import uvicorn
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get configuration from environment variables
HOST = os.getenv("HOST", "0.0.0.0")  # Listen on all network interfaces
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

if __name__ == "__main__":
    print(f"Starting TrackTreat AI backend server on {HOST}:{PORT}")
    print(f"Debug mode: {'On' if DEBUG else 'Off'}")
    print(f"Server will be accessible at:")
    print(f"- Local: http://localhost:{PORT}")
    print(f"- Network: http://10.0.0.61:{PORT}")
    
    uvicorn.run(
        "main:app", 
        host=HOST, 
        port=PORT, 
        reload=DEBUG,
        log_level="debug" if DEBUG else "info"
    )
