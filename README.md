
#  Casting & Talent Management Platform

##  Project Description

A full-stack MERN web application that enables directors to create casting calls and allows talents to browse and apply for roles. The platform includes authentication, role-based access control, and secure file upload functionality.

##  Tech Stack
- Frontend
  
    -React.js
  
    -Context API
  
    -Axios
  
    -Tailwind CSS

- Backend
  
    -Node.js
  
    -Express.js
  
    -MongoDB
  
    -Mongoose
  
    -JWT Authentication
  
    -Multer (File Upload)


##  Features

- User registration & login
  
- JWT based authentication

- Role-based access (Director / Talent)

## Casting Management
- Directors can:
  
    -Create casting calls
  
    -Update casting details
  
    -Soft delete castings
  
    -View applications

- Talents can:
  
    -Browse active castings
  
    -Apply for roles
  
    -Upload portfolio files

## File Upload

   - Upload images, videos, and PDFs
   - Multer based file handling
   - Automatic uploads folder creation


## Project Structure

project-root

├── backend

   
   -controllers
  
   -models
  
   -routes
  
   -middleware
  
   -uploads
  
   -server.js



├── frontend


   -components
  
   -pages
  
   -context
  
   -api
   
   -App.jsx



##  Installation

### Clone Repository

git clone https://github.com/ksswathy53-ops/casting-audition-app.git

### Backend Setup

- cd backend  

- npm install  

- Create .env file inside backend:

      -PORT=5000

      -MONGO_URI=your_mongodb_connection

      -JWT_SECRET=your_secret_key

- npm run dev

### Frontend Setup

- cd frontend  

- npm install  

- npm run dev  

## File Upload Handling

- Uploads folder is automatically created when server runs.

- Supported formats:
  
    -Images (JPG, PNG)
  
    -Videos (MP4, MOV)
  
    -PDF files
  
- Maximum file size: 50MB

## Future Improvements

- Real time notifications

- Chat between director & talent

- Cloud storage integration


##  Author

### Swathy K S

- MERN Stack Developer

### Acknowledgement

- This project was developed as part of MERN stack training and self-learning practice.
