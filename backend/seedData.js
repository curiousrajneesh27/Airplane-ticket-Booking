import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/userSchema.js";
import Flight from "./models/flightSchema.js";
import Airline from "./models/airlineSchema.js";

dotenv.config();

const saltRounds = 10;

// Dummy Users Data
const dummyUsers = [
  { name: "Rajneesh Verma", email: "rajneesh@gmail.com", password: "Test@123" },
  { name: "Amit Kumar", email: "amit@gmail.com", password: "Test@123" },
  { name: "Priya Sharma", email: "priya@gmail.com", password: "Test@123" },
  { name: "Rahul Singh", email: "rahul@gmail.com", password: "Test@123" },
  { name: "Sneha Patel", email: "sneha@gmail.com", password: "Test@123" },
  { name: "Vikram Rao", email: "vikram@gmail.com", password: "Test@123" },
  { name: "Anjali Gupta", email: "anjali@gmail.com", password: "Test@123" },
  { name: "Karan Mehta", email: "karan@gmail.com", password: "Test@123" },
  { name: "Pooja Reddy", email: "pooja@gmail.com", password: "Test@123" },
  { name: "Sanjay Joshi", email: "sanjay@gmail.com", password: "Test@123" },
  { name: "Neha Kapoor", email: "neha@gmail.com", password: "Test@123" },
  { name: "Arjun Desai", email: "arjun@gmail.com", password: "Test@123" },
  { name: "Kavita Nair", email: "kavita@gmail.com", password: "Test@123" },
  { name: "Rohan Iyer", email: "rohan@gmail.com", password: "Test@123" },
  { name: "Divya Shah", email: "divya@gmail.com", password: "Test@123" },
];

// Dummy Airlines Data
const dummyAirlines = [
  {
    airlineName: "Air India",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Air_India.svg/1200px-Air_India.svg.png",
  },
  {
    airlineName: "IndiGo",
    airlineLogo: "https://logos-world.net/wp-content/uploads/2023/01/IndiGo-Logo.png",
  },
  {
    airlineName: "SpiceJet",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/17/SpiceJet_Logo.svg/1200px-SpiceJet_Logo.svg.png",
  },
  {
    airlineName: "Vistara",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png",
  },
  {
    airlineName: "AirAsia India",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png",
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users (optional)
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create users with hashed passwords
    const users = await Promise.all(
      dummyUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return new User({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          isAdmin: false,
          bookings: [],
        });
      })
    );

    await User.insertMany(users);
    console.log(`✅ ${users.length} dummy users created successfully!`);
    console.log("\n📋 User Credentials (Use these to login):");
    console.log("Email: rajneesh@gmail.com | Password: Test@123");
    console.log("Email: amit@gmail.com | Password: Test@123");
    console.log("Email: priya@gmail.com | Password: Test@123");
    console.log("... and 12 more users with password: Test@123\n");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

const seedAirlines = async () => {
  try {
    // Clear existing airlines
    await Airline.deleteMany({});
    console.log("Cleared existing airlines");

    await Airline.insertMany(dummyAirlines);
    console.log(`✅ ${dummyAirlines.length} airlines created successfully!`);
    
    return await Airline.find();
  } catch (error) {
    console.error("Error seeding airlines:", error);
    return [];
  }
};

const seedFlights = async () => {
  try {
    const airlines = await Airline.find();
    
    if (airlines.length === 0) {
      console.log("No airlines found. Please seed airlines first.");
      return;
    }

    // Clear existing flights
    await Flight.deleteMany({});
    console.log("Cleared existing flights");

    const cities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Ahmedabad"];
    const flights = [];

    // Create 20 flights
    for (let i = 0; i < 20; i++) {
      const fromCity = cities[Math.floor(Math.random() * cities.length)];
      let toCity = cities[Math.floor(Math.random() * cities.length)];
      
      // Ensure from and to cities are different
      while (toCity === fromCity) {
        toCity = cities[Math.floor(Math.random() * cities.length)];
      }

      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const departDate = new Date();
      departDate.setDate(departDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      const departTime = `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
      
      const arriveDate = new Date(departDate);
      arriveDate.setHours(arriveDate.getHours() + Math.floor(Math.random() * 5) + 1);
      
      const arriveTime = `${String(arriveDate.getHours()).padStart(2, '0')}:${String(arriveDate.getMinutes()).padStart(2, '0')}`;

      flights.push({
        from: fromCity,
        to: toCity,
        departDate: departDate.toISOString().split('T')[0],
        departTime: departTime,
        arriveDate: arriveDate.toISOString().split('T')[0],
        arriveTime: arriveTime,
        price: Math.floor(Math.random() * 5000) + 2000,
        airline: airline._id,
        bookedSeats: [],
      });
    }

    await Flight.insertMany(flights);
    console.log(`✅ ${flights.length} flights created successfully!`);
  } catch (error) {
    console.error("Error seeding flights:", error);
  }
};

const seedDatabase = async () => {
  await connectDB();
  
  console.log("\n🌱 Starting database seeding...\n");
  
  await seedUsers();
  await seedAirlines();
  await seedFlights();
  
  console.log("\n✅ Database seeding completed!\n");
  console.log("You can now login with any of the above credentials.");
  console.log("All passwords are: Test@123\n");
  
  mongoose.connection.close();
};

seedDatabase();
