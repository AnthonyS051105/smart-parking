# Google OAuth Backend Implementation Guide

## Required Backend Endpoint

Anda perlu menambahkan endpoint `/api/auth/google` di backend Flask Anda untuk menangani Google OAuth.

### 1. Install Dependencies di Backend

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### 2. Backend Code Example (Python Flask)

```python
from flask import Blueprint, request, jsonify
from google.auth.transport import requests
from google.oauth2 import id_token
import jwt
import datetime
from your_models import User  # Sesuaikan dengan model User Anda
from your_database import db  # Sesuaikan dengan database setup Anda

auth_bp = Blueprint('auth', __name__)

# Google OAuth endpoint
@auth_bp.route('/google', methods=['POST'])
def google_login():
    try:
        data = request.get_json()
        id_token_string = data.get('idToken')
        user_info = data.get('user')

        if not id_token_string:
            return jsonify({
                'success': False,
                'error': 'ID token is required'
            }), 400

        # Verify the ID token with Google
        CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'  # Dari Google Cloud Console

        try:
            # Verify token
            idinfo = id_token.verify_oauth2_token(
                id_token_string,
                requests.Request(),
                CLIENT_ID
            )

            # Validate issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # Get user info from verified token
            google_user_id = idinfo['sub']
            email = idinfo['email']
            name = idinfo.get('name', '')
            picture = idinfo.get('picture', '')
            email_verified = idinfo.get('email_verified', False)

        except ValueError as e:
            return jsonify({
                'success': False,
                'error': f'Invalid token: {str(e)}'
            }), 400

        # Check if user exists in database
        user = User.query.filter_by(email=email).first()

        if user:
            # User exists, update Google info if needed
            if not user.google_id:
                user.google_id = google_user_id
                user.profile_picture = picture
                db.session.commit()
        else:
            # Create new user
            user = User(
                email=email,
                full_name=name,
                google_id=google_user_id,
                profile_picture=picture,
                email_verified=email_verified,
                # Set random password atau null untuk Google users
                password_hash=None  # Google users don't need password
            )
            db.session.add(user)
            db.session.commit()

        # Generate JWT token untuk user
        token_payload = {
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }

        token = jwt.encode(
            token_payload,
            'YOUR_SECRET_KEY',  # Ganti dengan secret key yang aman
            algorithm='HS256'
        )

        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'fullName': user.full_name,
                'profilePicture': user.profile_picture,
                'emailVerified': user.email_verified
            }
        }), 200

    except Exception as e:
        print(f"Google login error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

# Register blueprint
app.register_blueprint(auth_bp, url_prefix='/api/auth')
```

### 3. Database Schema Update

Pastikan tabel User Anda memiliki kolom untuk Google OAuth:

```sql
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN profile_picture TEXT;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
```

### 4. Environment Variables

Tambahkan di file `.env` backend Anda:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
JWT_SECRET_KEY=your_jwt_secret_key_here
```

## Important Notes:

1. **Client ID**: Gunakan Web Client ID yang sama di frontend dan backend
2. **Token Verification**: Selalu verify ID token di backend untuk keamanan
3. **Error Handling**: Handle semua kemungkinan error dengan proper response
4. **Database**: Update schema untuk menyimpan Google user info
5. **Security**: Jangan pernah trust data dari frontend tanpa verification

## Testing:

1. Test dengan Postman menggunakan ID token dari Google
2. Verify bahwa user baru dibuat atau updated dengan benar
3. Pastikan JWT token generated dengan benar
