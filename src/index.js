import "./style.css";

async function getWeatherData(location) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=QA8P2CDQXTT568P3L96RWQAPJ&contentType=json`;

  const response = await fetch(url, { mode: "cors" });
  const weatherData = await response.json();
  //   console.log(weatherData);
  return weatherData;
}

function extractWeatherData(rawData) {
  // destructure and extract data
  const { resolvedAddress, currentConditions, days } = rawData;

  const result = {
    resolvedAddress: resolvedAddress,
    currentWeather: {
      temperature: currentConditions.temp,
      feelsLike: currentConditions.feelslike,
      humidity: currentConditions.humidity,
      // precip: currentConditions.precip,
      uvIndex: currentConditions.uvindex,
    },
    forecast: [],
  };

  // Loop through days array to get forecast for the next day
  if (days && days.length > 0) {
    const nextDayForecast = days[0];

    result.forecast.push({
      date: nextDayForecast.datetime,
      tempMax: nextDayForecast.tempmax,
      tempMin: nextDayForecast.tempmin,
      precip: nextDayForecast.precip,
    });
  }
  console.log(result);
  return result;
}

// make a function to handle error
function handleError(fn) {
  return function (...params) {
    return fn(...params).catch(function (err) {
      // do something with the error!
      console.error("Oops!", err);
    });
  };
}

// Wrap in a HOC (higher-order function)
const safeGetWeatherData = handleError(getWeatherData);

// Using async function to await the result
async function getAndExtractWeatherData(location) {
  const rawData = await safeGetWeatherData(location);
  return extractWeatherData(rawData);
}

getAndExtractWeatherData("bangkok");
// console.log(cleanWeatherData);
