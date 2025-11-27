# MongoDB Database Access Guide

## Your Database Details

- **Connection String:** `mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking`
- **Database Name:** `airplane-booking`
- **Username:** `dbms_database`
- **Password:** `rajneesh_database`

## Current Data in Database:

- ✅ **Users:** 16 users
- ✅ **Flights:** 20 flights
- ✅ **Airlines:** 5 airlines
- ✅ **SimpleBookings:** 2 bookings
- ✅ **Bookings:** 0 (old system)
- ✅ **Tickets:** 0

---

## Option 1: MongoDB Compass (Best GUI Tool) 🎯

### Download & Install:

1. Go to: https://www.mongodb.com/try/download/compass
2. Download MongoDB Compass for Windows
3. Install it (simple installation)

### Connect:

1. Open MongoDB Compass
2. Paste connection string:
   ```
   mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking
   ```
3. Click "Connect"
4. Browse collections: users, flights, airlines, simplebookings, etc.

### Benefits:

- ✅ Visual interface to see all data
- ✅ Edit documents directly
- ✅ Run queries easily
- ✅ Export/Import data
- ✅ See real-time updates

---

## Option 2: MongoDB Atlas Web Interface 🌐

### Access Online:

1. Go to: https://cloud.mongodb.com/
2. Login with your MongoDB Atlas account
3. Click on your cluster "NamasteNodeJs"
4. Click "Browse Collections"
5. Select database: `airplane-booking`

### View Collections:

- **users** - All registered users
- **simplebookings** - Flight bookings from new system
- **flights** - All available flights
- **airlines** - Airline companies
- **bookings** - Old booking system (empty)
- **tickets** - Old ticket system (empty)

---

## Option 3: Use MongoDB Shell Commands 💻

### View All Users:

```bash
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import User from './models/userSchema.js'; await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); const users = await User.find({}); console.log(JSON.stringify(users, null, 2)); process.exit(0);"
```

### View All Simple Bookings:

```bash
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import SimpleBooking from './models/SimpleBooking.js'; await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); const bookings = await SimpleBooking.find({}); console.log(JSON.stringify(bookings, null, 2)); process.exit(0);"
```

### View All Flights:

```bash
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import Flight from './models/flightSchema.js'; await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); const flights = await Flight.find({}); console.log(JSON.stringify(flights, null, 2)); process.exit(0);"
```

### View All Airlines:

```bash
cd backend
node --input-type=module -e "import mongoose from 'mongoose'; import Airline from './models/airlineSchema.js'; await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://dbms_database:rajneesh_database@namastenodejs.dcct8.mongodb.net/airplane-booking'); const airlines = await Airline.find({}); console.log(JSON.stringify(airlines, null, 2)); process.exit(0);"
```

---

## Current Simple Bookings in Database:

### Booking 1:

- **Passenger:** Lakshmi
- **Email:** Lakshmi@gmail.com
- **Phone:** +91 9565245755
- **From:** lucknow → **To:** Delhi
- **Date:** Dec 6, 2025
- **Passengers:** 4
- **Class:** Business
- **Status:** ❌ Cancelled

### Booking 2:

- **Passenger:** Lakshmi
- **Email:** Lakshmi@gmail.com
- **Phone:** +91 9565245755
- **From:** lucknow → **To:** Santorini
- **Date:** Dec 6, 2025
- **Passengers:** 3
- **Class:** Economy
- **Status:** ✅ Active

---

## Quick Database Check Script

Created a script to quickly check your database status:

```bash
cd backend
npm run check-db
```

This will show you all collections and document counts.
