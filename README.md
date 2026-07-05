
# Freemium Version


Production‑ready e‑commerce backend — advanced dashboard and analytics, authentication, orders, payments, email, and more
You can get it version here:
	https://devyay.gumroad.com/l/nexus-backend-commerce
A battle‑tested, modular Node.js + Express + MongoDB backend for e‑commerce applications.  
Built for teams who need to ship fast without sacrificing scalability or security.



# Freemium Version
---

## 🚀 Features

### 🔐 Authentication & Security
- Email/password local authentication
- OAuth (Google & Facebook)
- Verification & password reset flows
- Session management
- Role‑based access control
- Rate limiting and brute‑force protection

### 🛍️ Product Management
- Full CRUD operations
- Advanced filtering, sorting, and search
- Popular & top‑selling product endpoints
- Image upload & management via Cloudinary

### 🖼️ Image Handling
- Upload images per product - 5 or configure based on your need on .env
- Delete individual images
- Reorder images (drag‑and‑drop ready)
- Set primary image

### 📊 Dashboard & Analytics
- Overall overview and order statistics - advanced analytics on premium version
- Top‑selling products
- Recent orders and customer summaries
- Ready‑to‑consume endpoints for your admin panel

### 💳 Payments
- Stripe integration (checkout) - if you want webhooks check out the premium version
- Secure payment intent creation
- Clean payment status tracking

### 📦 Orders
- Order creation and lifecycle management
- Coupon code support
- Revenue calculation utilities
- Shipping address handling

### 📧 Email Services 
- (On the premium version)

### ⚙️ Developer Experience
- Clean, modular architecture
- Centralized error handling
- Input validation middleware
- Request timeout protection (configurable as per your need)
- Environment‑based configuration
- Logging and retry logic built‑in

---

## 📁 Project Structure



Nexus-freemium-version/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── server.js
├── node_modules/
└── src/
├── app.js
├── config/
├── controllers/
├── middlewares/
├── models/
├── public/
├── routes/
└── utils/



---

## 🛠️ Installation

1. **Clone the repository**

bash
git clone <your-repo-url>
cd online-shop


1. Install dependencies

```bash
npm install
```

1. Set up environment variables

Rename the .env.example into .env file in the root directory
 and follow instructions to set to real values

```bash
mv .env.example .env
```

Then please REPLACE placeholders with your real values:

---

🔑 How to Get Environment Variables

📦 MongoDB

· Go to MongoDB Atlas
· Create a cluster and click “Connect” → “Connect your application”
· Copy the connection string into MONGODB_URI

💳 Stripe

· Create an account on Stripe
· Go to Developers → API Keys
· Copy the Secret Key → STRIPE_SECRET_KEY
· For webhook:
  · Use the Stripe CLI or dashboard
  · Add an endpoint → copy the signing secret → STRIPE_WEBHOOK_SECRET

☁️ Cloudinary

· Sign up on Cloudinary
· From the Dashboard copy:
  · Cloud Name → CLOUDINARY_CLOUD_NAME
  · API Key → CLOUDINARY_API_KEY
  · API Secret → CLOUDINARY_API_SECRET

---

▶️ Running the App

Development (with hot reload)

```bash
npm run dev
```

Production

```bash
npm start
```

Server starts at: http://localhost:8000

---

# 📡 API Highlights

🖼️ Product Image Management

Endpoint: PATCH /products/:id/images

```json
{
  "deleteImages": ["public_id_1"],
  "order": ["public_id_3", "public_id_1"],
  "primaryImage": "public_id_3"
}
```

💳 Create Payment

Endpoint: POST /api/payment/create-payment

```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "variant": "Size: M, Color: Blue"
    }
  ],
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  },
  "couponCode": "SAVE20",
  "notes": "Gift wrap please"
}
```

---

🏗️ Architecture Notes

· Controllers – Request/response handling
· Utils – Reusable helpers (email templates, wrappers)
· Middlewares – Cross‑cutting concerns (auth, error handling, rate limiting, timeout)
· Config – Third‑party integrations (Stripe, Cloudinary, email)

---

🔒 Security Practices

· All secrets kept in environment variables (.env)
· Password hashing with bcrypt & salt rounds
· Token expiration & rotation
· Rate limiting on sensitive routes
· Input validation & sanitization
· Request timeout to prevent hanging operations


---

## 💰 Licensing & Pricing

This project is available in two tiers:

### 🆓 Freemium (Community Edition)
- Full backend source code
- All features except: [advanced dashboard & analytics, priority support, email services]
- MIT License for personal and evaluation use
- Public GitHub repository at:
	

### 💼 Premium (Production License)
- Everything in Freemium, plus:
  - Advanced admin dashboard & analytics,
  - Stripe with webhook handler,
  - One month email support,
  - Full Swagger documentation for robust testing,
  - Commercial use allowed
- [Buy now →](https://devyay.gumroad.com/l/nexus-backend-commerce)


🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to fork and open a pull request.

---

📄 License

MIT License

```
