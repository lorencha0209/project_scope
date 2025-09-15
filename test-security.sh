#!/bin/bash

# Project Scope - Security Module Test Script
# This script tests the authentication system

echo "🔐 Project Scope - Security Module Test"
echo "======================================"

# Check if server is running
echo "📡 Checking if server is running..."
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please start it with: npm start"
    exit 1
fi

# Test health endpoint (should work without auth)
echo ""
echo "🏥 Testing health endpoint..."
response=$(curl -s http://localhost:3000/api/health)
if echo "$response" | grep -q "OK"; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
    exit 1
fi

# Test protected endpoint without auth (should fail)
echo ""
echo "🔒 Testing protected endpoint without auth..."
response=$(curl -s -w "%{http_code}" http://localhost:3000/api/projects)
if [[ "$response" == *"401"* ]]; then
    echo "✅ Protected endpoint correctly rejects unauthenticated requests"
else
    echo "❌ Protected endpoint should require authentication"
    exit 1
fi

# Test login with correct credentials
echo ""
echo "🔑 Testing login with correct credentials..."
login_response=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"lorena.alvarez","password":"Anto0929**"}')

if echo "$login_response" | grep -q "token"; then
    echo "✅ Login successful"
    token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   Token received: ${token:0:20}..."
else
    echo "❌ Login failed"
    echo "Response: $login_response"
    exit 1
fi

# Test protected endpoint with auth (should work)
echo ""
echo "🔓 Testing protected endpoint with auth..."
projects_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:3000/api/projects)
if echo "$projects_response" | grep -q "projects\|\[\]"; then
    echo "✅ Protected endpoint accessible with valid token"
else
    echo "❌ Protected endpoint should work with valid token"
    echo "Response: $projects_response"
    exit 1
fi

# Test token verification
echo ""
echo "🔍 Testing token verification..."
verify_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:3000/api/auth/verify)
if echo "$verify_response" | grep -q "valid"; then
    echo "✅ Token verification working"
else
    echo "❌ Token verification failed"
    echo "Response: $verify_response"
    exit 1
fi

# Test logout
echo ""
echo "🚪 Testing logout..."
logout_response=$(curl -s -X POST -H "Authorization: Bearer $token" http://localhost:3000/api/auth/logout)
if echo "$logout_response" | grep -q "successful"; then
    echo "✅ Logout successful"
else
    echo "❌ Logout failed"
    echo "Response: $logout_response"
    exit 1
fi

# Test login with wrong credentials
echo ""
echo "❌ Testing login with wrong credentials..."
wrong_login_response=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"lorena.alvarez","password":"wrongpassword"}')

if echo "$wrong_login_response" | grep -q "Authentication failed"; then
    echo "✅ Login correctly rejects wrong credentials"
else
    echo "❌ Login should reject wrong credentials"
    echo "Response: $wrong_login_response"
    exit 1
fi

echo ""
echo "🎉 All security tests passed!"
echo "=============================="
echo "✅ Health endpoint working"
echo "✅ Protected endpoints require auth"
echo "✅ Login with correct credentials works"
echo "✅ Protected endpoints accessible with valid token"
echo "✅ Token verification working"
echo "✅ Logout successful"
echo "✅ Wrong credentials rejected"
echo ""
echo "🔐 Security module is working correctly!"
echo "📱 You can now test the frontend by opening index.html"
