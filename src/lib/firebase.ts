// Firebase side-effect module.
// This file is imported solely for analytics side-effects in the browser.
// In environments where Firebase config is not available it is a no-op.
//
// To enable Firebase Analytics, install `firebase` and set the
// NEXT_PUBLIC_FIREBASE_API_KEY / NEXT_PUBLIC_FIREBASE_PROJECT_ID /
// NEXT_PUBLIC_FIREBASE_APP_ID environment variables.

let initialized = false;

if (typeof window !== "undefined") {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    initialized = !!(apiKey && projectId && appId);
  } catch {
    initialized = false;
  }
}

export const firebaseInitialized = initialized;
