# Crypto Hub

## 📜 Project Description

The **Crypto Hub** is a comprehensive single-page application (SPA) developed using Angular, designed to provide users with an intuitive interface to explore and manage cryptocurrency data. Users can search for specific cryptocurrencies, view detailed information, and manage their own crypto-related records. The app features a robust user authentication system, enabling registered users to create, edit, and manage their content.

This project is built using the **MEAN stack**: Angular for the front-end, Node.js and MongoDB for the back-end, and Tailwind CSS for styling.

---

## 🌟 Features

### Public Pages

- **Home**: Overview of the app with highlighted features.
- **Catalog**: Lists all available cryptocurrencies with basic details and comments.
- **Search**: Allows users to search for specific cryptocurrencies.
- **About**: Provides information about the app and its purpose.
- **Login**: Enables users to sign into their accounts.
- **Register**: Allows new users to create an account.

### Private Pages

- **Create Record**: Lets logged-in users add new crypto-related entries.
- **Edit/Delete**: Enables users to update or delete their entries.

### Additional Functionalities

- View detailed information about individual cryptocurrencies with comments.
- Interact with records - comment.
- Persistent login after refresh using JWT authentication.
- Responsive design with Tailwind CSS for an excellent user experience across devices.

---

## ⚙️ Technologies Used

### Front-End

- **Angular**: Framework for building dynamic SPA.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.

### Back-End

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Framework for creating the REST API.

### Database

- **MongoDB**: NoSQL database for storing user and cryptocurrency data.

---

## 🚀 Installation and Setup

Follow these steps to run the project locally:

### Prerequisites

- Node.js installed on your machine.
- MongoDB installed and running locally or access to a cloud MongoDB service.
- Angular CLI installed globally.

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

   
