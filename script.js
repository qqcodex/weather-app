// Runs when user clicks Search button or presses Enter key
// "async" keyword allows the use of "await" inside the function, which pauses execution until the promise is resolved
async function fetchWeather() {
    // Get the text typed in the search box; trim() removes spaces at the start and end
  const searchInput = document.querySelector('#search').value.trim();
    // Get the empty div where the results will be shown
  const weatherDataSection = document.querySelector('#weather-data');
  // Make the results div visible (it's hidden with display: none in CSS)
  weatherDataSection.style.display = "block";
  // Get the API key from config.js (kept out of GitHub by .gitignore)
  const apiKey = API_KEY;


    // If the search box is empty, show an error message...
  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>`;
    return;
  }
// Step 1: turn the city name into coordinates (latitude and longitude)
  async function getLonAndLat() {
    // encodeURIComponent makes the city name safe to use in a URL (e.g. spaces become %20). // limit=1 asks for only the best match.
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
    // Send the request and wait for the response
    const response = await fetch(geocodeURL);
    if (!response.ok) { // If the request failed (e.g. 401 = bad API key), log the status code and return null
      console.log("Bad response!", response.status);
      return null;
    }
    const data = await response.json(); // parse the JSON response into a JavaScript object
    return data.length ? data[0] : null; // If at least one place was found, return the first; otherwise return null
  } // func returns an array of matching places, but we only want the first one (the best match). If no matches were found, return null.

// Step 2: use the coordinates to get the current weather
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response!", response.status);
      return;
    }
    const data = await response.json(); //displays weather data 
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p> 
      </div>`;
      //data.weather gets the weather array.
      //[0] takes the first object in that array.
      //data.weather[0].description takes the description from that object.
  }
// try/catch catches unexpected errors (e.g. no internet) so the app doesn't break silently
  try {
    // Clear the search box so it's ready for the next search
    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();

    if (!geocodeData) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
      return;
    }

    await getWeatherData(geocodeData.lon, geocodeData.lat);
  } catch (error) {
    // Log the full error for debugging (F12 → Console)
    console.error(error);
    // Show a friendly message to the user
    weatherDataSection.innerHTML = `<p>Something went wrong. Check your connection and try again.</p>`;
  }
}

// Listen for key presses in the search box
document.querySelector('#search').addEventListener('keydown', (e) => {
    // If the key pressed was Enter, run the search (same as clicking the button)
if (e.key === 'Enter') {
    fetchWeather();
  }
    });