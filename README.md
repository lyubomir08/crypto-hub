# 🚀 Crypto Hub

## 📜 Project Description

**Crypto Hub** is a **single-page application (SPA)** built with **Angular**, providing users with an intuitive interface to explore and manage cryptocurrency data. Users can search for specific cryptocurrencies, view detailed information, and engage with crypto-related records. The app features a **role-based authentication system**, ensuring that **only admins** can manage cryptocurrencies and approve blog articles.

This project is powered by the **MEAN stack**:  
- **Front-end:** Angular  
- **Back-end:** Node.js with Express.js  
- **Database:** MongoDB  
- **Styling:** Tailwind CSS  

---

## ⚙️ Features

### 🔓 Public Pages

- **Home** – Overview of the app with highlighted features.  
- **Catalog** – Browse all available cryptocurrencies, view details, and comments.  
- **Search** – Find specific cryptocurrencies quickly.  
- **About** – Learn more about the purpose and functionalities of the app.  
- **Login/Register** – Users can create accounts and log in to access additional features.  
- **Blog** – Browse articles related to crypto (only **admin-approved** articles are visible).  

### 🔐 Private Pages (Registered Users)

- **Profile Management** – Users can **update their name and email**.  
- **Interact with Records** – Users can **comment** on cryptocurrencies and **create** articles.  

### 🔑 Admin-Only Features

- **Add Cryptocurrencies** – Only **admins** can create new cryptocurrency entries.  
- **Edit/Delete Cryptocurrencies** – Admins can modify or remove cryptocurrencies.  
- **Manage Comments** – Admins can edit or delete any comment.  
- **Blog Management** – Only **admin-approved** articles will be visible in the blog.

## Go and see it - https://lyubomir08.github.io/crypto-hub/

---

## 🚀 Installation and Setup

### 📌 Prerequisites

- **Node.js** installed on your machine  
- **MongoDB** installed and running locally or a cloud-based MongoDB connection  
- **Angular CLI** installed globally

### **Set up environment variables**:

1. In the `backend` folder, create a `.env` file with the following variables:
     ```bash
     PORT=5000
     MONGODB_URI=<Your-MongoDB-Connection-String>
     JWT_SECRET=<Your-Secret-Key>

3. Replace `<Your-MongoDB-Connection-String>` with your MongoDB connection string (e.g., from MongoDB Atlas or your local MongoDB instance).
4. Replace `<Your-Secret-Key>` with a strong secret key for JWT authentication.

### **Install dependencies**

- In both frontend/crypto-hub and backend folder type "npm i".

### Steps

1. **Clone the repository**:
   Github URL
   ```bash
   https://github.com/lyubomir08/crypto-hub
3. **Start the client**:
   ```bash
   cd .\frontend\crypto-hub\
   and type "ng serve"
4. **Start the server**:
   - open new terminal and type:
   ```bash
   cd .\backend\
   and type "npm start"
