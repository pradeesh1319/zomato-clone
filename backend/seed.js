const mongoose = require('mongoose');
require('dotenv').config();
const Restaurant = require('./models/Restaurant');

const sampleRestaurants = [
  {
    name: 'Burger Barn',
    cuisine: ['Burgers', 'Fast Food', 'American'],
    rating: 4.3,
    deliveryTime: 25,
    priceForTwo: 400,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    location: 'Koramangala, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Burgers',
        items: [
          { name: 'Classic Smash Burger', price: 179, desc: 'Juicy smashed beef patty with cheese, lettuce & secret sauce', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400' },
          { name: 'BBQ Bacon Burger', price: 229, desc: 'Smoky BBQ sauce, crispy bacon & cheddar cheese', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400' },
          { name: 'Mushroom Swiss Burger', price: 249, desc: 'Sauteed mushrooms with melted swiss cheese', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400' },
        ],
      },
      {
        category: 'Sides',
        items: [
          { name: 'Loaded Fries', price: 129, desc: 'Crispy fries topped with cheese sauce and jalapeños', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
          { name: 'Onion Rings', price: 99, desc: 'Golden battered onion rings with dipping sauce', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' },
        ],
      },
    ],
  },
  {
    name: 'Pizza Paradise',
    cuisine: ['Pizza', 'Italian', 'Fast Food'],
    rating: 4.5,
    deliveryTime: 30,
    priceForTwo: 500,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
    location: 'Indiranagar, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Pizzas',
        items: [
          { name: 'Margherita', price: 249, desc: 'Classic tomato sauce, fresh mozzarella & basil', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
          { name: 'Pepperoni Feast', price: 349, desc: 'Loaded with spicy pepperoni & mozzarella', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
          { name: 'Farm Fresh Veggie', price: 299, desc: 'Bell peppers, olives, onions, mushrooms & corn', image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400' },
        ],
      },
      {
        category: 'Pasta',
        items: [
          { name: 'Penne Arrabbiata', price: 219, desc: 'Spicy tomato sauce with garlic and herbs', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
          { name: 'Alfredo Pasta', price: 259, desc: 'Creamy white sauce with parmesan', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400' },
        ],
      },
    ],
  },
  {
    name: 'Spice Garden',
    cuisine: ['North Indian', 'Biryani', 'Mughlai'],
    rating: 4.1,
    deliveryTime: 35,
    priceForTwo: 350,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
    location: 'HSR Layout, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Biryani',
        items: [
          { name: 'Hyderabadi Chicken Biryani', price: 249, desc: 'Slow-cooked aromatic basmati rice with tender chicken', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
          { name: 'Veg Dum Biryani', price: 199, desc: 'Layered vegetables with fragrant spiced rice', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
        ],
      },
      {
        category: 'Curries',
        items: [
          { name: 'Butter Chicken', price: 279, desc: 'Tender chicken in creamy tomato-butter gravy', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
          { name: 'Paneer Tikka Masala', price: 229, desc: 'Grilled paneer cubes in spiced masala gravy', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
          { name: 'Dal Makhani', price: 179, desc: 'Slow-cooked black lentils with cream & butter', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
        ],
      },
    ],
  },
  {
    name: 'Sushi Station',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.6,
    deliveryTime: 40,
    priceForTwo: 800,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600',
    location: 'Whitefield, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Sushi Rolls',
        items: [
          { name: 'California Roll', price: 349, desc: 'Crab meat, avocado & cucumber with sesame', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
          { name: 'Spicy Tuna Roll', price: 399, desc: 'Fresh tuna with spicy mayo and scallions', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400' },
          { name: 'Dragon Roll', price: 449, desc: 'Shrimp tempura, avocado & eel sauce', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400' },
        ],
      },
      {
        category: 'Ramen',
        items: [
          { name: 'Tonkotsu Ramen', price: 379, desc: 'Rich pork bone broth with chashu & soft egg', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
          { name: 'Miso Ramen', price: 349, desc: 'Soybean paste broth with tofu & vegetables', image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400' },
        ],
      },
    ],
  },
  {
    name: 'The Chai Point',
    cuisine: ['Cafe', 'Beverages', 'Snacks'],
    rating: 4.0,
    deliveryTime: 15,
    priceForTwo: 200,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600',
    location: 'MG Road, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Beverages',
        items: [
          { name: 'Masala Chai', price: 49, desc: 'Aromatic spiced tea brewed to perfection', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400' },
          { name: 'Cold Coffee', price: 129, desc: 'Creamy blended cold coffee with ice cream', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
          { name: 'Green Tea', price: 69, desc: 'Refreshing Japanese green tea', image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400' },
        ],
      },
      {
        category: 'Snacks',
        items: [
          { name: 'Samosa (2 pcs)', price: 59, desc: 'Crispy pastry filled with spiced potatoes', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
          { name: 'Vada Pav', price: 49, desc: 'Mumbai-style spiced potato fritter in a bun', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400' },
        ],
      },
    ],
  },
  {
    name: 'Dragon Wok',
    cuisine: ['Chinese', 'Thai', 'Asian'],
    rating: 4.2,
    deliveryTime: 30,
    priceForTwo: 450,
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600',
    location: 'BTM Layout, Bangalore',
    isOpen: false,
    menu: [
      {
        category: 'Starters',
        items: [
          { name: 'Crispy Spring Rolls', price: 159, desc: 'Crunchy vegetable spring rolls with sweet chili sauce', image: 'https://images.unsplash.com/photo-1606525437817-8b4a0745eb88?w=400' },
          { name: 'Chili Chicken', price: 229, desc: 'Spicy Indo-Chinese style chicken tossed with peppers', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400' },
        ],
      },
      {
        category: 'Main Course',
        items: [
          { name: 'Schezwan Fried Rice', price: 199, desc: 'Fiery fried rice with vegetables & schezwan sauce', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
          { name: 'Hakka Noodles', price: 189, desc: 'Stir-fried noodles with vegetables and soy sauce', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
          { name: 'Thai Green Curry', price: 289, desc: 'Coconut milk curry with basil and vegetables', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' },
        ],
      },
    ],
  },
  {
    name: 'Dosa Plaza',
    cuisine: ['South Indian', 'Dosa', 'Vegetarian'],
    rating: 4.4,
    deliveryTime: 20,
    priceForTwo: 250,
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600',
    location: 'Jayanagar, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Dosas',
        items: [
          { name: 'Masala Dosa', price: 99, desc: 'Crispy crepe filled with spiced potato', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
          { name: 'Mysore Masala Dosa', price: 119, desc: 'Spicy red chutney spread with potato filling', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400' },
          { name: 'Rava Dosa', price: 109, desc: 'Semolina crepe with a crispy lacy texture', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
        ],
      },
      {
        category: 'Combos',
        items: [
          { name: 'Idli Vada Combo', price: 89, desc: 'Steamed idlis & crispy vadas with chutney & sambar', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
          { name: 'Mini Tiffin', price: 149, desc: 'Assorted mini dosa, idli, vada & upma', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400' },
        ],
      },
    ],
  },
  {
    name: 'Ice Cream Dreams',
    cuisine: ['Desserts', 'Ice Cream', 'Beverages'],
    rating: 4.7,
    deliveryTime: 20,
    priceForTwo: 300,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600',
    location: 'Church Street, Bangalore',
    isOpen: true,
    menu: [
      {
        category: 'Ice Cream',
        items: [
          { name: 'Belgian Chocolate Scoop', price: 129, desc: 'Rich dark Belgian chocolate gelato', image: 'https://images.unsplash.com/photo-1563589173312-476d8c36b3c9?w=400' },
          { name: 'Mango Sorbet', price: 119, desc: 'Refreshing Alphonso mango sorbet', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400' },
          { name: 'Cookie Dough Sundae', price: 199, desc: 'Vanilla ice cream loaded with cookie dough chunks', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
        ],
      },
      {
        category: 'Shakes',
        items: [
          { name: 'Oreo Milkshake', price: 169, desc: 'Thick creamy milkshake with crushed Oreos', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
          { name: 'Strawberry Smoothie', price: 149, desc: 'Fresh strawberries blended with yogurt', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400' },
        ],
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing restaurants');

    const inserted = await Restaurant.insertMany(sampleRestaurants);
    console.log(`🌱 Seeded ${inserted.length} restaurants successfully!`);

    inserted.forEach((r) => {
      console.log(`   → ${r.name} (${r._id})`);
    });

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
