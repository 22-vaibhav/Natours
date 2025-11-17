# 🌿 Natours — Nature Tours Booking App

A complete **Node.js, Express, MongoDB** backend application that powers a fictional nature tour booking platform.  
Built as part of [Jonas Schmedtmann’s Node.js Bootcamp](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) and enhanced by **Vaibhav Prakash**.  

🚀 **Live Demo:** [https://natours-x7f6.onrender.com](https://natours-x7f6.onrender.com)

---

## 🧭 Overview

**Natours** is a RESTful API for managing, booking, and reviewing nature tours.  
It demonstrates how to build a **production-grade backend** with authentication, authorization, security, file uploads, Stripe payments, and geospatial queries.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Backend Framework** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Templating Engine** | Pug |
| **Authentication** | JWT (JSON Web Token) |
| **File Uploads** | Multer + Sharp |
| **Payments** | Stripe API |
| **Email Services** | Nodemailer (Gmail) |
| **Security** | Helmet, Rate Limiting, Mongo Sanitize, XSS Clean |
| **Deployment** | Render |
| **Maps & Geolocation** | Mapbox API |

---

## 📁 Project Structure

```
Natours/
│
├── controllers/         # Route handlers (business logic)
├── models/              # Mongoose models (User, Tour, Review, Booking)
├── routes/              # API route definitions
├── public/              # Static files (images, CSS, JS)
├── utils/               # Utility functions (email, error handling)
├── views/               # Pug templates (frontend)
│
├── app.js               # Express app setup
├── server.js            # Entry point
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/22-vaibhav/Natours.git
cd Natours
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env` file in the project root and add the following:

```env
# Basic Config
NODE_ENV=development
PORT=3000

# Database
DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster.mongodb.net/natours
DATABASE_LOCAL=mongodb://127.0.0.1:27017/natours

# JWT Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Config
EMAIL_USERNAME=your_gmail_username
EMAIL_PASSWORD=your_gmail_password
EMAIL_FROM=your_email@example.com

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Mapbox (for location data)
MAPBOX_TOKEN=your_mapbox_token
```

> ⚠️ Replace all placeholder values with your actual credentials.

### 4️⃣ Run the Development Server
```bash
npm run dev
```

Server runs on 👉 **http://localhost:3000**

### 5️⃣ Run in Production
```bash
npm start
```

---

## 🧪 Available Scripts

| Command | Description |
|----------|-------------|
| `npm start` | Run in production mode |
| `npm run dev` | Run in development mode (with Nodemon) |
| `npm run debug` | Start with Node Inspector |

---

## 🔑 API Documentation

### 🔐 Authentication Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/v1/users/signup` | Register a new user |
| POST | `/api/v1/users/login` | Log in |
| GET | `/api/v1/users/logout` | Log out |
| POST | `/api/v1/users/forgotPassword` | Request password reset link |
| PATCH | `/api/v1/users/resetPassword/:token` | Reset password |
| PATCH | `/api/v1/users/updateMyPassword` | Update password |
| PATCH | `/api/v1/users/updateMe` | Update user info |
| DELETE | `/api/v1/users/deleteMe` | Deactivate account |

---

### 🌍 Tour Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/v1/tours` | Get all tours |
| GET | `/api/v1/tours/:id` | Get a specific tour |
| POST | `/api/v1/tours` | Create new tour *(admin/lead-guide only)* |
| PATCH | `/api/v1/tours/:id` | Update tour *(admin/lead-guide only)* |
| DELETE | `/api/v1/tours/:id` | Delete tour *(admin only)* |
| GET | `/api/v1/tours-within/:distance/center/:latlng/unit/:unit` | Get tours within a radius |
| GET | `/api/v1/tours/distances/:latlng/unit/:unit` | Calculate tour distances |

---

### 💬 Review Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/v1/reviews` | Get all reviews |
| POST | `/api/v1/tours/:tourId/reviews` | Add review |
| PATCH | `/api/v1/reviews/:id` | Update review *(author/admin only)* |
| DELETE | `/api/v1/reviews/:id` | Delete review *(author/admin only)* |

---

### 💳 Booking Routes

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/v1/bookings` | Get all bookings *(admin only)* |
| POST | `/api/v1/bookings/checkout-session/:tourId` | Create Stripe checkout session |
| DELETE | `/api/v1/bookings/:id` | Delete booking *(admin only)* |

---

## 🛡️ Security Features

- Rate Limiting to prevent brute-force attacks  
- Helmet for secure HTTP headers  
- Express Mongo Sanitize for NoSQL injection protection  
- XSS Clean for input sanitization  
- HPP for HTTP parameter pollution prevention  
- CORS configuration for API access

---

## 📸 File Uploads

- Implemented with **Multer**
- Image resizing via **Sharp**
- Profile photo upload for users
- Tour image upload for admins and lead-guides

---

## 💳 Stripe Payments

- Integrated **Stripe Checkout** for real-time payments
- Webhook to handle booking confirmations
- Booking stored in MongoDB upon successful payment

---

## 📧 Email Handling

- **Nodemailer** for email communication
- **Gmail** for testing, development & production
- Automated:
  - Welcome emails  
  - Password reset emails

---

## 🗺️ Geospatial Features (Mapbox)

- Uses **GeoJSON** for tour locations  
- `$geoWithin` and `$geoNear` for geospatial filtering  
- Mapbox integration to display tours on an interactive map  

---

## 🚀 Deployment

### 🌐 Hosted on:
**Render:** [https://natours-x7f6.onrender.com](https://natours-x7f6.onrender.com)

### ⚙️ Steps:
1. Push your code to GitHub.  
2. Connect repository to Render.  
3. Set up environment variables.  
4. Use MongoDB Atlas for the database.  
5. Deploy 🚀

---

## 🧠 Learning Outcomes

This project demonstrates:
- Scalable Node.js project structure  
- RESTful API design and versioning  
- Authentication & Authorization using JWT  
- Advanced MongoDB operations & aggregation  
- Image uploads and processing  
- Payment integration with Stripe  
- Secure, production-ready deployment  

---

## 🧑‍💻 Author

**👤 Vaibhav Prakash**  
Backend Developer | Node.js & MongoDB Enthusiast  

🔗 **GitHub:** [@22-vaibhav](https://github.com/22-vaibhav)  
🌐 **Live App:** [https://natours-x7f6.onrender.com](https://natours-x7f6.onrender.com)

---

## ⭐ Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [Mapbox](https://www.mapbox.com/)
- [Nodemailer](https://nodemailer.com/)
- [Jonas Schmedtmann](https://twitter.com/jonasschmedtman) — for the original course

---

> 💡 **Tip:**  
> Run `npm run dev` for development mode.  
> Your API will be available at: **http://localhost:3000/api/v1/**
