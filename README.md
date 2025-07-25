# MERN Ecommerce Project

This is a full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It supports user registration, login, product browsing, cart functionality, and admin product management.

## Features

- User authentication using JWT
- Product listing and pagination
- Shopping cart
- Admin panel for product management
- Email sending capability
- Image upload with Cloudinary

## Tech Stack

- Frontend: React
- Backend: Express + Node.js
- Database: MongoDB
- Other Services: Cloudinary (image hosting), Nodemailer (email), JWT (authentication)

---

## 📦 Project Structure

```
root/
├── client/          # React frontend
├── server/          # Express backend
└── README.md
```


🧪 How to Run This Project Locally
You need to run both the frontend and the backend in separate terminals.

1. Clone the repository
```
git clone https://github.com/ThaiMinhTam2504/e-commerce-follow-by-hip06.git
cd e-commerce-follow-by-hip06
```
⚠️ Important:
By default, GitHub may show the master branch, but all the complete code is in the main branch.
Make sure to switch to the main branch after cloning:
```
git checkout main
```

2. Install Dependencies
For client:
```
cd client
npm install
```
For server:
```
cd ../server
npm install
```
3. Set up Environment Variables

Create two .env files manually (they are not included in the repository).

In client/.env:
REACT_APP_API_URI=http://localhost:5000/api
REACT_APP_LIMIT=8
REACT_APP_MCETINY=your_mce_api_key_here

In server/.env:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/any_name_you_want_here
JWT_SECRET=your_jwt_secret
EMAIL_APP_PASSWORD=your_email_app_password
EMAIL_NAME=youremail@example.com
URL_SERVER=http://localhost:5000
LIMIT_PRODUCTS=8
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:3000

Replace all the placeholder values with your actual config (especially secrets, API keys, etc.)

🚀 Run the Project
In one terminal (for client):
cd client
npm start

In another terminal (for server):
cd server
npx nodemon server

Then open your browser and go to http://localhost:3000




