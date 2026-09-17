# Geidea App

This project is an Angular application with a Node.js Express backend proxy for Google Analytics data.

## Getting Started

Follow these steps to run the application locally.

### 1. Install Dependencies

First, ensure you have Node.js installed, then install the project dependencies:

```bash
npm install
```

### 2. Start the Backend Server (Analytics Proxy)

The application relies on a local Node.js Express server to fetch and proxy Google Analytics data. Open a terminal and run:

```bash
node analytics-server.js
```
The analytics server will start on `http://localhost:3000`.

*(Note: The server requires a valid `geidea-analytics-998b0b4f4c67.json` service account key file in the root directory to authenticate with Google Analytics).*

### 3. Start the Angular Development Server

Open a second terminal window/tab and start the Angular frontend application:

```bash
npm start
```
*(This command runs `ng serve --proxy-config proxy.conf.json` behind the scenes, routing API calls to the backend).*

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Project Structure

- `src/app/`: Contains the Angular frontend code (components, services, etc.)
- `analytics-server.js`: The backend Node.js proxy server for Google Analytics Data API.
- `proxy.conf.json`: Configuration to proxy frontend `/api` requests to the local Node.js server running on port 3000.

## Building for Production

To build the project for production, run:

```bash
npm run build
```

This will compile the Angular project and store the build artifacts in the `dist/` directory, optimized for performance and speed.
