# Flask Backend Setup untuk Smart Parking App

## Struktur Backend yang Disarankan

```
backend/
├── app.py
├── requirements.txt
├── config.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   └── parking.py
├── routes/
│   ├── __init__.py
│   ├── auth.py
│   └── parking.py
└── utils/
    ├── __init__.py
    ├── firebase_config.py
    └── auth_helper.py
```

## Instalasi Dependencies

```bash
pip install flask flask-cors firebase-admin bcrypt PyJWT python-dotenv
```

## File requirements.txt

```
Flask==2.3.3
Flask-CORS==4.0.0
firebase-admin==6.2.0
bcrypt==4.0.1
PyJWT==2.8.0
python-dotenv==1.0.0
```

## Firebase Configuration (utils/firebase_config.py)

```python
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

def get_db():
    return db
```

## User Model (models/user.py)

```python
from utils.firebase_config import get_db
from datetime import datetime
import bcrypt

class User:
    def __init__(self):
        self.db = get_db()
        self.collection = self.db.collection('users')

    def create_user(self, email, password, full_name, phone_number):
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'fullName': full_name,
            'phoneNumber': phone_number,
            'createdAt': datetime.now(),
            'isActive': True
        }

        # Check if user already exists
        existing_user = self.collection.where('email', '==', email).get()
        if existing_user:
            return None, "User already exists"

        # Create user
        doc_ref = self.collection.add(user_data)
        user_data['id'] = doc_ref[1].id
        del user_data['password']  # Don't return password

        return user_data, None

    def authenticate_user(self, email, password):
        users = self.collection.where('email', '==', email).get()

        if not users:
            return None, "User not found"

        user_doc = users[0]
        user_data = user_doc.to_dict()
        user_data['id'] = user_doc.id

        # Check password
        if bcrypt.checkpw(password.encode('utf-8'), user_data['password'].encode('utf-8')):
            del user_data['password']  # Don't return password
            return user_data, None

        return None, "Invalid password"

    def get_user_by_id(self, user_id):
        doc = self.collection.document(user_id).get()
        if doc.exists:
            user_data = doc.to_dict()
            user_data['id'] = doc.id
            del user_data['password']  # Don't return password
            return user_data
        return None
```

## Auth Routes (routes/auth.py)

```python
from flask import Blueprint, request, jsonify
from models.user import User
from utils.auth_helper import generate_token, verify_token
import jwt

auth_bp = Blueprint('auth', __name__)
user_model = User()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')
        phone_number = data.get('phoneNumber')

        if not all([email, password, full_name, phone_number]):
            return jsonify({'error': 'All fields are required'}), 400

        user_data, error = user_model.create_user(email, password, full_name, phone_number)

        if error:
            return jsonify({'error': error}), 400

        # Generate JWT token
        token = generate_token(user_data['id'])

        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': user_data
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user_data, error = user_model.authenticate_user(email, password)

        if error:
            return jsonify({'error': error}), 401

        # Generate JWT token
        token = generate_token(user_data['id'])

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user_data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify-token', methods=['POST'])
def verify_token_route():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No authorization header'}), 401

        token = auth_header.split(' ')[1]  # Remove "Bearer "
        user_id = verify_token(token)

        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

        return jsonify({'message': 'Token is valid', 'userId': user_id}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

## Auth Helper (utils/auth_helper.py)

```python
import jwt
import os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key')

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)  # Token expires in 7 days
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
```

## Main App (app.py)

```python
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')

@app.route('/')
def home():
    return {'message': 'Smart Parking API is running!'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## Environment Variables (.env)

```
JWT_SECRET_KEY=your-super-secret-key-here
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/your/serviceAccountKey.json
```

## Update URL di AuthContext

Ganti `YOUR_FLASK_BACKEND_URL` di AuthContext dengan URL backend Anda:

- Local development: `http://localhost:5000`
- Production: URL server Anda

## Cara Menjalankan Backend

1. Install dependencies: `pip install -r requirements.txt`
2. Setup Firebase service account key
3. Update environment variables
4. Run: `python app.py`

## Firebase Setup

1. Buat project di Firebase Console
2. Enable Firestore Database
3. Generate service account key dari Settings > Service Accounts
4. Download file JSON dan simpan di project Anda
5. Update path di firebase_config.py

Backend akan berjalan di http://localhost:5000 dan siap untuk diintegrasikan dengan aplikasi React Native Anda!
