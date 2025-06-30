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

    // Auto-initialize with demo key for GitHub version
    this.initializeApiKey();
    
    // Return the stored key or demo key as fallback
    return localStorage.getItem("nasa_api_key") || "DEMO_KEY";
  }

  // GitHub-safe initialization - prompts user for API key
  initializeApiKey() {
    // Only set if no key exists
    if (!localStorage.getItem("nasa_api_key")) {
      // For GitHub version: prompt user or use demo key
      console.log("Using DEMO_KEY - for your own API key, use config.setApiKey('your_key')");
      localStorage.setItem("nasa_api_key", "DEMO_KEY");
    }
  }

  setApiKey(key) {
    localStorage.setItem("nasa_api_key", key);
    this.NASA_API_KEY = key;
  }

  // Helper function to prompt user for API key
  promptForApiKey() {
    const key = prompt(
      "Enter your NASA API key (get one free at https://api.nasa.gov/).\n\n" +
      "Leave blank to continue with demo key (limited):"
    );
    
    if (key && key.trim()) {
      this.setApiKey(key.trim());
      alert("API key saved! Try your request again.");
      return true;
    }
    return false;
  }
}

// Create a global config instance
const config = new Config();
