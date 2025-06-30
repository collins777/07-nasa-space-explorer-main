# NASA Space Explorer Setup

## Getting Your NASA API Key

1. Visit [https://api.nasa.gov/](https://api.nasa.gov/)
2. Click "Get Started" and fill out the form
3. You'll receive your API key via email

## Setup Instructions

### Option 1: Use Your Own API Key (Recommended)

1. Copy `.env.example` to `.env`
2. Replace `your_nasa_api_key_here` with your actual NASA API key in the `.env` file
3. Open the app in your browser

### Option 2: Demo Key (Limited)

The app will automatically use NASA's demo key (`DEMO_KEY`) if no API key is configured. Note that the demo key has rate limits and may not work during high traffic periods.

### Option 3: Browser Storage

You can also store your API key in the browser's localStorage by running this in the browser console:

```javascript
config.setApiKey("your_nasa_api_key_here");
```

## Security Notes

- The `.env` file is automatically ignored by Git (see `.gitignore`)
- Never commit your actual API key to version control
- The `.env.example` file shows the required format without exposing your key

## Project Structure

```
├── .env.example      # Template for environment variables
├── .gitignore       # Git ignore file (includes .env)
├── index.html       # Main HTML file
├── style.css        # CSS styles
├── js/
│   ├── config.js    # API key configuration
│   ├── dateRange.js # Date picker setup
│   └── script.js    # Main application logic
└── img/             # NASA logos and images
```
