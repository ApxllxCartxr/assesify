import urllib.request
import urllib.parse
import json

BASE_URL = "http://localhost:5000/api"

def make_request(url, data=None, headers=None, method='GET'):
    if headers is None:
        headers = {}
    
    req_data = None
    if data:
        req_data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        try:
            res_body = e.read().decode('utf-8')
            return e.code, json.loads(res_body)
        except:
            return e.code, {"msg": str(e)}

def test_profile_flow():
    email = "test@example.com"
    password = "password123"
    
    print(f"Attempting to login as {email}...")
    status, res = make_request(f"{BASE_URL}/auth/login", data={"email": email, "password": password}, method='POST')
    
    if status != 200:
        print("Login failed. Trying to register first...")
        status, res = make_request(f"{BASE_URL}/auth/register", data={
            "email": email,
            "password": password,
            "full_name": "Test User",
            "is_teacher": False
        }, method='POST')
        print(f"Register status: {status}")
        status, res = make_request(f"{BASE_URL}/auth/login", data={"email": email, "password": password}, method='POST')

    if status != 200:
        print(f"Login still failed: {res}")
        return

    token = res.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Get Profile
    print("Fetching profile...")
    status, res = make_request(f"{BASE_URL}/auth/profile", headers=headers)
    print(f"Profile: {res}")
    
    if status != 200:
        print(f"Failed to fetch profile: {res}")
        return
    
    # 3. Update Profile
    new_name = "Updated User Name"
    print(f"Updating profile name to: {new_name}")
    status, res = make_request(f"{BASE_URL}/auth/update-profile", 
                              headers=headers, 
                              data={"full_name": new_name},
                              method='PUT')
    print(f"Update response: {res}")
    
    if status != 200:
        print(f"Failed to update profile: {res}")
        return
    
    # 4. Verify Update
    print("Verifying update with second fetch...")
    status, res = make_request(f"{BASE_URL}/auth/profile", headers=headers)
    final_name = res.get("full_name")
    print(f"Final Name: {final_name}")
    
    if final_name == new_name:
        print("✅ SUCCESS: Profile updated and verified!")
    else:
        print("❌ FAILURE: Profile name mismatch.")

if __name__ == "__main__":
    try:
        test_profile_flow()
    except Exception as e:
        print(f"Error: {e}")
