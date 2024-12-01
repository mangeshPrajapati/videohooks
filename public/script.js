// Backend API endpoint
const API_URL = "/hooks/videos";

let currentPage = 1;
const videosperpage = 8;

// Function to fetch video URLs from the server based on the current page
async function fetchVideoLinks(page = 1) {
  try {
    const response = await fetch(
      `${API_URL}?page=${page}&videosperpage=${videosperpage}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const videoLinks = data.videos;

    // Update the UI with the fetched videos
    displayVideos(videoLinks);

    // Update pagination controls
    updatePaginationControls(data.currentPage, data.totalPages);
  } catch (error) {
    console.error("Error fetching video links:", error);
    document.getElementById("loading").textContent = "Failed to load videos.";
  }
}

// Function to display videos in the container
function displayVideos(videoLinks) {
  const videoContainer = document.getElementById("videoContainer");
  const loadingMessage = document.getElementById("loading");

  // Hide loading message once videos are loaded
  loadingMessage.style.display = "none";

  // Clear previous videos before adding new ones
  videoContainer.innerHTML = "";

  // Loop through each video URL and create the video card
  videoLinks.forEach((url, index) => {
    const videoCard = document.createElement("div");
    videoCard.classList.add(
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "flex",
      "flex-col",
      "items-center",
      "transform",
      "transition-transform",
      "duration-300",
      "hover:scale-105"
    );

    // Add the video player and title with 9:16 aspect ratio
    videoCard.innerHTML = `
            <div class="w-full aspect-w-9 aspect-h-16 mb-4">
                <video id="video-${index}" controls class="w-full h-full object-cover">
                    <source src="${url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
            <div class="p-4 w-full text-center">
                <button id="downloadButton" onclick="downloadFileByUrl('${url}', 'untitled.mp4')" >
                    Download Video
                </button>
            </div>
        `;

    // Append the video card to the container
    videoContainer.appendChild(videoCard);
    const video = document.getElementById(`video-${index}`);
    videoCard.addEventListener("mouseover", (e) => {
      // Check if the user has interacted with the document before playing the video
      if (document.hasFocus() || e.isTrusted) {
        video.play();
      } else {
        // If not, wait for user interaction (e.g., click) before playing
        document.addEventListener(
          "click",
          function playVideoOnInteraction() {
            video.play();
            document.removeEventListener("click", playVideoOnInteraction);
          },
          { once: true }
        );
      }
    });
  });
}

// Reusable function to download a file by URL
function downloadFileByUrl(url, fileName) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(blobUrl); // Clean up
    })
    .catch((error) => console.error("Download failed:", error));
}

// Function to update pagination controls
function updatePaginationControls(currentPage, totalPages) {
  const paginationContainer = document.getElementById("pagination");

  // Clear current pagination controls
  paginationContainer.innerHTML = "";

  // Add Previous button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add(
      "px-4",
      "py-2",
      "bg-blue-500",
      "text-white",
      "rounded-lg",
      "hover:bg-blue-600",
      "transition"
    );
    prevButton.addEventListener("click", () => {
      currentPage--;
      fetchVideoLinks(currentPage);
    });
    paginationContainer.appendChild(prevButton);
  }

  // Add Next button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add(
      "px-4",
      "py-2",
      "bg-blue-500",
      "text-white",
      "rounded-lg",
      "hover:bg-blue-600",
      "transition"
    );
    nextButton.addEventListener("click", () => {
      currentPage++;
      fetchVideoLinks(currentPage);
    });
    paginationContainer.appendChild(nextButton);
  }
}

// Initial load
document.addEventListener("DOMContentLoaded", () =>
  fetchVideoLinks(currentPage)
);
