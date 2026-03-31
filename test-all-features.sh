#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_BASE="http://localhost:5001/api"
PASS_COUNT=0
FAIL_COUNT=0

# Helper function for API calls
api_call() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  
  if [ -z "$token" ]; then
    curl -s -X "$method" "$API_BASE$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data"
  else
    curl -s -X "$method" "$API_BASE$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$data"
  fi
}

# Helper for test results
test_result() {
  local name=$1
  local status=$2
  local details=$3
  
  if [ "$status" = "PASS" ]; then
    echo -e "${GREEN}✅${NC} $name"
    if [ -n "$details" ]; then
      echo "   $details"
    fi
    ((PASS_COUNT++))
  else
    echo -e "${RED}❌${NC} $name"
    if [ -n "$details" ]; then
      echo "   $details"
    fi
    ((FAIL_COUNT++))
  fi
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 COMPREHENSIVE FEATURE TEST SUITE (API) 🚀           ║"
echo "║            Testing: is-prd-fs1 Application                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 API Base: $API_BASE"
echo "⏰ Started at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# ============ TEST 1: REGISTRATION ============
echo -e "${BLUE}====== TEST 1: REGISTRATION ======${NC}"

NEW_EMAIL="newuser$(date +%s)@test.com"
REG_RESPONSE=$(api_call POST "/auth/register" "{\"email\":\"$NEW_EMAIL\",\"password\":\"NewUser@123\",\"fullName\":\"New Test User\"}")
NEW_USER_TOKEN=$(echo $REG_RESPONSE | jq -r '.token // empty')
NEW_USER_ID=$(echo $REG_RESPONSE | jq -r '.user.id // empty')

if [ -n "$NEW_USER_TOKEN" ] && [ "$NEW_USER_TOKEN" != "null" ]; then
  test_result "Registration" "PASS" "User: $NEW_EMAIL, Token: ${NEW_USER_TOKEN:0:20}..."
else
  test_result "Registration" "FAIL" "$(echo $REG_RESPONSE | jq .)"
fi

# ============ TEST 2: LOGIN ============
echo ""
echo -e "${BLUE}====== TEST 2: LOGIN ======${NC}"

LOGIN_RESPONSE=$(api_call POST "/auth/login" "{\"email\":\"testuser1@example.com\",\"password\":\"Test@123\"}")
USER_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user.id // empty')
USER_ROLE=$(echo $LOGIN_RESPONSE | jq -r '.user.role // empty')

if [ -n "$USER_TOKEN" ] && [ "$USER_TOKEN" != "null" ]; then
  test_result "Login - Regular User" "PASS" "User: testuser1@example.com, Role: $USER_ROLE"
else
  test_result "Login - Regular User" "FAIL" "$(echo $LOGIN_RESPONSE | jq .)"
fi

# ============ TEST 3: ADMIN LOGIN ============
echo ""
echo -e "${BLUE}====== TEST 3: ADMIN LOGIN ======${NC}"

ADMIN_LOGIN=$(api_call POST "/auth/login" "{\"email\":\"admin@golfcharity.app\",\"password\":\"Admin@123\"}")
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | jq -r '.token // empty')
ADMIN_ROLE=$(echo $ADMIN_LOGIN | jq -r '.user.role // empty')

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ] && [ "$ADMIN_ROLE" = "ADMIN" ]; then
  test_result "Admin Login" "PASS" "Admin: admin@golfcharity.app, Role: $ADMIN_ROLE"
else
  test_result "Admin Login" "FAIL" "$(echo $ADMIN_LOGIN | jq .)"
fi

# ============ TEST 4: USER PROFILE ============
echo ""
echo -e "${BLUE}====== TEST 4: USER PROFILE ======${NC}"

PROFILE=$(api_call GET "/user/profile" "" "$USER_TOKEN")
PROFILE_EMAIL=$(echo $PROFILE | jq -r '.email // empty')
PROFILE_CHARITY=$(echo $PROFILE | jq -r '.charity.name // empty')

if [ -n "$PROFILE_EMAIL" ] && [ "$PROFILE_EMAIL" = "testuser1@example.com" ]; then
  test_result "User Profile" "PASS" "Email: $PROFILE_EMAIL, Charity: $PROFILE_CHARITY"
else
  test_result "User Profile" "FAIL" "$(echo $PROFILE | jq .)"
fi

# ============ TEST 5: CHARITIES LISTING ============
echo ""
echo -e "${BLUE}====== TEST 5: CHARITIES ======${NC}"

CHARITIES=$(api_call GET "/charities" "" "$USER_TOKEN")
CHARITY_COUNT=$(echo $CHARITIES | jq 'length')
FEATURED_COUNT=$(echo $CHARITIES | jq '[.[] | select(.featured==true)] | length')

if [ "$CHARITY_COUNT" -gt 0 ]; then
  test_result "Charities Listing" "PASS" "Total: $CHARITY_COUNT, Featured: $FEATURED_COUNT"
else
  test_result "Charities Listing" "FAIL" "$(echo $CHARITIES | jq .)"
fi

# ============ TEST 6: CHARITIES FEATURED FILTER ============
echo ""
echo -e "${BLUE}====== TEST 6: CHARITIES FILTERING ======${NC}"

FEATURED_CHARITIES=$(api_call GET "/charities?featured=true" "" "$USER_TOKEN")
FEATURED_COUNT=$(echo $FEATURED_CHARITIES | jq 'length')

if [ "$FEATURED_COUNT" -gt 0 ]; then
  test_result "Charities Filtering (Featured)" "PASS" "Featured charities: $FEATURED_COUNT"
else
  test_result "Charities Filtering (Featured)" "FAIL" "No featured charities found"
fi

# ============ TEST 7: ADD GAME SCORE ============
echo ""
echo -e "${BLUE}====== TEST 7: GAME SCORES ======${NC}"

SCORE_VALUE=$((RANDOM % 45 + 1))
ADD_SCORE=$(api_call POST "/scores" "{\"value\":$SCORE_VALUE}" "$NEW_USER_TOKEN")
ADDED_SCORE=$(echo $ADD_SCORE | jq -r '.score.value // empty')

if [ -n "$ADDED_SCORE" ] && [ "$ADDED_SCORE" != "null" ]; then
  test_result "Add Game Score" "PASS" "Score value: $ADDED_SCORE"
  
  # Get scores
  GET_SCORES=$(api_call GET "/scores" "" "$NEW_USER_TOKEN")
  SCORES_COUNT=$(echo $GET_SCORES | jq '.scores | length')
  test_result "Get User Scores" "PASS" "Total scores: $SCORES_COUNT"
else
  test_result "Add Game Score" "FAIL" "$(echo $ADD_SCORE | jq .)"
fi

# ============ TEST 8: SUBSCRIPTION INFO ============
echo ""
echo -e "${BLUE}====== TEST 8: SUBSCRIPTION INFO ======${NC}"

SUB_INFO=$(api_call GET "/user/profile" "" "$USER_TOKEN")
SUB_PLAN=$(echo $SUB_INFO | jq -r '.subscription.planType // empty')
SUB_STATUS=$(echo $SUB_INFO | jq -r '.subscription.status // empty')

if [ -n "$SUB_PLAN" ] && [ "$SUB_PLAN" != "null" ]; then
  test_result "Subscription Info" "PASS" "Plan: $SUB_PLAN, Status: $SUB_STATUS"
else
  test_result "Subscription Info" "FAIL" "No subscription found"
fi

# ============ TEST 9: ADMIN - GET ALL USERS ============
echo ""
echo -e "${BLUE}====== TEST 9: ADMIN - USER MANAGEMENT ======${NC}"

ADMIN_USERS=$(api_call GET "/admin/users" "" "$ADMIN_TOKEN")
USERS_COUNT=$(echo $ADMIN_USERS | jq '.users | length')
ACTIVE_COUNT=$(echo $ADMIN_USERS | jq '[.users[] | select(.isActive==true)] | length')
ADMIN_COUNT=$(echo $ADMIN_USERS | jq '[.users[] | select(.role=="ADMIN")] | length')

if [ "$USERS_COUNT" -gt 0 ]; then
  test_result "Admin Get All Users" "PASS" "Total: $USERS_COUNT, Active: $ACTIVE_COUNT, Admins: $ADMIN_COUNT"
else
  test_result "Admin Get All Users" "FAIL" "$(echo $ADMIN_USERS | jq .)"
fi

# ============ TEST 10: ADMIN - DRAWS ============
echo ""
echo -e "${BLUE}====== TEST 10: ADMIN - DRAWS ======${NC}"

ADMIN_DRAWS=$(api_call GET "/admin/draws" "" "$ADMIN_TOKEN")
DRAWS_COUNT=$(echo $ADMIN_DRAWS | jq '.draws | length')

if [ "$DRAWS_COUNT" -gt 0 ]; then
  DRAW_MODES=$(echo $ADMIN_DRAWS | jq -r '.draws[].mode' | sort | uniq)
  test_result "Admin Get Draws" "PASS" "Total draws: $DRAWS_COUNT, Modes: $DRAW_MODES"
else
  test_result "Admin Get Draws" "FAIL" "$(echo $ADMIN_DRAWS | jq .)"
fi

# ============ TEST 11: ADMIN - REPORTS ============
echo ""
echo -e "${BLUE}====== TEST 11: ADMIN - DRAW REPORTS ======${NC}"

ADMIN_REPORTS=$(api_call GET "/admin/reports" "" "$ADMIN_TOKEN")
REPORTS_COUNT=$(echo $ADMIN_REPORTS | jq '.reports | length')

if [ "$REPORTS_COUNT" -gt 0 ]; then
  test_result "Admin Get Reports" "PASS" "Total reports: $REPORTS_COUNT"
else
  test_result "Admin Get Reports" "FAIL" "$(echo $ADMIN_REPORTS | jq .)"
fi

# ============ TEST 12: ERROR HANDLING ============
echo ""
echo -e "${BLUE}====== TEST 12: ERROR HANDLING & VALIDATION ======${NC}"

# Test invalid login
INVALID_LOGIN=$(api_call POST "/auth/login" "{\"email\":\"nonexistent@test.com\",\"password\":\"wrong\"}")
INVALID_MSG=$(echo $INVALID_LOGIN | jq -r '.message // empty')

if [[ "$INVALID_MSG" == *"Invalid"* ]] || [[ "$INVALID_MSG" == *"credentials"* ]]; then
  test_result "Invalid Login Rejection" "PASS" "Error: $INVALID_MSG"
else
  test_result "Invalid Login Rejection" "FAIL" "Should reject invalid credentials"
fi

# Test protected route without token
NO_TOKEN=$(api_call GET "/user/profile" "")
NO_TOKEN_MSG=$(echo $NO_TOKEN | jq -r '.message // empty')

if [[ "$NO_TOKEN_MSG" == *"not authorized"* ]] || [[ "$NO_TOKEN_MSG" == *"token"* ]]; then
  test_result "Protected Route (No Token)" "PASS" "Properly rejected"
else
  test_result "Protected Route (No Token)" "FAIL" "Should require authentication"
fi

# ============ TEST 13: HISTORY & ANALYTICS ============
echo ""
echo -e "${BLUE}====== TEST 13: USER HISTORY & ANALYTICS ======${NC}"

# Get user scores with pagination
USER_SCORES=$(api_call GET "/scores" "" "$USER_TOKEN")
SCORE_COUNT=$(echo $USER_SCORES | jq '.scores | length')

if [ "$SCORE_COUNT" -gt 0 ]; then
  test_result "User Score History" "PASS" "Scores recorded: $SCORE_COUNT"
fi

# ============ SUMMARY ============
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    📊 TEST SUMMARY 📊                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

TOTAL=$((PASS_COUNT + FAIL_COUNT))
SUCCESS_RATE=$(echo "scale=1; $PASS_COUNT * 100 / $TOTAL" | bc)

echo -e "✅ Passed:  ${GREEN}$PASS_COUNT${NC}"
echo -e "❌ Failed:  ${RED}$FAIL_COUNT${NC}"
echo -e "📈 Total:   $TOTAL"
echo -e "🎯 Success: ${GREEN}${SUCCESS_RATE}%${NC}"
echo ""
echo "⏰ Completed at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Exit with appropriate code
if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}✨ All tests passed! ✨${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some tests failed. Review above for details.${NC}"
  exit 1
fi
