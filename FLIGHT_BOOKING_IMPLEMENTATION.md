# Flight Booking Feature - Legacy Data Management Implementation

## 🎯 Overview

This implementation adds a complete Flight Booking feature that **excludes legacy database entries** and shows only relevant user data. The system uses a `legacy` flag to filter out old bookings while preserving all historical data.

---

## 📋 Features Implemented

### 1. **Database Schema Enhancement**

- ✅ Added `legacy` flag (Boolean, default: false)
- ✅ Added `userSnapshot` object to preserve user details at booking time
- ✅ Indexed `legacy` field for efficient queries
- ✅ Timestamps (createdAt, updatedAt) for tracking

### 2. **Migration System**

- ✅ CLI script to mark existing bookings as legacy
- ✅ Admin API routes for legacy management
- ✅ Safe migration (no data deletion)
- ✅ Reversible operations

### 3. **Backend APIs**

- ✅ POST `/api/book-flight` - Creates booking with user snapshot
- ✅ GET `/api/my-flights` - Returns only non-legacy bookings
- ✅ DELETE `/api/cancel-flight/:id` - Soft-delete (status: cancelled)
- ✅ Admin routes for legacy data management

### 4. **Frontend Components**

- ✅ Enhanced Profile page with toggle for active/cancelled bookings
- ✅ BookFlight page with form validation
- ✅ User snapshot display in booking cards
- ✅ Real-time booking count updates

### 5. **Security**

- ✅ JWT authentication on all routes
- ✅ User ownership verification on cancel
- ✅ Admin-only access to migration routes

---

## 🚀 Quick Start

### Step 1: Run Migration (Mark Existing Data as Legacy)

**Option A: Using CLI Script**

```bash
cd backend
npm run migrate-legacy
```

**Option B: Using Admin API**

```bash
# Requires admin authentication
POST http://localhost:5000/api/admin/migrate-legacy
Authorization: Bearer <admin_token>
```

### Step 2: Restart Backend Server

```bash
cd backend
npm start
```

### Step 3: Test the Feature

1. Login to the app
2. Click on any destination card
3. Fill booking form and submit
4. Go to Profile → See only your new bookings (legacy data excluded)
5. Toggle "Show All" to see cancelled bookings

---

## 📁 Files Created/Modified

### Backend Files

#### **New Files:**

1. `backend/scripts/markLegacyBookings.js` - Migration script
2. `backend/Routes/adminLegacy.js` - Admin routes for legacy management

#### **Modified Files:**

1. `backend/models/SimpleBooking.js` - Added legacy flag & userSnapshot
2. `backend/controller/simpleBookingController.js` - Enhanced with user snapshot logic
3. `backend/index.js` - Added admin routes
4. `backend/package.json` - Added migrate-legacy script

### Frontend Files

#### **Modified Files:**

1. `frontend/src/page/Profile.jsx` - Enhanced with toggle and user snapshot display

---

## 🔧 Configuration

### Database Schema

```javascript
{
  userId: ObjectId,           // Reference to Users collection
  passengerName: String,
  email: String,
  phone: String,
  departureCity: String,
  destinationCity: String,
  travelDate: Date,
  passengersCount: Number,
  classType: String,          // "Economy" | "Business" | "First Class"
  status: String,             // "active" | "cancelled"
  legacy: Boolean,            // false = new booking, true = old legacy data
  userSnapshot: {             // Snapshot of user at booking time
    name: String,
    email: String,
    phone: String,
    age: Number,
    profilePic: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Query Logic

**New Bookings Query:**

```javascript
// Only non-legacy, active bookings
{ userId: req.userId, legacy: { $ne: true }, status: "active" }

// All non-legacy bookings (active + cancelled)
{ userId: req.userId, legacy: { $ne: true } }
```

**Never Returned to UI:**

```javascript
// Legacy bookings are excluded from all user-facing queries
{
  legacy: true;
}
```

---

## 🎮 API Endpoints

### User Routes (Protected)

#### 1. Create Booking

```http
POST /api/book-flight
Authorization: Bearer <token>
Content-Type: application/json

{
  "passengerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "departureCity": "New York",
  "destinationCity": "London",
  "travelDate": "2025-12-25",
  "passengersCount": 2,
  "classType": "Business"
}

Response:
{
  "success": true,
  "message": "Flight booked successfully!",
  "booking": { ... }
}
```

#### 2. Get My Flights (Excludes Legacy)

```http
GET /api/my-flights
Authorization: Bearer <token>

# Show only active bookings
GET /api/my-flights

# Show all (active + cancelled), but exclude legacy
GET /api/my-flights?showAll=true

Response:
{
  "success": true,
  "count": 5,
  "bookings": [...]
}
```

#### 3. Cancel Flight

```http
DELETE /api/cancel-flight/:bookingId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": { ... }
}
```

### Admin Routes (Admin Only)

#### 1. Migrate Legacy Bookings

```http
POST /api/admin/migrate-legacy
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Successfully marked 10 bookings as legacy",
  "migrated": 10
}
```

#### 2. Get Booking Statistics

```http
GET /api/admin/booking-stats
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "stats": {
    "total": 15,
    "legacy": 10,
    "nonLegacy": 5,
    "cancelled": 2,
    "activeNonLegacy": 3
  }
}
```

#### 3. Revert Legacy Status

```http
POST /api/admin/revert-legacy/:bookingId
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Booking restored from legacy status",
  "booking": { ... }
}
```

---

## 🔍 How Legacy Data is Handled

### When Migration Runs:

1. Script finds all bookings WITHOUT `legacy` field
2. Updates them: `{ $set: { legacy: true } }`
3. These bookings are now excluded from user queries

### When New Booking is Created:

1. Fetches current user profile from database
2. Creates `userSnapshot` with user's current details
3. Sets `legacy: false` explicitly
4. Saves booking to database

### When User Views Bookings:

1. Frontend calls `/api/my-flights`
2. Backend queries: `{ userId, legacy: { $ne: true } }`
3. Returns only non-legacy bookings
4. Frontend displays with user snapshot info

### Edge Cases Handled:

- ✅ Bookings without userId → Treated as legacy
- ✅ Bookings without legacy field → Migration script marks them
- ✅ Cancelled bookings → Shown only when "Show All" is toggled
- ✅ User profile changes → Original details preserved in userSnapshot

---

## 🧪 Testing Guide

### Test 1: Migration

```bash
cd backend
npm run migrate-legacy
npm run check-db  # Verify legacy bookings count
```

### Test 2: Create New Booking

1. Login: `rajneesh@gmail.com` / `Test@123`
2. Click destination card → Book Flight
3. Fill form → Submit
4. Check database: `legacy: false`, `userSnapshot` populated

### Test 3: View Bookings

1. Go to Profile page
2. Should see only new bookings (legacy excluded)
3. Toggle "Show All" → See cancelled bookings too
4. Legacy bookings never appear

### Test 4: Cancel Booking

1. Click "Cancel Flight" on active booking
2. Status changes to "cancelled"
3. Booking still visible in "Show All" mode
4. Can't cancel twice (validation)

### Test 5: Admin Routes

```bash
# Get stats
curl -X GET http://localhost:5000/api/admin/booking-stats \
  -H "Authorization: Bearer <admin_token>"

# Revert legacy
curl -X POST http://localhost:5000/api/admin/revert-legacy/<booking_id> \
  -H "Authorization: Bearer <admin_token>"
```

---

## 📊 Database Commands

### Check Current Status

```bash
cd backend
npm run check-db
```

### Manual MongoDB Queries

```javascript
// Count legacy bookings
db.simplebookings.countDocuments({ legacy: true });

// Count active bookings
db.simplebookings.countDocuments({ legacy: { $ne: true }, status: "active" });

// Find bookings without legacy field
db.simplebookings.find({ legacy: { $exists: false } });

// Manually mark as legacy
db.simplebookings.updateMany(
  { legacy: { $exists: false } },
  { $set: { legacy: true } }
);

// Revert all legacy flags (CAUTION!)
db.simplebookings.updateMany({ legacy: true }, { $set: { legacy: false } });
```

---

## ⚙️ Migration Options

### Option A: Mark ALL Existing Bookings

```javascript
// In scripts/markLegacyBookings.js (default)
await SimpleBooking.updateMany(
  { legacy: { $exists: false } },
  { $set: { legacy: true } }
);
```

### Option B: Mark by Date (Before Implementation)

```javascript
// Uncomment in scripts/markLegacyBookings.js
const IMPLEMENTATION_DATE = new Date("2025-11-27T00:00:00.000Z");
await SimpleBooking.updateMany(
  {
    createdAt: { $lt: IMPLEMENTATION_DATE },
    $or: [{ legacy: { $exists: false } }, { legacy: false }],
  },
  { $set: { legacy: true } }
);
```

### Option C: Manual Selection

```javascript
// Mark specific bookings by IDs
await SimpleBooking.updateMany(
  { _id: { $in: ["id1", "id2", "id3"] } },
  { $set: { legacy: true } }
);
```

---

## 🛡️ Security Notes

1. **All routes are JWT-protected**

   - User must be authenticated
   - Token validated on every request

2. **Ownership verification**

   - Users can only cancel their own bookings
   - `booking.userId === req.userId` check

3. **Admin-only operations**

   - Migration routes check `user.isAdmin`
   - Statistics only for admins

4. **Data preservation**
   - No hard deletes (soft delete with status)
   - User snapshot preserves historical data

---

## 🎨 Frontend Features

### Profile Page Enhancements

1. **Toggle Button**

   - "Show Active Only" / "Show All"
   - Dynamically fetches data with `?showAll=true` param

2. **Booking Cards**

   - Color-coded status (green = active, red = cancelled)
   - User snapshot display
   - Formatted dates
   - Cancel button (only for active)

3. **Empty State**

   - Helpful message when no bookings
   - "Browse Destinations" button

4. **Visual Indicators**
   - Status badges (✅ Active / ❌ Cancelled)
   - Faded appearance for cancelled bookings
   - "Booked as" label showing original user name

---

## 📝 NPM Scripts

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js",
  "seed": "node seedData.js",
  "check-db": "node checkDatabase.js",
  "migrate-legacy": "node scripts/markLegacyBookings.js"
}
```

---

## 🚨 Important Notes

1. **Run Migration Once**

   - Before deploying new feature
   - After running, existing bookings become legacy
   - Idempotent (safe to run multiple times)

2. **Backward Compatibility**

   - Old bookings still in database
   - Just hidden from UI with `legacy: true`
   - Can be restored via admin route

3. **User Snapshot**

   - Captured at booking time
   - Preserves user details even if profile changes
   - Useful for historical records

4. **Performance**
   - `legacy` field is indexed
   - Queries are efficient
   - No N+1 query problems

---

## 🔄 Rollback Plan

If you need to revert:

```javascript
// Remove legacy flag from all bookings
await SimpleBooking.updateMany({}, { $unset: { legacy: "" } });

// Or set all to false
await SimpleBooking.updateMany({}, { $set: { legacy: false } });
```

---

## ✅ Checklist

- [x] Database schema updated
- [x] Migration script created
- [x] Admin routes implemented
- [x] Backend controllers enhanced
- [x] Frontend Profile updated
- [x] User snapshot logic added
- [x] Legacy flag filtering
- [x] Toggle for active/cancelled
- [x] Documentation complete
- [x] Security implemented

---

## 🎓 Summary

This implementation provides a **clean, production-ready** solution for handling legacy database entries while building new features. The `legacy` flag system ensures:

- ✅ Old data is preserved (never deleted)
- ✅ Users only see relevant bookings
- ✅ Historical data can be restored if needed
- ✅ User snapshots maintain data integrity
- ✅ Efficient queries with indexing
- ✅ Admin control over data visibility

**Ready to use in production!** 🚀
