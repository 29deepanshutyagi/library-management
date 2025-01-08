# Library Management System

## Project Overview
The Library Management System is a RESTful API designed to manage a library system efficiently. It includes authentication, book management, user management, borrowing and returning functionality, payments, and analytics.

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Book Management APIs](#book-management-apis)
3. [User Management APIs](#user-management-apis)
4. [Borrow & Return APIs](#borrow--return-apis)
5. [Payment APIs](#payment-apis)
6. [Analytics APIs](#analytics-apis)
7. [Setup Instructions](#setup-instructions)

---

## Authentication APIs
### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123",
    "role": "member" // or "admin"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully. Please verify your email."
  }
  ```

### 2. Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "id": "1",
      "name": "John Doe",
      "role": "member"
    }
  }
  ```

### 3. Verify Email
- **Method**: `GET`
- **Endpoint**: `/api/auth/verify-email?token=<EMAIL_TOKEN>`
- **Response**:
  ```json
  {
    "message": "Email verified successfully."
  }
  ```

---

## Book Management APIs
### 1. Add Book (Admin only)
- **Method**: `POST`
- **Endpoint**: `/api/books`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Body**:
  ```json
  {
    "isbn": "1234567890",
    "title": "Book Title",
    "author": "Author Name",
    "category": "Fiction",
    "copies": 10
  }
  ```
- **Response**:
  ```json
  {
    "message": "Book added successfully."
  }
  ```

### 2. Edit Book (Admin only)
- **Method**: `PUT`
- **Endpoint**: `/api/books/:id`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Body**:
  ```json
  {
    "title": "Updated Book Title",
    "copies": 5
  }
  ```
- **Response**:
  ```json
  {
    "message": "Book updated successfully."
  }
  ```

### 3. Delete Book (Admin only)
- **Method**: `DELETE`
- **Endpoint**: `/api/books/:id`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Book deleted successfully."
  }
  ```

### 4. Get Book Details
- **Method**: `GET`
- **Endpoint**: `/api/books/:isbn`
- **Response**:
  ```json
  {
    "isbn": "1234567890",
    "title": "Book Title",
    "author": "Author Name",
    "category": "Fiction",
    "copies": 5
  }
  ```

### 5. Search Books
- **Method**: `GET`
- **Endpoint**: `/api/books/search`
- **Query Params**:
  - `?category=Fiction`
  - `?author=Author Name`
  - `?availability=true`
- **Response**:
  ```json
  [
    {
      "isbn": "1234567890",
      "title": "Book Title",
      "author": "Author Name",
      "category": "Fiction",
      "copies": 5
    }
  ]
  ```

---

## User Management APIs
### 1. View User Details
- **Method**: `GET`
- **Endpoint**: `/api/users/:id`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  ```json
  {
    "id": "1",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "role": "member",
    "borrowedBooks": [
      {
        "isbn": "1234567890",
        "title": "Book Title",
        "dueDate": "2024-01-01"
      }
    ]
  }
  ```

### 2. Enable/Disable User Account
- **Method**: `PATCH`
- **Endpoint**: `/api/users/:id/disable`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User account disabled successfully."
  }
  ```

---

## Borrow & Return APIs
### 1. Borrow Book
- **Method**: `POST`
- **Endpoint**: `/api/borrow`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Body**:
  ```json
  {
    "isbn": "1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Book borrowed successfully. Due date: 2024-01-01."
  }
  ```

### 2. Return Book
- **Method**: `POST`
- **Endpoint**: `/api/return`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Body**:
  ```json
  {
    "isbn": "1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Book returned successfully. Fine: $5."
  }
  ```

---

## Payment APIs
### 1. Pay Fine
- **Method**: `POST`
- **Endpoint**: `/api/payments/fine`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Body**:
  ```json
  {
    "amount": 5
  }
  ```
- **Response**:
  ```json
  {
    "message": "Payment successful. Invoice ID: 1234."
  }
  ```

---

## Analytics APIs
### 1. Most Borrowed Books
- **Method**: `GET`
- **Endpoint**: `/api/analytics/most-borrowed`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  ```json
  [
    {
      "isbn": "1234567890",
      "title": "Book Title",
      "borrowCount": 15
    }
  ]
  ```

### 2. Monthly Usage Report
- **Method**: `GET`
- **Endpoint**: `/api/analytics/monthly-report`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Response**:
  ```json
  {
    "totalBooksBorrowed": 120,
    "totalFines

