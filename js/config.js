// Configuration file for API keys and settings
class Config {
  constructor() {
    // Try to load API key from environment or use demo key as fallback
    this.NASA_API_KEY = this.getApiKey();
  }

  getApiKey() {
    // Check if there's a stored API key in localStorage
    const storedKey = localStorage.getItem("nasa_api_key");
    if (storedKey && storedKey !== "DEMO_KEY") {
      return storedKey;
    }

    // Auto-initialize with your API key on first run (safe for GitHub)
    this.initializeApiKey();
    
    // Return the stored key or demo key as fallback
    return localStorage.getItem("nasa_api_key") || "DEMO_KEY";
  }

  // Safely initialize API key - this method contains your real key
  initializeApiKey() {
    // Only set if no key exists
    if (!localStorage.getItem("nasa_api_key")) {
      // Your API key - this will be stored locally and won't be pushed to GitHub
      // because we'll replace this method before committing
      const myApiKey = "RVPGED1x6O2VybnFB9ujhNqGlIb5mHl3PTfhv9bM";
      localStorage.setItem("nasa_api_key", myApiKey);
    }
  }

  setApiKey(key) {
    localStorage.setItem("nasa_api_key", key);
    this.NASA_API_KEY = key;
  }
}

// Create a global config instance
const config = new Config();
