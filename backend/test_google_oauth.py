#!/usr/bin/env python3
"""
Test script untuk Google OAuth endpoint
Gunakan script ini untuk test backend Google OAuth tanpa frontend
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"  # Sesuaikan dengan backend URL Anda
ENDPOINTS = {
    "health": f"{BASE_URL}/health",
    "google_auth": f"{BASE_URL}/api/auth/google",
    "verify": f"{BASE_URL}/api/auth/verify",
    "profile": f"{BASE_URL}/api/auth/profile"
}

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(ENDPOINTS["health"])
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_google_auth_invalid():
    """Test Google auth dengan invalid token"""
    print("\n🔍 Testing Google auth with invalid token...")
    try:
        payload = {
            "idToken": "invalid_token_12345"
        }
        
        response = requests.post(
            ENDPOINTS["google_auth"], 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # Should return 400 for invalid token
        return response.status_code == 400
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_google_auth_missing_token():
    """Test Google auth tanpa token"""
    print("\n🔍 Testing Google auth without token...")
    try:
        payload = {}
        
        response = requests.post(
            ENDPOINTS["google_auth"], 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # Should return 400 for missing token
        return response.status_code == 400
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def get_google_token_instructions():
    """Print instructions untuk mendapatkan Google token"""
    print("\n📋 Cara mendapatkan Google ID Token untuk testing:")
    print("1. Buka: https://developers.google.com/oauthplayground/")
    print("2. Di sebelah kiri, klik 'Google OAuth2 API v2'")
    print("3. Pilih 'https://www.googleapis.com/auth/userinfo.email'")
    print("4. Pilih 'https://www.googleapis.com/auth/userinfo.profile'")
    print("5. Klik 'Authorize APIs'")
    print("6. Login dengan Google account")
    print("7. Klik 'Exchange authorization code for tokens'")
    print("8. Copy 'id_token' dari response")
    print("9. Paste di fungsi test_google_auth_real() di bawah")

def test_google_auth_real(id_token=None):
    """Test Google auth dengan real token"""
    print("\n🔍 Testing Google auth with real token...")
    
    if not id_token:
        print("❌ No ID token provided")
        get_google_token_instructions()
        return False
    
    try:
        payload = {
            "idToken": id_token
        }
        
        response = requests.post(
            ENDPOINTS["google_auth"], 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data:
                print(f"\n✅ JWT Token received: {data['token'][:50]}...")
                return data['token']
        
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_token_verify(jwt_token):
    """Test token verification"""
    print(f"\n🔍 Testing token verification...")
    try:
        payload = {
            "token": jwt_token
        }
        
        response = requests.post(
            ENDPOINTS["verify"], 
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_profile_access(jwt_token):
    """Test profile access dengan JWT token"""
    print(f"\n🔍 Testing profile access...")
    try:
        headers = {
            "Authorization": f"Bearer {jwt_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(ENDPOINTS["profile"], headers=headers)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 SmartParking Google OAuth Backend Test")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    # Test 1: Health check
    if not test_health():
        print("❌ Backend tidak running atau ada masalah")
        return
    
    # Test 2: Invalid token
    test_google_auth_invalid()
    
    # Test 3: Missing token
    test_google_auth_missing_token()
    
    # Test 4: Real Google token (manual)
    print("\n" + "="*50)
    print("🔐 TESTING DENGAN REAL GOOGLE TOKEN")
    print("="*50)
    
    # Untuk testing dengan real token, uncomment dan isi token di bawah:
    # real_token = "paste_your_google_id_token_here"
    # jwt_token = test_google_auth_real(real_token)
    # 
    # if jwt_token:
    #     test_token_verify(jwt_token)
    #     test_profile_access(jwt_token)
    
    get_google_token_instructions()
    
    print("\n" + "="*50)
    print("✅ Testing completed!")
    print("Untuk test dengan real Google token, edit script ini dan uncomment bagian real_token")

if __name__ == "__main__":
    main()
