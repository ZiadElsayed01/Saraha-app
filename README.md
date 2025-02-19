# Saraha App

Saraha App is an anonymous messaging web application where users can send and receive anonymous messages.

## Features

- User authentication (signup, login, logout)
- Send anonymous messages to other users
- Receive messages anonymously
- View received messages
- Delete messages
- Secure authentication with password hashing

## Tech Stack

- **Back-End:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Token)

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login to the app
- `POST /api/messages/send` - Send an anonymous message
- `GET /api/messages/received` - Get received messages
- `DELETE /api/messages/:id` - Delete a message

## Contributing

Feel free to fork this repository and submit pull requests for improvements.
