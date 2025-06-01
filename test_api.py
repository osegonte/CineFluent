#!/usr/bin/env python3
"""
Test script for CineFluent Stage 2 API
Run this to test your authentication, gamification, and learning endpoints
"""

import asyncio
import httpx
import json


async def test_api():
    """Test the CineFluent API endpoints"""
    base_url = "http://localhost:8000"
    
    async with httpx.AsyncClient() as client:
        print("🧪 Testing CineFluent API...")
        
        # Test 1: Root endpoint
        print("\n1. Root Endpoint")
        try:
            response = await client.get(f"{base_url}/")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                root = response.json()
                print(f"   Message: {root['message']}")
                print(f"   Version: {root['version']}")
        except Exception as e:
            print(f"   Error connecting: {e}")
            return
        
        # Test 2: Health check
        print("\n2. Health Check")
        try:
            response = await client.get(f"{base_url}/health")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                health = response.json()
                print(f"   Overall: {health['status']}")
                print(f"   Database: {health['database']['status']}")
                print(f"   Redis: {health['redis']['status']}")
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Error: {e}")
            return
        
        # Test 3: User Registration
        print("\n3. User Registration")
        user_data = {
            "email": "test@cinefluent.app",
            "password": "TestPass123",
            "confirm_password": "TestPass123"
        }
        
        access_token = None
        
        try:
            response = await client.post(
                f"{base_url}/api/v1/auth/register",
                json=user_data
            )
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 201:
                tokens = response.json()
                access_token = tokens["access_token"]
                print("   ✅ User registered successfully")
                print(f"   Token type: {tokens['token_type']}")
                
            elif response.status_code == 400:
                error = response.json()
                if "already registered" in error.get("detail", ""):
                    print("   ℹ️ User already exists - testing login instead")
                    
                    # Test login instead
                    login_data = {
                        "email": user_data["email"],
                        "password": user_data["password"]
                    }
                    login_response = await client.post(
                        f"{base_url}/api/v1/auth/login",
                        json=login_data
                    )
                    print(f"   Login Status: {login_response.status_code}")
                    if login_response.status_code == 200:
                        tokens = login_response.json()
                        access_token = tokens["access_token"]
                        print("   ✅ Login successful")
                else:
                    print(f"   Error: {error}")
            else:
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"   Error: {e}")
        
        # Only continue if we have a token
        if not access_token:
            print("\n❌ Cannot continue without authentication token")
            return
            
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Test 4: Get user profile
        print("\n4. User Profile")
        try:
            profile_response = await client.get(
                f"{base_url}/api/v1/auth/me",
                headers=headers
            )
            print(f"   Status: {profile_response.status_code}")
            if profile_response.status_code == 200:
                profile = profile_response.json()
                print(f"   Email: {profile['email']}")
                print(f"   Premium: {profile['is_premium']}")
                print(f"   Current Streak: {profile['current_streak']}")
                print(f"   Words Learned: {profile['words_learned']}")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 5: Gamification - Get Streak
        print("\n5. Gamification - Streak")
        try:
            streak_response = await client.get(
                f"{base_url}/api/v1/gamification/streak",
                headers=headers
            )
            print(f"   Status: {streak_response.status_code}")
            if streak_response.status_code == 200:
                streak = streak_response.json()
                print(f"   Current: {streak['current_streak']}")
                print(f"   Longest: {streak['longest_streak']}")
                print(f"   Last Active: {streak['last_active']}")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 6: Gamification - Progress
        print("\n6. Gamification - Progress")
        try:
            progress_response = await client.get(
                f"{base_url}/api/v1/gamification/progress",
                headers=headers
            )
            print(f"   Status: {progress_response.status_code}")
            if progress_response.status_code == 200:
                progress = progress_response.json()
                print(f"   Words Learned: {progress['words_learned']}")
                print(f"   Words Mastered: {progress['words_mastered']}")
                print(f"   Weekly Goal: {progress['weekly_goal']} minutes")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 7: Learning - Continue Learning
        print("\n7. Learning - Continue Learning")
        try:
            learning_response = await client.get(
                f"{base_url}/api/v1/learning/continue",
                headers=headers
            )
            print(f"   Status: {learning_response.status_code}")
            if learning_response.status_code == 200:
                learning = learning_response.json()
                print(f"   Has Active Session: {learning['has_active_session']}")
                print(f"   Recent Movies: {len(learning['recent_movies'])}")
                if learning['recommended_movie']:
                    movie = learning['recommended_movie']
                    print(f"   Recommended: {movie['movie_title']}")
                    print(f"   Progress: {movie['progress_percentage']:.1f}%")
        except Exception as e:
            print(f"   Error: {e}")
        
        # Test 8: API Documentation
        print("\n8. API Documentation")
        try:
            docs_response = await client.get(f"{base_url}/docs")
            print(f"   Status: {docs_response.status_code}")
            if docs_response.status_code == 200:
                print("   ✅ API docs available")
        except Exception as e:
            print(f"   Error: {e}")
        
        print(f"\n✅ API testing complete!")
        print(f"\n📋 Useful URLs:")
        print(f"   • API Server: {base_url}")
        print(f"   • API Docs: {base_url}/docs")
        print(f"   • Health Check: {base_url}/health")
        print(f"\n🔧 Next Steps:")
        print(f"   • Visit {base_url}/docs for interactive API testing")
        print(f"   • Load test subtitles: python -m cinefluent.ingest upload 'Test Movie' --en-file test_en.srt --de-file test_de.srt")
        print(f"   • Check database status: python -m cinefluent.ingest status")


if __name__ == "__main__":
    asyncio.run(test_api())