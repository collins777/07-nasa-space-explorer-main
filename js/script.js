// Find our date picker inputs on the page
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const getImagesBtn = document.getElementById("getImagesBtn");
const gallery = document.getElementById("gallery");

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA APOD API endpoint
const NASA_API_URL = "https://api.nasa.gov/planetary/apod";
// API key is now managed by config.js
// You can get a free API key at https://api.nasa.gov/

// Store the full image data for modal display
let currentImages = [];

// Array of fun space facts
const spaceFacts = [
  "A day on Venus is longer than its year! Venus rotates so slowly that one day takes 243 Earth days, but it only takes 225 Earth days to orbit the Sun.",
  "Neutron stars are so dense that a teaspoon of their material would weigh about 6 billion tons on Earth!",
  "The largest volcano in our solar system is Olympus Mons on Mars, which is nearly three times the height of Mount Everest.",
  "Saturn's moon Titan has lakes and rivers, but they're made of liquid methane and ethane instead of water.",
  "If you could drive a car to the Moon at highway speeds (60 mph), it would take you about 160 days of non-stop driving.",
  "The footprints left by astronauts on the Moon will likely remain there for millions of years because there's no wind or water to erode them.",
  "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth!",
  "One million Earths could fit inside the Sun, yet the Sun is considered a medium-sized star.",
  "A black hole with the mass of a car would have a diameter smaller than an atom but create the same gravitational pull as the car.",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but don't worry - they won't collide for about 4.5 billion years!",
  "Space is completely silent because sound waves need a medium (like air) to travel through, and space is a vacuum.",
  "The International Space Station travels at 17,500 mph and orbits Earth every 90 minutes.",
  "Mercury has ice at its poles despite being the closest planet to the Sun, because its poles never receive direct sunlight.",
  "A single cloud in space can be many light-years across and contain enough material to make thousands of stars like our Sun.",
  "The coldest place in the universe that we know of is the Boomerang Nebula, where temperatures reach -457°F (-272°C).",
];

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url) {
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Function to fetch images from NASA APOD API
async function fetchNASAImages(startDate, endDate) {
  try {
    // Show loading message
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔭</div>
        <p>Loading amazing space images...</p>
      </div>
    `;

    // Build the API URL with date range
    const url = `${NASA_API_URL}?api_key=${config.NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    // Fetch data from NASA API
    const response = await fetch(url);

    // Check if the request was successful
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          `Rate limit exceeded. Please wait a moment and try again, or use your own NASA API key for higher limits.`
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    } // Convert response to JSON
    const data = await response.json();

    // Store the full image data for modal use
    currentImages = data;

    // Display the images
    displayImages(data);
  } catch (error) {
    // Show error message if something goes wrong
    console.error("Error fetching NASA images:", error);

    let errorMessage = "Sorry, there was an error loading the images.";

    if (error.message.includes("Rate limit exceeded")) {
      errorMessage = `
        ${error.message}<br><br>
        <strong>Solutions:</strong><br>
        • Wait a few minutes and try again<br>
        • Try selecting fewer days (smaller date range)<br>
        • <button onclick="config.promptForApiKey()" class="btn btn-primary btn-sm">Enter Your NASA API Key</button><br>
        • Get your own free NASA API key at <a href="https://api.nasa.gov/" target="_blank">api.nasa.gov</a>
      `;
    }

    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>${errorMessage}</p>
      </div>
    `;
  }
}

// Function to display images in Bootstrap cards
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = "";

  // Check if we have any images
  if (!images || images.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">📷</div>
        <p>No images found for the selected date range.</p>
      </div>
    `;
    return;
  }

  // Create a Bootstrap card for each item (image or video)
  images.forEach((item, index) => {
    let cardHTML = "";

    if (item.media_type === "image") {
      // Create card for images
      cardHTML = `
        <div class="col-md-4 mb-4">
          <div class="card h-100" style="cursor: pointer;" data-image-index="${index}">
            <img src="${item.url}" class="card-img-top" alt="${item.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text"><small class="text-muted">${item.date}</small></p>
            </div>
          </div>
        </div>
      `;
    } else if (item.media_type === "video") {
      // Create card for videos
      const isYoutube =
        item.url.includes("youtube.com") || item.url.includes("youtu.be");
      let videoContent = "";

      if (isYoutube) {
        // Extract YouTube video ID and create embed
        const videoId = extractYouTubeId(item.url);
        if (videoId) {
          videoContent = `
            <div class="ratio ratio-16x9">
              <iframe src="https://www.youtube.com/embed/${videoId}" 
                      title="${item.title}" 
                      allowfullscreen
                      style="border-radius: 8px 8px 0 0;"></iframe>
            </div>
          `;
        } else {
          // Fallback for YouTube videos that can't be embedded
          videoContent = `
            <div class="card-img-top d-flex align-items-center justify-content-center" style="height: 250px; background-color: #f8f9fa;">
              <div class="text-center">
                <div style="font-size: 48px; margin-bottom: 10px;">🎥</div>
                <a href="${item.url}" target="_blank" class="btn btn-primary">Watch Video</a>
              </div>
            </div>
          `;
        }
      } else {
        // For other video types, show a link
        videoContent = `
          <div class="card-img-top d-flex align-items-center justify-content-center" style="height: 250px; background-color: #f8f9fa;">
            <div class="text-center">
              <div style="font-size: 48px; margin-bottom: 10px;">🎥</div>
              <a href="${item.url}" target="_blank" class="btn btn-primary">Watch Video</a>
            </div>
          </div>
        `;
      }

      cardHTML = `
        <div class="col-md-4 mb-4">
          <div class="card h-100" style="cursor: pointer;" data-image-index="${index}">
            ${videoContent}
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text"><small class="text-muted">${item.date} • Video</small></p>
            </div>
          </div>
        </div>
      `;
    }

    // Add the card to the gallery if content was created
    if (cardHTML) {
      gallery.innerHTML += cardHTML;
    }
  });

  // Add click event listeners to all cards
  const cards = gallery.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Get the image index from the card's data attribute
      const imageIndex = card.getAttribute("data-image-index");
      // Show the modal with this image's details
      showImageModal(currentImages[imageIndex]);
    });
  });

  // If no content was added, show a message
  if (gallery.innerHTML.trim() === "") {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">📷</div>
        <p>No images or videos found for this date range. Try selecting different dates.</p>
      </div>
    `;
  }
}

// Function to show the modal with image or video details
function showImageModal(itemData) {
  // Get modal elements
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDate = document.getElementById("modalDate");
  const modalExplanation = document.getElementById("modalExplanation");

  // Set the title, date, and explanation (same for both images and videos)
  modalTitle.textContent = itemData.title;
  modalDate.textContent = `Date: ${itemData.date}`;
  modalExplanation.textContent = itemData.explanation;

  // Handle content based on media type
  if (itemData.media_type === "image") {
    // Show image
    modalImage.src = itemData.url;
    modalImage.alt = itemData.title;
    modalImage.style.display = "block";

    // Hide any existing video content
    const existingVideo = modal.querySelector(".video-container");
    if (existingVideo) {
      existingVideo.remove();
    }
  } else if (itemData.media_type === "video") {
    // Hide the image element
    modalImage.style.display = "none";

    // Remove any existing video container
    const existingVideo = modal.querySelector(".video-container");
    if (existingVideo) {
      existingVideo.remove();
    }

    // Create video content
    const modalBody = modal.querySelector(".modal-body");
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container mb-3";

    const isYoutube =
      itemData.url.includes("youtube.com") || itemData.url.includes("youtu.be");

    if (isYoutube) {
      const videoId = extractYouTubeId(itemData.url);
      if (videoId) {
        // Embed YouTube video
        videoContainer.innerHTML = `
          <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    title="${itemData.title}" 
                    allowfullscreen
                    style="border-radius: 8px;"></iframe>
          </div>
        `;
      } else {
        // Fallback for YouTube videos that can't be embedded
        videoContainer.innerHTML = `
          <div class="text-center p-4" style="background-color: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 64px; margin-bottom: 20px;">🎥</div>
            <h5>YouTube Video</h5>
            <p class="mb-3">This video is hosted on YouTube</p>
            <a href="${itemData.url}" target="_blank" class="btn btn-primary btn-lg">Watch on YouTube</a>
          </div>
        `;
      }
    } else {
      // For other video types
      videoContainer.innerHTML = `
        <div class="text-center p-4" style="background-color: #f8f9fa; border-radius: 8px;">
          <div style="font-size: 64px; margin-bottom: 20px;">🎥</div>
          <h5>Video Content</h5>
          <p class="mb-3">Click below to watch this video</p>
          <a href="${itemData.url}" target="_blank" class="btn btn-primary btn-lg">Watch Video</a>
        </div>
      `;
    }

    // Insert video container before the date element
    modalBody.insertBefore(videoContainer, modalDate.parentElement);
  }

  // Show the modal using Bootstrap's modal API
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}

// Function to display a random space fact
function displayRandomSpaceFact() {
  const factElement = document.getElementById("spaceFact");
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const randomFact = spaceFacts[randomIndex];

  // Add a subtle animation effect
  factElement.style.opacity = "0";
  setTimeout(() => {
    factElement.textContent = randomFact;
    factElement.style.opacity = "1";
  }, 200);
}

// Add event listener to the "Get Space Images" button
getImagesBtn.addEventListener("click", () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  // Check if start date is before end date
  if (new Date(startDate) > new Date(endDate)) {
    alert("Start date must be before end date.");
    return;
  }

  // Fetch and display the images
  fetchNASAImages(startDate, endDate);

  // Display a new random space fact when user gets images
  displayRandomSpaceFact();
});
