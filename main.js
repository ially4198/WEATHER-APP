const apiKey = "cf78efa90dbdae6a9d4d0353e6d9380e";
const temperature = document.querySelector(".temperature-value");
const condition = document.querySelector(".weather-condi");
const cityName = document.querySelector(".city-name");
const weatherIcon = document.querySelector(".weather-icon");
const forecastDivs = document.querySelectorAll(".day-forecast");
const todayForecast = document.querySelector(".today-forecast");
// Ask for user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  console.error("Geolocation not supported in this browser.");
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  console.log("📍 Your coordinates:", lat, lon);

  // Fetch the 5-day / 3-hour forecast
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch weather data");
      return response.json();
    })
    .then((data) => {
      console.log("Weather Data:", data);
      console.log("🏙️ Location:", data.city.name, data.city.country);
      console.log("🌦 Full 5-Day Forecast Data:", data);
      cityName.innerHTML = `<i class="fa-solid fa-map-pin"></i> ${data.city.name}, ${data.city.country}`;
      temperature.innerHTML = `<p class="temp-value">${Math.round(
        data.list[0].main.temp
      )}<sup>o</sup></p>`;
      condition.innerHTML = ` <p class="weather-description">${data.list[0].weather[0].description} </p>
          <p class="weather-description">H: ${data.list[0].main.humidity} || F: ${data.list[0].main.feels_like}</p>`;
          todayForecast.innerHTML = `<p class="today-forecast-title" >TODAY</p>
          <img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" ">
          <p class="temp-value-today">${Math.round(data.list[0].main.temp)}<sup>o</sup>C</p>
          <p class = "desc-today">${data.list[0].weather[0].description}</p>
        `;

      // Example: Log one forecast per day
      const daily = data.list.filter((_, index) => index % 8 === 0);
      daily.forEach((item, i) => {
        if (forecastDivs[i]) {
          // const date = new Date(item.dt_txt).toDateString();
         const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });

          const desc = item.weather[0].description;
          const temp = `${Math.round(item.main.temp)}°C`;
          const icon = item.weather[0].icon; // e.g. "10d"
          console.log(`📅 ${date} - 🌤️ ${desc}, 🌡️ ${temp}`);
          forecastDivs[i].innerHTML = `
          <p class= "date">${date}</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
          <p>${desc}</p>
          <p>${temp}</p>
        `;
        }
      });
    })
    .catch((error) => console.error("Error fetching forecast:", error));
}

function error(err) {
  console.error("❌ Geolocation error:", err.message);
}
