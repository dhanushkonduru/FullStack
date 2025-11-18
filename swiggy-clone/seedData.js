// Sample data seeder for Swiggy Clone
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const sampleRestaurants = [
  {
    name: "Pizza Palace",
    location: "Downtown",
    rating: 4.5,
    isOpen: true
  },
  {
    name: "Burger Junction",
    location: "Mall Road",
    rating: 4.2,
    isOpen: true
  },
  {
    name: "Sushi Express",
    location: "Central Plaza",
    rating: 4.8,
    isOpen: true
  },
  {
    name: "Taco Fiesta",
    location: "Food Court",
    rating: 4.0,
    isOpen: true
  },
  {
    name: "Curry House",
    location: "Old Town",
    rating: 4.6,
    isOpen: true
  },
  {
    name: "Noodle Bar",
    location: "Chinatown",
    rating: 4.3,
    isOpen: true
  }
];

const sampleMenuItems = [
  // Pizza Palace
  { name: "Margherita Pizza", price: 299, description: "Classic tomato and mozzarella", category: "Pizza" },
  { name: "Pepperoni Pizza", price: 399, description: "Spicy pepperoni with cheese", category: "Pizza" },
  { name: "Veg Supreme Pizza", price: 349, description: "Loaded with fresh vegetables", category: "Pizza" },
  { name: "Chicken BBQ Pizza", price: 449, description: "BBQ chicken with onions", category: "Pizza" },
  
  // Burger Junction
  { name: "Classic Burger", price: 199, description: "Beef patty with lettuce and tomato", category: "Burgers" },
  { name: "Chicken Burger", price: 179, description: "Grilled chicken with mayo", category: "Burgers" },
  { name: "Veggie Burger", price: 159, description: "Plant-based patty with vegetables", category: "Burgers" },
  { name: "Cheese Burger", price: 219, description: "Double cheese with special sauce", category: "Burgers" },
  
  // Sushi Express
  { name: "California Roll", price: 299, description: "Crab, avocado, and cucumber", category: "Sushi" },
  { name: "Salmon Roll", price: 349, description: "Fresh salmon with rice", category: "Sushi" },
  { name: "Dragon Roll", price: 399, description: "Eel and avocado roll", category: "Sushi" },
  { name: "Tuna Roll", price: 329, description: "Fresh tuna with vegetables", category: "Sushi" },
  
  // Taco Fiesta
  { name: "Beef Tacos", price: 149, description: "Spicy beef with salsa", category: "Mexican" },
  { name: "Chicken Tacos", price: 139, description: "Grilled chicken with guacamole", category: "Mexican" },
  { name: "Veggie Tacos", price: 119, description: "Fresh vegetables with beans", category: "Mexican" },
  { name: "Fish Tacos", price: 169, description: "Fried fish with slaw", category: "Mexican" },
  
  // Curry House
  { name: "Butter Chicken", price: 249, description: "Creamy tomato curry", category: "Indian" },
  { name: "Chicken Biryani", price: 199, description: "Fragrant rice with chicken", category: "Indian" },
  { name: "Dal Makhani", price: 179, description: "Creamy black lentils", category: "Indian" },
  { name: "Paneer Tikka", price: 189, description: "Grilled cottage cheese", category: "Indian" },
  
  // Noodle Bar
  { name: "Chicken Noodles", price: 159, description: "Stir-fried with vegetables", category: "Asian" },
  { name: "Beef Ramen", price: 199, description: "Rich beef broth with noodles", category: "Asian" },
  { name: "Veggie Stir Fry", price: 139, description: "Mixed vegetables with sauce", category: "Asian" },
  { name: "Prawn Noodles", price: 229, description: "Fresh prawns with noodles", category: "Asian" }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');
    
    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    
    // Create restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`✅ Created ${restaurants.length} restaurants`);
    
    // Create menu items
    const menuItems = [];
    const itemsPerRestaurant = Math.floor(sampleMenuItems.length / restaurants.length);
    
    for (let i = 0; i < restaurants.length; i++) {
      const startIndex = i * itemsPerRestaurant;
      const endIndex = startIndex + itemsPerRestaurant;
      const restaurantItems = sampleMenuItems.slice(startIndex, endIndex);
      
      for (const item of restaurantItems) {
        menuItems.push({
          ...item,
          restaurant: restaurants[i]._id
        });
      }
    }
    
    await MenuItem.insertMany(menuItems);
    console.log(`✅ Created ${menuItems.length} menu items`);
    
    // Create sample user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'user',
      address: '123 Main Street, City'
    });
    console.log(`✅ Created sample user: ${sampleUser.email}`);
    
    console.log('🎉 Data seeding completed successfully!');
    console.log('📧 Sample login: john@example.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run seeder if called directly
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./config/db');
  
  connectDB().then(() => {
    seedData().then(() => {
      process.exit(0);
    });
  });
}

module.exports = seedData;
