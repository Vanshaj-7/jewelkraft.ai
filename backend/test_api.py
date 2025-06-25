import requests
import json

def test_api():
    print("Starting API test...")
    try:
        # Test the basic endpoint
        print("Testing /api/test endpoint...")
        response = requests.get("http://localhost:5000/api/test")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        print()
        
        # Test the image generation endpoint
        print("Testing /api/generate endpoint...")
        data = {"prompt": "gold ring with diamond"}
        response = requests.post(
            "http://localhost:5000/api/generate",
            headers={"Content-Type": "application/json"},
            json=data,
            timeout=30
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to Flask server. Make sure it's running on port 5000.")
    except requests.exceptions.Timeout:
        print("Error: Request timed out.")
    except Exception as e:
        print(f"Error: {e}")
    
    print("Test completed.")

if __name__ == "__main__":
    test_api() 