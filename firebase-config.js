// Firebase config - Replace with your own Firebase project
// Free tier: 100 simultaneous connections, 1GB storage, 50MB/day download
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Premium emails stored in Firebase (Realtime Database path: /premium_emails)
// Structure: { "email@example.com": true, "another@email.com": true }
