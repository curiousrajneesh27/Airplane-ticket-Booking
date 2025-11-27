# 🎫 Airplane Ticket Booking System - User Guide

## ✅ Sabse Pehle Ye Samjho

Yeh ek simple flight booking system hai jahan aap:

1. **Login kar sakte ho** - Existing accounts se
2. **Flights search kar sakte ho** - Origin aur destination se
3. **Tickets book kar sakte ho** - Bina payment ke
4. **Bookings dekh sakte ho** - Profile page pe
5. **Bookings cancel kar sakte ho** - Profile page se

---

## 👥 Dummy User Accounts (Login ke liye)

Aap inn accounts se login kar sakte ho. **Sabka password same hai: `Test@123`**

| Name           | Email              | Password |
| -------------- | ------------------ | -------- |
| Rajneesh Verma | rajneesh@gmail.com | Test@123 |
| Amit Kumar     | amit@gmail.com     | Test@123 |
| Priya Sharma   | priya@gmail.com    | Test@123 |
| Rahul Singh    | rahul@gmail.com    | Test@123 |
| Sneha Patel    | sneha@gmail.com    | Test@123 |
| Vikram Rao     | vikram@gmail.com   | Test@123 |
| Anjali Gupta   | anjali@gmail.com   | Test@123 |
| Karan Mehta    | karan@gmail.com    | Test@123 |
| Pooja Reddy    | pooja@gmail.com    | Test@123 |
| Sanjay Joshi   | sanjay@gmail.com   | Test@123 |
| Neha Kapoor    | neha@gmail.com     | Test@123 |
| Arjun Desai    | arjun@gmail.com    | Test@123 |
| Kavita Nair    | kavita@gmail.com   | Test@123 |
| Rohan Iyer     | rohan@gmail.com    | Test@123 |
| Divya Shah     | divya@gmail.com    | Test@123 |

---

## 🚀 Kaise Use Karein (Step by Step)

### 1️⃣ Login Karo

- Browser me jao: `http://localhost:5173`
- "Login" button pe click karo
- Koi bhi upar wala email aur password `Test@123` use karo
- Login button click karo ✅

### 2️⃣ Flight Search Karo

- Home page pe "Book Flight now" button pe click karo
- Ya direct search page pe jao
- From aur To city select karo (Delhi, Mumbai, Bangalore, etc.)
- Date select karo
- "Search Flights" pe click karo 🔍

### 3️⃣ Ticket Book Karo

- Available flights me se koi ek choose karo
- "Book Now" pe click karo
- **Step 1: Seat Selection** - Kitne passengers aur seats select karo
- **Step 2: Passenger Details** - Har passenger ki details bharo
- **Step 3: Review** - Details check karo aur "Next" pe click karo
- Booking confirm ho jayegi! ✈️

### 4️⃣ Apni Bookings Dekho

- Navbar me profile icon pe click karo
- "Profile" pe jao
- Neeche table me aapki saari bookings dikhegi
- **View Ticket** - Ticket details dekhne ke liye
- **Cancel Booking** - Booking cancel karne ke liye ❌

### 5️⃣ Booking Cancel Karo

- Profile page pe jao
- Jis booking ko cancel karna hai, uske samne "Cancel Booking" button pe click karo
- Confirm karo
- Booking delete ho jayegi aur seats free ho jayenge! 🔄

---

## 📊 Database Me Kya Store Hota Hai

### Booking Details (MongoDB me):

```javascript
{
  flight: "Flight ID",
  user: "User ID",
  seat: "A1",
  fName: "First Name",
  lName: "Last Name",
  dob: "1990-01-01",
  passportNumber: "ABC123456",
  state: "Maharashtra",
  phoneNumber: "+919876543210",
  email: "user@gmail.com",
  passportSizePhoto: "cloudinary_url"
}
```

### Cancel Karne Pe:

- Booking document delete ho jata hai
- Ticket delete ho jata hai
- Flight ki booked seats se seat remove ho jati hai
- User ki bookings list se remove ho jata hai

---

## 🛠️ Technical Details

### Backend (Port 5000):

- **POST** `/api/v1/bookings/checkout-session/:flightId` - Booking create karo
- **DELETE** `/api/v1/bookings/cancel/:ticketId` - Booking cancel karo
- **GET** `/api/v1/auth/getUser` - User details aur bookings fetch karo

### Frontend (Port 5173):

- React + Vite + Tailwind CSS
- React Router for navigation
- Axios for API calls
- Toast notifications

### Database:

- MongoDB Atlas
- Collections: users, flights, airlines, bookings, tickets

---

## 🎯 Features

✅ **Simple Booking** - Bina payment ke direct booking
✅ **Cancel Anytime** - Kisi bhi booking ko cancel kar sakte ho
✅ **Real-time Updates** - Database me instantly update hota hai
✅ **Multiple Passengers** - Ek saath multiple passengers ke liye book kar sakte ho
✅ **Seat Selection** - Visual seat selection interface
✅ **Profile Management** - Name aur profile picture update kar sakte ho

---

## 🐛 Agar Koi Problem Ho To

1. **Login nahi ho raha** - Check karo email aur password sahi hai ya nahi
2. **Flights nahi dikh rahi** - Backend server running hai check karo (Port 5000)
3. **Booking nahi ho rahi** - Login check karo, browser console me errors check karo
4. **Cancel nahi ho raha** - Page refresh karo aur phir se try karo

---

## 📝 Notes

- Yeh testing/demo project hai
- Sabhi passwords same hain: `Test@123`
- Real payment integration nahi hai
- Dummy data pre-loaded hai

---

## 🎉 Enjoy Your Flight Booking Experience!

Koi bhi problem ho to contact karo! Happy Booking! ✈️🎫
