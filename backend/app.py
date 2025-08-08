from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import traceback
import logging

# Google OAuth imports
from google.auth.transport import requests
from google.oauth2 import id_token

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=['*'])  # Allow all origins for development
logging.basicConfig(level=logging.DEBUG)

# Configuration
JWT_SECRET = os.getenv('JWT_SECRET', 'smartparking-secret-key-change-this')
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')  # Add this to your .env file
PORT = int(os.getenv('PORT', 5000))
DEBUG = os.getenv('FLASK_ENV') == 'development'

# Initialize Firebase
db = None
try:
    # Check if running in production or development
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'firebase-key.json')
    
    if os.path.exists(firebase_key_path):
        cred = credentials.Certificate(firebase_key_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("✅ Firebase initialized successfully!")
    else:
        print("❌ Firebase key file not found. Please download firebase-key.json")
        
except Exception as e:
    print(f"❌ Error initializing Firebase: {e}")
    print("Please ensure firebase-key.json is in the project root")

# Helper Functions
def generate_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=7)  # Token expires in 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def verify_token(token):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {e}")
        return None

def validate_email(email):
    """Basic email validation"""
    return '@' in email and '.' in email and len(email) > 5

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    """Check password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def verify_google_token(id_token_string):
    """Verify Google ID token and return user info"""
    try:
        if not GOOGLE_CLIENT_ID:
            raise ValueError("Google Client ID not configured")
        
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            id_token_string, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Validate issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
        return {
            'google_id': idinfo['sub'],
            'email': idinfo['email'],
            'name': idinfo.get('name', ''),
            'picture': idinfo.get('picture', ''),
            'email_verified': idinfo.get('email_verified', False)
        }
        
    except Exception as e:
        print(f"❌ Google token verification error: {e}")
        return None

# Routes
@app.route('/')
def home():
    """API home endpoint"""
    return jsonify({
        'message': '🚗 SmartParking API is running!',
        'version': '1.0.0',
        'status': 'active',
        'timestamp': datetime.utcnow().isoformat(),
        'firebase_status': 'connected' if db else 'disconnected',
        'google_oauth': 'configured' if GOOGLE_CLIENT_ID else 'not configured',
        'endpoints': {
            'health': 'GET /',
            'signup': 'POST /api/auth/signup',
            'login': 'POST /api/auth/login',
            'google_login': 'POST /api/auth/google',
            'verify': 'POST /api/auth/verify',
            'profile': 'GET /api/auth/profile'
        }
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'SmartParking API',
        'firebase': 'connected' if db else 'disconnected',
        'google_oauth': 'configured' if GOOGLE_CLIENT_ID else 'not configured'
    }), 200

# ✅ NEW: Google OAuth endpoint
@app.route('/api/auth/google', methods=['POST'])
def google_login():
    """Google OAuth login/signup endpoint"""
    try:
        if not db:
            return jsonify({
                'success': False,
                'error': 'Database connection not available'
            }), 500

        if not GOOGLE_CLIENT_ID:
            return jsonify({
                'success': False,
                'error': 'Google OAuth not configured'
            }), 500

        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        id_token_string = data.get('idToken')
        if not id_token_string:
            return jsonify({
                'success': False,
                'error': 'ID token is required'
            }), 400
        
        # Verify Google token
        google_user = verify_google_token(id_token_string)
        if not google_user:
            return jsonify({
                'success': False,
                'error': 'Invalid Google token'
            }), 400
        
        email = google_user['email'].lower().strip()
        google_id = google_user['google_id']
        full_name = google_user['name']
        profile_picture = google_user['picture']
        email_verified = google_user['email_verified']
        
        print(f"🔐 Google login attempt for: {email}")
        
        # Check if user exists in Firebase
        users_ref = db.collection('users')
        
        # First check by email
        existing_user_docs = users_ref.where('email', '==', email).limit(1).get()
        
        user_doc = None
        user_data = None
        user_id = None
        
        if len(existing_user_docs) > 0:
            # User exists, update Google info if needed
            user_doc = existing_user_docs[0]
            user_data = user_doc.to_dict()
            user_id = user_doc.id
            
            print(f"📝 Existing user found: {email}")
            
            # Update Google-specific fields
            update_data = {
                'updatedAt': datetime.utcnow(),
                'lastLogin': datetime.utcnow(),
                'loginCount': user_data.get('loginCount', 0) + 1
            }
            
            # Add Google info if not present
            if not user_data.get('googleId'):
                update_data['googleId'] = google_id
            if not user_data.get('profilePicture'):
                update_data['profilePicture'] = profile_picture
            if 'emailVerified' not in user_data:
                update_data['emailVerified'] = email_verified
                
            users_ref.document(user_id).update(update_data)
            
            # Update local user_data for response
            user_data.update(update_data)
            
        else:
            # Create new user with Google info
            print(f"👤 Creating new Google user: {email}")
            
            user_data = {
                'fullName': full_name,
                'email': email,
                'phoneNumber': '',  # Google doesn't provide phone by default
                'password': None,   # Google users don't need password
                'googleId': google_id,
                'profilePicture': profile_picture,
                'emailVerified': email_verified,
                'createdAt': datetime.utcnow(),
                'updatedAt': datetime.utcnow(),
                'lastLogin': datetime.utcnow(),
                'isActive': True,
                'loginCount': 1,
                'authProvider': 'google'  # Track auth method
            }
            
            # Add user to Firestore
            doc_ref = users_ref.add(user_data)
            user_id = doc_ref[1].id
        
        # Generate JWT token
        token = generate_token(user_id)
        
        # Return user data (without password and sensitive info)
        user_response = {
            'id': user_id,
            'fullName': user_data['fullName'],
            'email': user_data['email'],
            'phoneNumber': user_data.get('phoneNumber', ''),
            'profilePicture': user_data.get('profilePicture', ''),
            'emailVerified': user_data.get('emailVerified', False),
            'createdAt': user_data['createdAt'].isoformat(),
            'loginCount': user_data['loginCount'],
            'authProvider': user_data.get('authProvider', 'google')
        }
        
        print(f"✅ Google login successful: {email} (Login #{user_data['loginCount']})")
        
        return jsonify({
            'success': True,
            'message': 'Google login successful',
            'user': user_response,
            'token': token
        }), 200
        
    except Exception as e:
        print(f"❌ Google login error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration endpoint"""
    try:
        if not db:
            return jsonify({
                'success': False,
                'error': 'Database connection not available'
            }), 500

        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['fullName', 'email', 'phoneNumber', 'password']
        for field in required_fields:
            if field not in data or not data[field] or str(data[field]).strip() == '':
                return jsonify({
                    'success': False,
                    'error': f'{field} is required and cannot be empty'
                }), 400
        
        full_name = str(data['fullName']).strip()
        email = str(data['email']).lower().strip()
        phone_number = str(data['phoneNumber']).strip()
        password = str(data['password'])
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Validate password length
        if len(password) < 6:
            return jsonify({
                'success': False,
                'error': 'Password must be at least 6 characters long'
            }), 400
        
        # Validate full name length
        if len(full_name) < 2:
            return jsonify({
                'success': False,
                'error': 'Full name must be at least 2 characters long'
            }), 400
        
        # Validate phone number
        if len(phone_number) < 10:
            return jsonify({
                'success': False,
                'error': 'Phone number must be at least 10 digits'
            }), 400
        
        # Check if user already exists
        users_ref = db.collection('users')
        existing_user = users_ref.where('email', '==', email).limit(1).get()
        
        if len(existing_user) > 0:
            return jsonify({
                'success': False,
                'error': 'Email is already registered'
            }), 400
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Create user document
        user_data = {
            'fullName': full_name,
            'email': email,
            'phoneNumber': phone_number,
            'password': hashed_password,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
            'lastLogin': None,
            'isActive': True,
            'loginCount': 0
        }
        
        # Add user to Firestore
        doc_ref = users_ref.add(user_data)
        user_id = doc_ref[1].id
        
        # Generate JWT token
        token = generate_token(user_id)
        
        # Return user data (without password)
        user_response = {
            'id': user_id,
            'fullName': full_name,
            'email': email,
            'phoneNumber': phone_number,
            'createdAt': user_data['createdAt'].isoformat(),
            'loginCount': 0
        }
        
        print(f"✅ New user registered: {email}")
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': user_response,
            'token': token
        }), 201
        
    except Exception as e:
        print(f"❌ Signup error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        if not db:
            return jsonify({
                'success': False,
                'error': 'Database connection not available'
            }), 500

        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400
        
        email = str(data['email']).lower().strip()
        password = str(data['password'])
        
        if not email or not password:
            return jsonify({
                'success': False,
                'error': 'Email and password cannot be empty'
            }), 400
        
        # Find user by email
        users_ref = db.collection('users')
        user_docs = users_ref.where('email', '==', email).limit(1).get()
        
        if len(user_docs) == 0:
            return jsonify({
                'success': False,
                'error': 'Invalid email or password'
            }), 401
        
        user_doc = user_docs[0]
        user_data = user_doc.to_dict()
        user_id = user_doc.id
        
        # Verify password
        if not check_password(password, user_data['password']):
            return jsonify({
                'success': False,
                'error': 'Invalid email or password'
            }), 401
        
        # Check if user is active
        if not user_data.get('isActive', True):
            return jsonify({
                'success': False,
                'error': 'Account has been deactivated'
            }), 401
        
        # Generate JWT token
        token = generate_token(user_id)
        
        # Update last login and login count
        login_count = user_data.get('loginCount', 0) + 1
        users_ref.document(user_id).update({
            'lastLogin': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
            'loginCount': login_count
        })
        
        # Return user data (without password)
        user_response = {
            'id': user_id,
            'fullName': user_data['fullName'],
            'email': user_data['email'],
            'phoneNumber': user_data['phoneNumber'],
            'createdAt': user_data['createdAt'].isoformat() if 'createdAt' in user_data else None,
            'loginCount': login_count
        }
        
        print(f"✅ User logged in: {email} (Login #{login_count})")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user_response,
            'token': token
        }), 200
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/auth/verify', methods=['POST'])
def verify():
    """Token verification endpoint"""
    try:
        if not db:
            return jsonify({
                'success': False,
                'error': 'Database connection not available'
            }), 500

        data = request.get_json()
        
        if not data or 'token' not in data:
            return jsonify({
                'success': False,
                'error': 'Token is required'
            }), 400
        
        token = data['token']
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Invalid or expired token'
            }), 401
        
        # Get user data
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = user_doc.to_dict()
        
        # Check if user is active
        if not user_data.get('isActive', True):
            return jsonify({
                'success': False,
                'error': 'Account has been deactivated'
            }), 401
        
        # Return user data (without password)
        user_response = {
            'id': user_id,
            'fullName': user_data['fullName'],
            'email': user_data['email'],
            'phoneNumber': user_data['phoneNumber'],
            'createdAt': user_data['createdAt'].isoformat() if 'createdAt' in user_data else None,
            'lastLogin': user_data['lastLogin'].isoformat() if user_data.get('lastLogin') else None,
            'loginCount': user_data.get('loginCount', 0)
        }
        
        return jsonify({
            'success': True,
            'message': 'Token is valid',
            'user': user_response
        }), 200
        
    except Exception as e:
        print(f"❌ Verify error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/auth/profile', methods=['GET'])
def get_profile():
    """Get user profile endpoint (requires authentication)"""
    try:
        if not db:
            return jsonify({
                'success': False,
                'error': 'Database connection not available'
            }), 500

        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'success': False,
                'error': 'Authorization header is required (Bearer token)'
            }), 401
        
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Invalid or expired token'
            }), 401
        
        # Get user data
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = user_doc.to_dict()
        
        # Return user data (without password)
        user_response = {
            'id': user_id,
            'fullName': user_data['fullName'],
            'email': user_data['email'],
            'phoneNumber': user_data['phoneNumber'],
            'createdAt': user_data['createdAt'].isoformat() if 'createdAt' in user_data else None,
            'lastLogin': user_data['lastLogin'].isoformat() if user_data.get('lastLogin') else None,
            'loginCount': user_data.get('loginCount', 0),
            'isActive': user_data.get('isActive', True)
        }
        
        return jsonify({
            'success': True,
            'message': 'Profile retrieved successfully',
            'user': user_response
        }), 200
        
    except Exception as e:
        print(f"❌ Profile error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(405)
def method_not_allowed_error(error):
    return jsonify({
        'success': False,
        'error': 'Method not allowed'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print(f"🚀 Starting SmartParking API")
    print(f"📍 Host: 0.0.0.0")
    print(f"🔌 Port: {PORT}")
    print(f"🔧 Debug: {DEBUG}")
    print(f"🔑 Firebase: {'Connected' if db else 'Not Connected'}")
    print(f"🌐 CORS: Enabled for all origins")
    print(f"🌍 Access URLs:")
    print(f"   - Local: http://localhost:{PORT}")
    print(f"   - Network: http://YOUR_IP:{PORT}")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG)