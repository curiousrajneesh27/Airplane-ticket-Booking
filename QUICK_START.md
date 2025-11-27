# 🎯 Quick Start Guide

## ✅ Sab kuch ready hai! Ab yeh karo:

### 1. Dono Servers Running Hain ✅

- **Backend**: http://localhost:5000 (Running)
- **Frontend**: http://localhost:5173 (Running)
- **Database**: MongoDB Connected ✅

### 2. Dummy Data Create Ho Gaya ✅

- **15 Users** - Sabka password: `Test@123`
- **5 Airlines** - Air India, IndiGo, SpiceJet, Vistara, AirAsia
- **20 Flights** - Different routes aur dates ke saath

### 3. Login Credentials (Yaad Rakho!)

```
Email: rajneesh@gmail.com
Password: Test@123

Email: amit@gmail.com
Password: Test@123

Email: priya@gmail.com
Password: Test@123
```

**Aur 12 users bhi hain, sabka password same hai: Test@123**

---

## 🚀 Ab Kya Karna Hai (3 Simple Steps)

### Step 1: Login Karo

```
1. Browser me jao: http://localhost:5173
2. "Login" button pe click karo
3. Email: rajneesh@gmail.com
4. Password: Test@123
5. Login pe click karo
```

### Step 2: Flight Book Karo

```
1. Home page pe "Book Flight now" button pe click karo
2. From: Delhi, To: Mumbai select karo
3. Date select karo
4. Flight choose karo aur book karo
5. Passenger details bharo
6. Confirm karo - Done! ✅
```

### Step 3: Booking Dekho/Cancel Karo

```
1. Top right me profile icon pe click karo
2. Apni saari bookings table me dikhegi
3. "View Ticket" - Ticket dekhne ke liye
4. "Cancel Booking" - Cancel karne ke liye
```

---

## ✨ Features Jo Ab Kaam Kar Rahe Hain

✅ **Login/Signup** - Working perfectly
✅ **Flight Search** - By origin, destination, date
✅ **Booking** - Simple, no payment needed
✅ **View Bookings** - Profile page pe saari bookings
✅ **Cancel Booking** - One click se cancel
✅ **Database Storage** - Sab kuch MongoDB me store hai

---

## 🔧 Agar Kuch Reset Karna Ho

Agar phir se dummy data create karna hai:

```bash
cd backend
npm run seed
```

Yeh sabhi users, airlines, aur flights ko fresh create kar dega!

---

## 📱 Testing ke liye

1. **Multiple Users Test Karo**:

   - rajneesh@gmail.com se login karo
   - Book karo
   - Logout karo
   - amit@gmail.com se login karo
   - Book karo
   - Dono apni-apni bookings profile me dekh sakte hain ✅

2. **Cancel Test Karo**:

   - Booking karo
   - Profile me jao
   - Cancel karo
   - Database se delete ho jayega ✅

3. **Multiple Passengers Test Karo**:
   - Ek hi booking me 2-3 passengers add karo
   - Sab ek saath book ho jayenge ✅

---

## 🎉 Ab Enjoy Karo!

Sab kuch working hai! Questions ho to poocho! 🚀✈️
