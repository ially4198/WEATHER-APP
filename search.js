
const apiKey = "cf78efa90dbdae6a9d4d0353e6d9380e";
const content = document.querySelector(".content");
const cityInput = document.querySelector(".city-input");
const noReferrer =  document.querySelector(".emptySearch");
console.log(noReferrer);
// Select the container element (single element) so we can safely set .style
const weatherDataDisplay = document.querySelector(".weatherDataDisplay");
console.log(weatherDataDisplay);
const tempData = document.querySelector(".temp");
const windData = document.querySelector(".wind");
const pressureData= document.querySelector(".pressure");
const humidityData = document.querySelector(".humidity");
const sunriseData = document.querySelector(".sunrise");
const sunsetData = document.querySelector(".sunset");
cityInput.addEventListener("keypress", event => {
  if (event.key === "Enter") {
    const cityName = cityInput.value.trim();
    if(cityName !== "") {
     weatherDataDisplay.style.display = "flex";
     noReferrer.style.display = "none";
    }else{
      weatherDataDisplay.style.display = "none";
      noReferrer.style.display = "block";
    }

    fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=jsonv2`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch coordinates");
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) throw new Error("City not found");

        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log(`Coordinates for ${cityName}:`, lat, lon);

        // ✅ Return the next fetch (CHAINED)
        return fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch weather data");
        return response.json();
      })
      .then((weatherData) => {
        console.log("Weather Data:", weatherData);
        // Update the UI with weather data
        tempData.innerHTML = `<div><p>${weatherData.name} </p>
        <p> ${Math.round(weatherData.main.temp)} °C</p></div>
        <div
          <p class="search-weather-icon"><i class="fa-solid fa-cloud"></i></p>
        </div>`;
        windData.innerHTML = `<p><i class="fa-solid fa-wind"></i>
        <p> Wind</p>
        <p>${weatherData.wind.speed} m/s</p>`;
        pressureData.innerHTML = `<p><i class="fa-solid fa-gauge-high"></i></p>
        <p>Pressure</p>
        <p>${weatherData.main.pressure} hPa</p>`;
        humidityData.innerHTML = `<p><i class="fa-solid fa-droplet"></i></p>
        <p> Humidity</p>
        <p>${weatherData.main.humidity} %</p>`;  
        sunriseData.innerHTML = `<p><i class="fa-solid fa-sun"></i></p>
        <p>Sunrise</p>
        <p>${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>`;  
        sunsetData.innerHTML = `<p><i class="fa-solid fa-moon"></i></p>
        <p>Sunset</p>
        <p>${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>`;

      
        
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
