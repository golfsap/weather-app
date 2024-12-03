import "./style.css";
import { getWeatherData, extractWeatherData } from "./weather.js";

const locationField = document.getElementById("location-search");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");

async function searchWeatherData() {
  // e.preventDefault();
  if (!locationField.value) {
    alert("Please enter a location.");
    return;
  }
  const location = locationField.value;

  try {
    const currentUnit = document.querySelector(
      'input[name="unit"]:checked'
    ).value;
    // Fetch and process weather data
    const weatherData = await getWeatherData(location, currentUnit);
    const extractedData = extractWeatherData(weatherData);

    // Display
    console.log(extractedData);
    populateWeatherTemplate(extractedData);
    weatherInfo.style.display = "block";
  } catch (err) {
    console.error("Error occured while fetching weather data:", err);
    alert(
      "An error occurred while fetching the weather data, Please try again later."
    );
  }
}

function populateWeatherTemplate(data) {
  // Fill in the resolved address (location name)
  document.getElementById("address").textContent = data.address;
  document.getElementById("resolved-address").innerText =
    `Weather in ${data.resolvedAddress}`;

  // Fill in current weather information
  const currentUnit = document.querySelector('input[name="unit"]:checked');
  const unitSymbol = currentUnit.value === "metric" ? "°C" : "°F";

  document.getElementById("temperature").innerText =
    `Temperature: ${data.currentWeather.temperature}${unitSymbol}`;
  document.getElementById("feels-like").innerText =
    `Feels like: ${data.currentWeather.feelsLike}${unitSymbol}`;
  document.getElementById("humidity").innerText =
    `Humidity: ${data.currentWeather.humidity}%`;
  document.getElementById("uv-index").innerText =
    `UV Index: ${data.currentWeather.uvIndex}`;

  // Fill in the forecast data
  if (data.forecast.length > 0) {
    const formattedDate = formatDate(data.forecast[0].date);

    document.getElementById("forecast-date").innerText = formattedDate;
    document.getElementById("temp-max").innerText =
      `Max Temp: ${data.forecast[0].tempMax}${unitSymbol}`;
    document.getElementById("temp-min").innerText =
      `Min Temp: ${data.forecast[0].tempMin}${unitSymbol}`;
    document.getElementById("precip").innerText =
      `Precipitation: ${data.forecast[0].precip} mm`;
  }
}

// function handleToggleUnits() {
//   const city = locationField.value.trim();
//   if (city) {
//     searchWeatherData();
//   }
// }

function formatDate(date) {
  const day = date.slice(-2);
  const month = date.slice(5, 7);
  const year = date.slice(0, 4);
  return `${day}-${month}-${year}`;
}

// Event listener
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchWeatherData();
});

const radios = document.getElementsByName("unit");
radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    searchWeatherData();
  });
});
