#!/usr/bin/env python3
"""
Backend API Test Suite for Atlas Fortune - Round 2
Tests NEW features: Admin auth, admin-protected endpoints, bookings, blogs, email side-effects
"""

import requests
import json
from datetime import datetime

# Base URL from frontend/.env REACT_APP_BACKEND_URL
BASE_URL = "https://fortune-guide-23.preview.emergentagent.com/api"
ADMIN_PASSCODE = "atlas-admin-2025"

def print_test_header(test_name):
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(passed, message):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")

# ============================================================================
# A) ADMIN LOGIN TESTS
# ============================================================================

def test_admin_login_correct():
    """Test POST /api/admin/login with correct passcode"""
    print_test_header("A1: Admin Login - Correct Passcode")
    
    payload = {"passcode": ADMIN_PASSCODE}
    
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("token") == ADMIN_PASSCODE:
                print_result(True, "Admin login successful with correct token")
                return True
            else:
                print_result(False, f"Expected token '{ADMIN_PASSCODE}', got {data.get('token')}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_admin_login_wrong():
    """Test POST /api/admin/login with wrong passcode"""
    print_test_header("A2: Admin Login - Wrong Passcode")
    
    payload = {"passcode": "wrong-passcode"}
    
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print_result(True, "Admin login correctly rejected wrong passcode (401)")
            return True
        else:
            print_result(False, f"Expected status 401, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# B) ADMIN PROTECTION ON LIST ENDPOINTS
# ============================================================================

def test_leads_without_admin_header():
    """Test GET /api/leads WITHOUT X-Admin-Token header"""
    print_test_header("B1: GET /api/leads WITHOUT Admin Header")
    
    try:
        response = requests.get(f"{BASE_URL}/leads")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print_result(True, "GET /api/leads correctly requires admin header (401)")
            return True
        else:
            print_result(False, f"Expected status 401, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_leads_with_admin_header():
    """Test GET /api/leads WITH X-Admin-Token header"""
    print_test_header("B2: GET /api/leads WITH Admin Header")
    
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.get(f"{BASE_URL}/leads", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Number of leads: {len(response.json()) if response.status_code == 200 else 'N/A'}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"GET /api/leads with admin header successful (returned {len(data)} leads)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_applications_without_admin_header():
    """Test GET /api/applications WITHOUT X-Admin-Token header"""
    print_test_header("B3: GET /api/applications WITHOUT Admin Header")
    
    try:
        response = requests.get(f"{BASE_URL}/applications")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print_result(True, "GET /api/applications correctly requires admin header (401)")
            return True
        else:
            print_result(False, f"Expected status 401, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_applications_with_admin_header():
    """Test GET /api/applications WITH X-Admin-Token header"""
    print_test_header("B4: GET /api/applications WITH Admin Header")
    
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.get(f"{BASE_URL}/applications", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Number of applications: {len(response.json()) if response.status_code == 200 else 'N/A'}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"GET /api/applications with admin header successful (returned {len(data)} applications)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_bookings_without_admin_header():
    """Test GET /api/bookings WITHOUT X-Admin-Token header"""
    print_test_header("B5: GET /api/bookings WITHOUT Admin Header")
    
    try:
        response = requests.get(f"{BASE_URL}/bookings")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print_result(True, "GET /api/bookings correctly requires admin header (401)")
            return True
        else:
            print_result(False, f"Expected status 401, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_bookings_with_admin_header():
    """Test GET /api/bookings WITH X-Admin-Token header"""
    print_test_header("B6: GET /api/bookings WITH Admin Header")
    
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.get(f"{BASE_URL}/bookings", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Number of bookings: {len(response.json()) if response.status_code == 200 else 'N/A'}")
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"GET /api/bookings with admin header successful (returned {len(data)} bookings)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# C) BOOKINGS TESTS
# ============================================================================

def test_bookings_availability():
    """Test GET /api/bookings/availability?date=2026-10-01"""
    print_test_header("C1: Bookings Availability")
    
    try:
        response = requests.get(f"{BASE_URL}/bookings/availability?date=2026-10-01")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {data.keys()}")
            print(f"All slots count: {len(data.get('all_slots', []))}")
            print(f"Available slots count: {len(data.get('available', []))}")
            print(f"Booked slots count: {len(data.get('booked', []))}")
            
            checks = []
            checks.append(("all_slots" in data, "Has 'all_slots' key"))
            checks.append(("available" in data, "Has 'available' key"))
            checks.append(("booked" in data, "Has 'booked' key"))
            checks.append((len(data.get("all_slots", [])) == 18, "Has 18 total slots"))
            
            all_passed = all(check[0] for check in checks)
            for passed, msg in checks:
                print_result(passed, msg)
            
            return all_passed
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_booking_valid():
    """Test POST /api/bookings with valid data"""
    print_test_header("C2: Create Booking - Valid Data")
    
    payload = {
        "name": "Amit Verma",
        "email": "amit.verma@example.com",
        "phone": "+91 9000000000",
        "date": "2026-10-01",
        "slot": "11:00 AM"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/bookings", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            checks = []
            checks.append(("id" in data and isinstance(data["id"], str), "Has valid id (uuid string)"))
            checks.append((data.get("name") == payload["name"], "Name matches"))
            checks.append((data.get("email") == payload["email"], "Email matches"))
            checks.append((data.get("phone") == payload["phone"], "Phone matches"))
            checks.append((data.get("date") == payload["date"], "Date matches"))
            checks.append((data.get("slot") == payload["slot"], "Slot matches"))
            checks.append(("created_at" in data and isinstance(data["created_at"], str), "Has created_at (ISO string)"))
            
            all_passed = all(check[0] for check in checks)
            for passed, msg in checks:
                print_result(passed, msg)
            
            # Store booking_id for later tests
            global test_booking_id
            test_booking_id = data.get("id")
            
            return all_passed
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_booking_duplicate_slot():
    """Test POST /api/bookings with same date+slot (should return 409)"""
    print_test_header("C3: Create Booking - Duplicate Slot (409)")
    
    payload = {
        "name": "Another Person",
        "email": "another@example.com",
        "phone": "+91 9111111111",
        "date": "2026-10-01",
        "slot": "11:00 AM"  # Same as previous test
    }
    
    try:
        response = requests.post(f"{BASE_URL}/bookings", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 409:
            print_result(True, "Duplicate slot correctly rejected (409)")
            return True
        else:
            print_result(False, f"Expected status 409 for duplicate slot, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_booking_invalid_slot():
    """Test POST /api/bookings with invalid slot (should return 400)"""
    print_test_header("C4: Create Booking - Invalid Slot (400)")
    
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+91 9222222222",
        "date": "2026-10-01",
        "slot": "09:00 AM"  # Invalid - not in the 18 slots (starts at 10:00 AM)
    }
    
    try:
        response = requests.post(f"{BASE_URL}/bookings", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            print_result(True, "Invalid slot correctly rejected (400)")
            return True
        else:
            print_result(False, f"Expected status 400 for invalid slot, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_bookings_availability_after_booking():
    """Test GET /api/bookings/availability after booking - 11:00 AM should not be available"""
    print_test_header("C5: Bookings Availability After Booking")
    
    try:
        response = requests.get(f"{BASE_URL}/bookings/availability?date=2026-10-01")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            available = data.get("available", [])
            booked = data.get("booked", [])
            
            print(f"Available slots: {available}")
            print(f"Booked slots: {booked}")
            
            checks = []
            checks.append(("11:00 AM" not in available, "11:00 AM not in available slots"))
            checks.append(("11:00 AM" in booked, "11:00 AM in booked slots"))
            
            all_passed = all(check[0] for check in checks)
            for passed, msg in checks:
                print_result(passed, msg)
            
            return all_passed
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# D) PATCH/DELETE TESTS (Admin Protected)
# ============================================================================

def test_patch_lead_with_admin():
    """Test PATCH /api/leads/{id} with admin header"""
    print_test_header("D1: PATCH Lead - With Admin Header")
    
    # First create a lead
    payload = {
        "name": "Test Lead for PATCH",
        "email": "patchtest@example.com",
        "phone": "+91 9333333333",
        "message": "Test message",
        "source": "test"
    }
    
    try:
        # Create lead
        response = requests.post(f"{BASE_URL}/leads", json=payload)
        if response.status_code != 200:
            print_result(False, f"Failed to create test lead: {response.status_code}")
            return False
        
        lead_id = response.json()["id"]
        print(f"Created lead with id: {lead_id}")
        
        # PATCH with admin header
        headers = {"X-Admin-Token": ADMIN_PASSCODE}
        patch_payload = {"handled": True}
        
        response = requests.patch(f"{BASE_URL}/leads/{lead_id}", json=patch_payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("handled") == True:
                print_result(True, "PATCH /api/leads with admin header successful, handled=true")
                
                # Store for DELETE test
                global test_lead_id
                test_lead_id = lead_id
                
                return True
            else:
                print_result(False, f"Expected handled=true, got {data.get('handled')}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_patch_lead_without_admin():
    """Test PATCH /api/leads/{id} without admin header (should return 401)"""
    print_test_header("D2: PATCH Lead - Without Admin Header (401)")
    
    # Use the lead_id from previous test
    if 'test_lead_id' not in globals():
        print_result(False, "No test_lead_id available from previous test")
        return False
    
    try:
        patch_payload = {"handled": False}
        response = requests.patch(f"{BASE_URL}/leads/{test_lead_id}", json=patch_payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print_result(True, "PATCH /api/leads without admin header correctly rejected (401)")
            return True
        else:
            print_result(False, f"Expected status 401, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_delete_lead_with_admin():
    """Test DELETE /api/leads/{id} with admin header"""
    print_test_header("D3: DELETE Lead - With Admin Header")
    
    if 'test_lead_id' not in globals():
        print_result(False, "No test_lead_id available from previous test")
        return False
    
    try:
        headers = {"X-Admin-Token": ADMIN_PASSCODE}
        response = requests.delete(f"{BASE_URL}/leads/{test_lead_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "deleted":
                print_result(True, "DELETE /api/leads with admin header successful")
                return True
            else:
                print_result(False, f"Expected status='deleted', got {data}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_patch_application_with_admin():
    """Test PATCH /api/applications/{id} with admin header (spot check)"""
    print_test_header("D4: PATCH Application - With Admin Header (Spot Check)")
    
    # Create an application
    payload = {
        "name": "Test App for PATCH",
        "email": "apptest@example.com",
        "phone": "+91 9444444444",
        "job_title": "Test Role",
        "note": "Test note"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/applications", json=payload)
        if response.status_code != 200:
            print_result(False, f"Failed to create test application: {response.status_code}")
            return False
        
        app_id = response.json()["id"]
        print(f"Created application with id: {app_id}")
        
        # PATCH with admin header
        headers = {"X-Admin-Token": ADMIN_PASSCODE}
        patch_payload = {"handled": True}
        
        response = requests.patch(f"{BASE_URL}/applications/{app_id}", json=patch_payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("handled") == True:
                print_result(True, "PATCH /api/applications with admin header successful")
                return True
            else:
                print_result(False, f"Expected handled=true, got {data.get('handled')}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_delete_booking_with_admin():
    """Test DELETE /api/bookings/{id} with admin header (spot check)"""
    print_test_header("D5: DELETE Booking - With Admin Header (Spot Check)")
    
    if 'test_booking_id' not in globals():
        print_result(False, "No test_booking_id available from previous test")
        return False
    
    try:
        headers = {"X-Admin-Token": ADMIN_PASSCODE}
        response = requests.delete(f"{BASE_URL}/bookings/{test_booking_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "deleted":
                print_result(True, "DELETE /api/bookings with admin header successful")
                return True
            else:
                print_result(False, f"Expected status='deleted', got {data}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# E) BLOGS TESTS
# ============================================================================

def test_get_blogs_list():
    """Test GET /api/blogs returns list of at least 3 seeded articles"""
    print_test_header("E1: GET /api/blogs - List (Public)")
    
    try:
        response = requests.get(f"{BASE_URL}/blogs")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of blogs: {len(data)}")
            
            if len(data) >= 3:
                print(f"First blog: {data[0].get('title', 'N/A')}")
                print_result(True, f"GET /api/blogs returns {len(data)} articles (>= 3 seeded)")
                return True
            else:
                print_result(False, f"Expected at least 3 seeded articles, got {len(data)}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_get_blog_by_slug_valid():
    """Test GET /api/blogs/{slug} with valid slug"""
    print_test_header("E2: GET /api/blogs/{slug} - Valid Slug (Public)")
    
    slug = "investment-consulting-for-wealth-growth"
    
    try:
        response = requests.get(f"{BASE_URL}/blogs/{slug}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Blog title: {data.get('title', 'N/A')}")
            print(f"Content paragraphs: {len(data.get('content', []))}")
            
            checks = []
            checks.append(("slug" in data, "Has slug field"))
            checks.append(("title" in data, "Has title field"))
            checks.append(("content" in data and isinstance(data["content"], list), "Has content array"))
            
            all_passed = all(check[0] for check in checks)
            for passed, msg in checks:
                print_result(passed, msg)
            
            return all_passed
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_get_blog_by_slug_invalid():
    """Test GET /api/blogs/{slug} with invalid slug (should return 404)"""
    print_test_header("E3: GET /api/blogs/{slug} - Invalid Slug (404)")
    
    slug = "does-not-exist"
    
    try:
        response = requests.get(f"{BASE_URL}/blogs/{slug}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 404:
            print_result(True, "GET /api/blogs/{invalid-slug} correctly returns 404")
            return True
        else:
            print_result(False, f"Expected status 404, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_blog_with_admin():
    """Test POST /api/blogs with admin header"""
    print_test_header("E4: POST /api/blogs - With Admin Header")
    
    payload = {
        "slug": "test-article",
        "title": "Test Article",
        "category": "Investment",
        "date": "May 1, 2025",
        "read": "3 min read",
        "excerpt": "This is a test article",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
        "content": ["Paragraph one", "Paragraph two"],
        "featured": False
    }
    
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.post(f"{BASE_URL}/blogs", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            
            checks = []
            checks.append((data.get("slug") == payload["slug"], "Slug matches"))
            checks.append((data.get("title") == payload["title"], "Title matches"))
            checks.append(("id" in data, "Has id field"))
            checks.append(("created_at" in data, "Has created_at field"))
            
            all_passed = all(check[0] for check in checks)
            for passed, msg in checks:
                print_result(passed, msg)
            
            return all_passed
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_blog_duplicate_slug():
    """Test POST /api/blogs with duplicate slug (should return 409)"""
    print_test_header("E5: POST /api/blogs - Duplicate Slug (409)")
    
    payload = {
        "slug": "test-article",  # Same as previous test
        "title": "Another Test Article",
        "category": "Investment",
        "date": "May 2, 2025",
        "read": "3 min read",
        "excerpt": "Another test",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
        "content": ["Test"],
        "featured": False
    }
    
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.post(f"{BASE_URL}/blogs", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 409:
            print_result(True, "POST /api/blogs with duplicate slug correctly returns 409")
            return True
        else:
            print_result(False, f"Expected status 409, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_create_blog_without_admin():
    """Test POST /api/blogs without admin header (should return 401)"""
    print_test_header("E6: POST /api/blogs - Without Admin Header (401)")
    
    payload = {
        "slug": "unauthorized-article",
        "title": "Unauthorized",
        "category": "Test",
        "date": "May 1, 2025",
        "read": "1 min read",
        "excerpt": "Test",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
        "content": ["Test"],
        "featured": False
    }
    
    try:
        response = requests.post(f"{BASE_URL}/blogs", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print_result(True, "POST /api/blogs without admin header correctly returns 401")
            return True
        else:
            print_result(False, f"Expected status 401, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_update_blog_with_admin():
    """Test PUT /api/blogs/{slug} with admin header"""
    print_test_header("E7: PUT /api/blogs/{slug} - With Admin Header")
    
    slug = "test-article"
    payload = {
        "slug": slug,
        "title": "Updated Test Article",  # Changed title
        "category": "Investment",
        "date": "May 1, 2025",
        "read": "3 min read",
        "excerpt": "This is an updated test article",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
        "content": ["Updated paragraph one", "Updated paragraph two"],
        "featured": False
    }
    
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.put(f"{BASE_URL}/blogs/{slug}", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("title") == "Updated Test Article":
                print_result(True, "PUT /api/blogs/{slug} with admin header successful, title updated")
                return True
            else:
                print_result(False, f"Expected updated title, got {data.get('title')}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_delete_blog_with_admin():
    """Test DELETE /api/blogs/{slug} with admin header"""
    print_test_header("E8: DELETE /api/blogs/{slug} - With Admin Header")
    
    slug = "test-article"
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.delete(f"{BASE_URL}/blogs/{slug}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "deleted":
                print_result(True, "DELETE /api/blogs/{slug} with admin header successful")
                return True
            else:
                print_result(False, f"Expected status='deleted', got {data}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_delete_blog_unknown_slug():
    """Test DELETE /api/blogs/{slug} with unknown slug (should return 404)"""
    print_test_header("E9: DELETE /api/blogs/{slug} - Unknown Slug (404)")
    
    slug = "unknown-article"
    headers = {"X-Admin-Token": ADMIN_PASSCODE}
    
    try:
        response = requests.delete(f"{BASE_URL}/blogs/{slug}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 404:
            print_result(True, "DELETE /api/blogs/{unknown-slug} correctly returns 404")
            return True
        else:
            print_result(False, f"Expected status 404, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# F) EMAIL SIDE-EFFECT TESTS
# ============================================================================

def test_email_lead_creation():
    """Test that creating a lead returns 200 even with background email"""
    print_test_header("F1: Email Side-Effect - Lead Creation")
    
    payload = {
        "name": "Email Test Lead",
        "email": "emailtest@example.com",
        "phone": "+91 9555555555",
        "message": "Testing email side-effect",
        "source": "test"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/leads", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "Lead creation returns 200 (email sent in background)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_email_application_creation():
    """Test that creating an application returns 200 even with background email"""
    print_test_header("F2: Email Side-Effect - Application Creation")
    
    payload = {
        "name": "Email Test Application",
        "email": "emailapptest@example.com",
        "phone": "+91 9666666666",
        "job_title": "Test Role",
        "note": "Testing email side-effect"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/applications", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "Application creation returns 200 (email sent in background)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_email_booking_creation():
    """Test that creating a booking returns 200 even with background email"""
    print_test_header("F3: Email Side-Effect - Booking Creation")
    
    payload = {
        "name": "Email Test Booking",
        "email": "emailbooktest@example.com",
        "phone": "+91 9777777777",
        "date": "2026-11-01",
        "slot": "10:00 AM"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/bookings", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "Booking creation returns 200 (email sent in background)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# REGRESSION TESTS
# ============================================================================

def test_regression_root():
    """Test GET /api/ returns Hello World (regression)"""
    print_test_header("REGRESSION: GET /api/")
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print_result(True, "GET /api/ still works (regression)")
                return True
            else:
                print_result(False, f"Expected message 'Hello World', got {data}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_regression_status_post():
    """Test POST /api/status still works (regression)"""
    print_test_header("REGRESSION: POST /api/status")
    
    payload = {"client_name": "regression_tester"}
    
    try:
        response = requests.post(f"{BASE_URL}/status", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "POST /api/status still works (regression)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_regression_status_get():
    """Test GET /api/status still works and is NOT admin-protected (regression)"""
    print_test_header("REGRESSION: GET /api/status (NOT Admin-Protected)")
    
    try:
        # Test without admin header - should work
        response = requests.get(f"{BASE_URL}/status")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print_result(True, "GET /api/status still works WITHOUT admin header (regression)")
            return True
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("ATLAS FORTUNE BACKEND API TEST SUITE - ROUND 2")
    print(f"Base URL: {BASE_URL}")
    print(f"Admin Passcode: {ADMIN_PASSCODE}")
    print("="*80)
    
    results = {}
    
    # A) Admin Login Tests
    results["A1: Admin Login - Correct"] = test_admin_login_correct()
    results["A2: Admin Login - Wrong"] = test_admin_login_wrong()
    
    # B) Admin Protection Tests
    results["B1: GET /api/leads WITHOUT header"] = test_leads_without_admin_header()
    results["B2: GET /api/leads WITH header"] = test_leads_with_admin_header()
    results["B3: GET /api/applications WITHOUT header"] = test_applications_without_admin_header()
    results["B4: GET /api/applications WITH header"] = test_applications_with_admin_header()
    results["B5: GET /api/bookings WITHOUT header"] = test_bookings_without_admin_header()
    results["B6: GET /api/bookings WITH header"] = test_bookings_with_admin_header()
    
    # C) Bookings Tests
    results["C1: Bookings Availability"] = test_bookings_availability()
    results["C2: Create Booking - Valid"] = test_create_booking_valid()
    results["C3: Create Booking - Duplicate Slot"] = test_create_booking_duplicate_slot()
    results["C4: Create Booking - Invalid Slot"] = test_create_booking_invalid_slot()
    results["C5: Availability After Booking"] = test_bookings_availability_after_booking()
    
    # D) PATCH/DELETE Tests
    results["D1: PATCH Lead - With Admin"] = test_patch_lead_with_admin()
    results["D2: PATCH Lead - Without Admin"] = test_patch_lead_without_admin()
    results["D3: DELETE Lead - With Admin"] = test_delete_lead_with_admin()
    results["D4: PATCH Application - With Admin"] = test_patch_application_with_admin()
    results["D5: DELETE Booking - With Admin"] = test_delete_booking_with_admin()
    
    # E) Blogs Tests
    results["E1: GET /api/blogs - List"] = test_get_blogs_list()
    results["E2: GET /api/blogs/{slug} - Valid"] = test_get_blog_by_slug_valid()
    results["E3: GET /api/blogs/{slug} - Invalid"] = test_get_blog_by_slug_invalid()
    results["E4: POST /api/blogs - With Admin"] = test_create_blog_with_admin()
    results["E5: POST /api/blogs - Duplicate Slug"] = test_create_blog_duplicate_slug()
    results["E6: POST /api/blogs - Without Admin"] = test_create_blog_without_admin()
    results["E7: PUT /api/blogs/{slug} - With Admin"] = test_update_blog_with_admin()
    results["E8: DELETE /api/blogs/{slug} - With Admin"] = test_delete_blog_with_admin()
    results["E9: DELETE /api/blogs/{slug} - Unknown"] = test_delete_blog_unknown_slug()
    
    # F) Email Side-Effect Tests
    results["F1: Email - Lead Creation"] = test_email_lead_creation()
    results["F2: Email - Application Creation"] = test_email_application_creation()
    results["F3: Email - Booking Creation"] = test_email_booking_creation()
    
    # Regression Tests
    results["REGRESSION: GET /api/"] = test_regression_root()
    results["REGRESSION: POST /api/status"] = test_regression_status_post()
    results["REGRESSION: GET /api/status"] = test_regression_status_get()
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    # Group results by category
    categories = {
        "A) Admin Login": [k for k in results.keys() if k.startswith("A")],
        "B) Admin Protection": [k for k in results.keys() if k.startswith("B")],
        "C) Bookings": [k for k in results.keys() if k.startswith("C")],
        "D) PATCH/DELETE": [k for k in results.keys() if k.startswith("D")],
        "E) Blogs": [k for k in results.keys() if k.startswith("E")],
        "F) Email Side-Effects": [k for k in results.keys() if k.startswith("F")],
        "Regression": [k for k in results.keys() if k.startswith("REGRESSION")],
    }
    
    for category, tests in categories.items():
        print(f"\n{category}:")
        for test_name in tests:
            result = results[test_name]
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"  {status}: {test_name}")
    
    print(f"\n{'='*80}")
    print(f"Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
