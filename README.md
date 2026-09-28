# 🍔 Zomato Clone

A modern full-stack Zomato clone web application featuring restaurant exploration, live search, cuisine filtering, interactive menu ordering, cart management, and order placement.

---

## ✨ Features

- **🏠 Home Page**:
  - Live restaurant search with debounce
  - Cuisine category filters (All, Biryani, Pizza, Burgers, Desserts, Chinese, South Indian)
  - Interactive restaurant cards with ratings, delivery time, price for two, and offer badges
  
- **🍽️ Restaurant Detail Page**:
  - Restaurant hero banner with info, rating, and offer badges
  - Menu section organized with Veg/Non-Veg indicators, descriptions, and pricing
  - Floating and sidebar Cart with quantity increments/decrements
  - Checkout modal with customer details (Name, Phone, Delivery Address)
  - Order confirmation modal with real-time order submission

- **🚀 Backend REST API**:
  - Node.js + Express
  - MongoDB Atlas database with Mongoose schemas
  - Endpoints for restaurants, search, and orders

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism & Dark Theme), JavaScript (ES6+)
- **Backend**: Node.js, Express.js, Mongoose, CORS, Dotenv
- **Database**: MongoDB Atlas

---

## 📁 Project Structure

```text
vac_mini_project/
├── backend/
│   ├── models/
│   │   ├── Restaurant.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── restaurants.js
│   │   └── orders.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   └── restaurant.js
│   ├── index.html
│   └── restaurant.html
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Seed sample restaurants (optional):
```bash
node seed.js
```

Start the backend server:
```bash
node server.js
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup

Open `frontend/index.html` directly in your browser or serve via Live Server / any static file server.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/restaurants` | Get all restaurants |
| `GET` | `/api/restaurants/search?q=:query` | Search restaurants by name/cuisine/location |
| `GET` | `/api/restaurants/:id` | Get restaurant details by ID |
| `POST` | `/api/restaurants` | Add new restaurant |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | Get all orders |
| `GET` | `/api/orders/:id` | Get order details |
