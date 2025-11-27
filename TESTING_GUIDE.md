# 🧪 Testing Guide - Flight Booking Feature

## ✅ Pre-requisites

- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ Migration completed (3 legacy bookings)
- ✅ Test user: `rajneesh@gmail.com` / `Test@123`

---

## 🎯 Test Scenarios

### Test 1: Verify Legacy Data is Hidden ✅

**Steps:**

1. Login with: `rajneesh@gmail.com` / `Test@123`
2. Go to Profile page
3. Look at "My Flight Bookings" section

**Expected Result:**

- Section should be empty OR show only new bookings
- **Should NOT show:**
  - Lakshmi -> Delhi
  - Lakshmi -> Santorini
  - Ajita -> Balia
- These 3 bookings are marked as legacy

**Why:** Backend query excludes `legacy: true` bookings

---

### Test 2: Create New Booking ✅

**Steps:**

1. Go to homepage: `http://localhost:5173`
2. Click "Book Flight now" on any destination card
   - Recommended: "Andaman and Nicobar Islands" (ID: 1)
3. Fill the booking form:
   ```
   Passenger Name: Your Name
   Email: your.email@example.com
   Phone: +91 9876543210
   From: Mumbai
   To: Andaman (auto-filled)
   Date: [Future date]
   Passengers: 2
   Class: Business
   ```
4. Click "Book Flight Now"

**Expected Result:**

- ✅ Success toast: "Flight booked successfully! 🎉"
- ✅ Redirected to Profile page
- ✅ New booking appears in "My Flight Bookings"
- ✅ Booking shows:
  - Your passenger name
  - Route: Mumbai → Andaman
  - Status: ✅ Active
  - Date, passengers, class details
  - "Cancel Flight" button visible

**Backend Check:**

```bash
cd backend
npm run check-db
```

Should show: `SimpleBookings: 4` (3 legacy + 1 new)

---

### Test 3: Verify User Snapshot ✅

**Steps:**

1. After creating booking in Test 2
2. Look at the booking card in Profile
3. Check if it shows "Booked as: [Your Name]"

**Expected Result:**

- Booking displays user snapshot
- Shows name from user profile at booking time

**Database Check:**

```bash
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import SimpleBooking from './models/SimpleBooking.js'; await mongoose.connect('mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); const booking = await SimpleBooking.findOne({ legacy: false }); console.log('User Snapshot:', booking?.userSnapshot); process.exit(0);"
```

Should show userSnapshot with name, email, phone, etc.

---

### Test 4: Toggle View (Active/All) ✅

**Steps:**

1. On Profile page with active bookings visible
2. Click button: "Show All (Including Cancelled)"
3. View changes
4. Click again: "Show Active Only"

**Expected Result:**

- **Active Only:** Shows only bookings with status: "active"
- **Show All:** Shows active + cancelled bookings
- **Legacy data NEVER appears** in either view
- Toggle switches smoothly

**API Calls Made:**

- Active: `GET /api/my-flights`
- All: `GET /api/my-flights?showAll=true`

---

### Test 5: Cancel Booking ✅

**Steps:**

1. Find an active booking in Profile
2. Click "Cancel Flight" button
3. Confirm in the alert dialog
4. Observe the result

**Expected Result:**

- ✅ Success toast: "Flight booking cancelled successfully"
- ✅ Booking status changes to "❌ Cancelled"
- ✅ Card gets red border and faded appearance
- ✅ "Cancel Flight" button disappears
- ✅ Message: "This booking has been cancelled"

**Toggle Test:**

- Click "Show Active Only" → Cancelled booking disappears
- Click "Show All" → Cancelled booking reappears

**API Call:**

```
DELETE /api/cancel-flight/<booking_id>
Authorization: Bearer <token>
```

---

### Test 6: Create Multiple Bookings ✅

**Steps:**

1. Book flight to "Santorini" (ID: 2)
2. Book flight to "Maui" (ID: 3)
3. Book flight to "Kyoto" (ID: 4)
4. Go to Profile

**Expected Result:**

- All 3 new bookings visible
- Sorted by most recent first (newest on top)
- Each booking shows:
  - Different destinations
  - All are active
  - Each has cancel button

**Database Check:**

```bash
npm run check-db
```

Should show: `SimpleBookings: 6` (3 legacy + 3 new)
But Profile only shows 3 new bookings

---

### Test 7: Empty State ✅

**Steps:**

1. Login with a fresh user (if available)
   - Or cancel all bookings from existing user
2. Go to Profile page
3. Look at "My Flight Bookings" section

**Expected Result:**

- Empty state message: "No active flight bookings. Book your first flight!"
- "Browse Destinations" button displayed
- Button navigates back to homepage

---

### Test 8: Legacy Data Query Verification ✅

**Backend Query Test:**

```bash
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import SimpleBooking from './models/SimpleBooking.js'; await mongoose.connect('mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); console.log('\n=== LEGACY BOOKINGS (Hidden from UI) ==='); const legacy = await SimpleBooking.find({ legacy: true }); legacy.forEach((b, i) => console.log(i+1 + '. ' + b.passengerName + ' -> ' + b.destinationCity)); console.log('\n=== NON-LEGACY BOOKINGS (Visible in UI) ==='); const active = await SimpleBooking.find({ legacy: { \$ne: true } }); active.forEach((b, i) => console.log(i+1 + '. ' + b.passengerName + ' -> ' + b.destinationCity)); process.exit(0);"
```

**Expected Result:**

- Legacy section shows 3 old bookings
- Non-legacy section shows only new bookings
- User interface matches non-legacy list

---

### Test 9: Admin Routes (If Admin User) 🔧

**Get Booking Statistics:**

```bash
curl -X GET http://localhost:5000/api/admin/booking-stats \
  -H "Authorization: Bearer <admin_token>"
```

**Expected Response:**

```json
{
  "success": true,
  "stats": {
    "total": 6,
    "legacy": 3,
    "nonLegacy": 3,
    "cancelled": 0,
    "activeNonLegacy": 3
  }
}
```

**Revert Legacy Status:**

```bash
curl -X POST http://localhost:5000/api/admin/revert-legacy/<booking_id> \
  -H "Authorization: Bearer <admin_token>"
```

Should change legacy: true → false

---

### Test 10: Direct API Testing 🔍

**Test Authentication:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajneesh@gmail.com",
    "password": "Test@123"
  }'
```

**Test Get Flights (with token):**

```bash
curl -X GET http://localhost:5000/api/my-flights \
  -H "Authorization: Bearer <token_from_login>"
```

**Test Create Booking:**

```bash
curl -X POST http://localhost:5000/api/book-flight \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "Test User",
    "email": "test@example.com",
    "phone": "+91 1234567890",
    "departureCity": "Delhi",
    "destinationCity": "Mumbai",
    "travelDate": "2025-12-25",
    "passengersCount": 1,
    "classType": "Economy"
  }'
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Booking not found" when cancelling

**Cause:** Trying to cancel someone else's booking
**Solution:** Verify userId matches booking owner

### Issue 2: Legacy bookings still showing

**Cause:** Migration not run or legacy field missing
**Solution:**

```bash
cd backend
npm run migrate-legacy
```

### Issue 3: Empty bookings list after creating

**Cause:** Frontend not refreshing or query error
**Solution:**

- Check browser console for errors
- Verify API response in Network tab
- Refresh page manually

### Issue 4: "Unauthorized" error

**Cause:** Token expired or missing
**Solution:**

- Login again
- Check localStorage for token
- Verify Authorization header

---

## ✅ Acceptance Criteria

All tests should pass:

- [x] Legacy bookings (3) are hidden from UI
- [x] New bookings are visible immediately
- [x] User snapshot is captured and displayed
- [x] Toggle between active/all works correctly
- [x] Cancel booking updates status properly
- [x] Cancelled bookings only show when "Show All"
- [x] Multiple bookings display correctly
- [x] Empty state shows when no bookings
- [x] Admin routes work (if admin)
- [x] API endpoints respond correctly

---

## 📊 Performance Checks

```bash
# Check query performance
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import SimpleBooking from './models/SimpleBooking.js'; await mongoose.connect('mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); console.time('Query'); const bookings = await SimpleBooking.find({ userId: '69275e7a2da3db6cb172fe15', legacy: { \$ne: true } }); console.timeEnd('Query'); console.log('Found:', bookings.length, 'bookings'); process.exit(0);"
```

**Expected:** Query time < 50ms

---

## 🎉 Final Checklist

Before considering feature complete:

- [ ] All 10 test scenarios pass
- [ ] Legacy data confirmed hidden
- [ ] New bookings work end-to-end
- [ ] User snapshot captured correctly
- [ ] Cancel functionality working
- [ ] Toggle view works properly
- [ ] Empty states handled
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Documentation reviewed

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Test 1 - Legacy Hidden: [ PASS / FAIL ]
Test 2 - Create Booking: [ PASS / FAIL ]
Test 3 - User Snapshot: [ PASS / FAIL ]
Test 4 - Toggle View: [ PASS / FAIL ]
Test 5 - Cancel Booking: [ PASS / FAIL ]
Test 6 - Multiple Bookings: [ PASS / FAIL ]
Test 7 - Empty State: [ PASS / FAIL ]
Test 8 - Query Verification: [ PASS / FAIL ]
Test 9 - Admin Routes: [ PASS / FAIL ]
Test 10 - API Testing: [ PASS / FAIL ]

Overall Status: [ PASS / FAIL ]

Notes:
_________________________________
_________________________________
```

---

## 🚀 Ready for Production!

Once all tests pass, the feature is ready to deploy. The system:

- ✅ Excludes legacy data automatically
- ✅ Preserves user snapshots
- ✅ Handles all edge cases
- ✅ Performs efficiently
- ✅ Is fully documented

**Happy Testing! 🎉**
