# COMP3133 -- Assignment 1

## GraphQL Employee Management System

### Student Information

-   Course: COMP3133
-   Assignment: Assignment 1 -- GraphQL Backend
-   Database: MongoDB
-   API Type: GraphQL
-   Authentication: JWT (JSON Web Token)

------------------------------------------------------------------------

## Project Overview

This project is a GraphQL-based Employee Management System built using:

-   Node.js
-   Express
-   Apollo Server
-   MongoDB (Mongoose)
-   JWT Authentication
-   Postman for API testing

The system supports authentication and full CRUD operations for
employees.

------------------------------------------------------------------------

## Features Implemented

### Authentication

-   Signup
-   Login (JWT Token generation)
-   Protected routes using Bearer token

### Employee Management (CRUD)

1.  Add Employee
2.  Get All Employees
3.  Get Employee By EID
4.  Update Employee By EID
5.  Delete Employee By EID
6.  Search Employees by Designation
7.  Search Employees by Department

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root directory:

``` env
MONGODB_URI=mongodb://127.0.0.1:27017/comp3133_assignment1
PORT=4000
JWT_SECRET=your_secret_key
```

------------------------------------------------------------------------

## Installation & Setup

1.  Clone the repository
2.  Install dependencies:

``` bash
npm install
```

3.  Start MongoDB locally
4.  Run the server:

``` bash
npm start
```

Server will run at:

    http://localhost:4000/graphql

------------------------------------------------------------------------

## API Testing

All APIs were tested using Postman.

### Testing Flow Order

1.  Signup
2.  Login (Token generated and saved)
3.  Add Employee
4.  Get All Employees
5.  Get Employee By EID
6.  Update Employee
7.  Delete Employee
8.  Search by Designation
9.  Search by Department

------------------------------------------------------------------------

## Database Proof

MongoDB Compass was used to verify:

-   Users collection
-   Employees collection
-   Created, Updated, and Deleted records

------------------------------------------------------------------------

## Security Implementation

-   Passwords are hashed using bcrypt
-   JWT used for authentication
-   Protected GraphQL resolvers check Authorization header

------------------------------------------------------------------------

## Submission Contents

-   Source Code
-   Postman Collection
-   Postman Environment
-   Screenshots of API responses
-   MongoDB Compass proof
-   This README file

------------------------------------------------------------------------

## Author

Hussein Bani Khaled\
George Brown College\
Computer Programming & Analysis

------------------------------------------------------------------------


