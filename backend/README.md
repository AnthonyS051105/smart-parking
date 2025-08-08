# SmartParking Backend API

Flask-based REST API for SmartParking mobile application with Firebase Firestore integration.

## Features

- User Authentication (Signup/Login)
- JWT Token-based security
- Firebase Firestore database
- Password hashing with bcrypt
- CORS enabled for cross-origin requests
- Comprehensive error handling

## Quick Start

### Prerequisites

- Python 3.9+
- Anaconda/Miniconda
- Firebase project with Firestore

### Setup

1. **Create Conda Environment**

   ```bash
   conda env create -f environment.yml
   conda activate smartparking-backend
   ```

2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Firebase Setup**

   - Download `firebase-key.json` from Firebase Console
   - Place in project root

4. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run Application**
   ```bash
   python app.py
   ```

## API Endpoints

- `GET /` - API status and information
- `GET /health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification
- `GET /api/auth/profile` - Get user profile (authenticated)

## Development

```bash
# Activate environment
conda activate smartparking-backend

# Run in development mode
FLASK_ENV=development python app.py

# Test API
curl http://localhost:5000/health
```

## Production Deployment

1. Update `.env` with production values
2. Change `JWT_SECRET` to a secure random string
3. Configure CORS origins for your domain
4. Use a production WSGI server like Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```
