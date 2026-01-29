# Cupid Project - Dashboard

This is the frontend dashboard for the Cupid Project, built with React, Vite, and Tailwind CSS.

## Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

## Installation

1.  Navigate to the `dashboard` directory:
    ```bash
    cd dashboard
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Create a `.env` file in the `dashboard` directory to configure the application. You can use `.env.example` as a reference if available.

Required environment variables:

```env
# The URL of your deployed backend (or localhost for dev)
VITE_API_URL=http://localhost:3001

# Your Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at specific port (usually `http://localhost:5173`).

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
