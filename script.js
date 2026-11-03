async function fetchWeather() {
  const searchInput = document.querySelector('#search').value.trim();
  const weatherDataSection = document.querySelector('#weather-data');
  weatherDataSection.style.display = "block";
  const apiKey = API_KEY;

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>`;
    return;
  }

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response!", response.status);
      return null;
    }
    const data = await response.json();
    return data.length ? data[0] : null;
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response!", response.status);
      return;
    }
    const data = await response.json();
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>`;
  }

  try {
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
    console.error(error);
    weatherDataSection.innerHTML = `<p>Something went wrong. Check your connection and try again.</p>`;
  }
}