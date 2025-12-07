# 🎬 Drama China Apps

A full-stack application for browsing and streaming Chinese drama content.

## 📁 Project Structure

```
drama-china-apps/
├── mobile/     # React Native mobile app (Expo)
├── server/     # Node.js backend API
└── README.md
```

## 📱 Mobile App

React Native mobile application built with Expo.

### Tech Stack
- **Framework**: React Native + Expo SDK 54
- **Navigation**: React Navigation 7
- **State Management**: TanStack React Query
- **HTTP Client**: Axios

### Getting Started

```bash
cd mobile
npm install
npm start
```

## 🖥️ Server

Node.js backend API server.

### Tech Stack
- **Framework**: Express.js 5
- **Data Source**: @consumet/extensions
- **Caching**: node-cache

### Getting Started

```bash
cd server
npm install
npm run dev
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/JinzoU-MwM/drama-china-apps.git
   cd drama-china-apps
   ```

2. **Start the server**
   ```bash
   cd server && npm install && npm run dev
   ```

3. **Start the mobile app** (in a new terminal)
   ```bash
   cd mobile && npm install && npm start
   ```

## 📄 License

ISC
