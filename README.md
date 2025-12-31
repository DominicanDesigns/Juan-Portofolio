# Juan Portfolio (GitHub Pages Edition)

A high-performance personal portfolio website converted to a **Client-Side SPA** architecture for GitHub Pages deployment.

## Features

- **Static Logic Engine**: The Python backend was ported to `src/logic/` using pure JavaScript.
- **Client-Side Database**: Data (Users, Messages) persists in `localStorage`.
- **Authentication**: Fully functional Register/Login system.
- **Real-time Chat**: Simulated socket connection handling messaging.
- **Admin Panel**: "God Mode" enabled for user management and chat log purging.

## Architecture

This project was originally a Flask application. To run on GitHub Pages (which supports only static files), the architecture was shifted:

1.  **Database**: `sqlite3` -> `localStorage` wrapper (`src/logic/db.js`).
2.  **Auth**: `Flask-Login` -> `AuthService` (`src/logic/auth-service.js`).
3.  **Chat**: `Flask-SocketIO` -> `ChatService` (`src/logic/chat-service.js`).
4.  **Routing**: `Flask Routes` -> Direct HTML Links (`chat.html`, `login.html`).

## Admin Access

To test the Admin features:

1.  Go to `login.html`.
2.  Username: `Administrator`
3.  Password: `Juan5872890@@@@`
4.  Security Key: `rasta`
5.  Access the "Admin Panel" link from the Chat interface.

## Deployment

1.  Push this repository to GitHub.
2.  Go to Settings -> Pages.
3.  Select `main` branch (root).
4.  Save.

The site will be live immediately.
