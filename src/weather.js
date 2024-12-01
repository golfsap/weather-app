// Fetch weather data from the API
export async function getWeatherData(location) {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=QA8P2CDQXTT568P3L96RWQAPJ&contentType=json`;

  try {
    const response = await fetch(url, { mode: "cors" });

    // Check if the response is successful (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error; // Propagate the error to be caught in the caller function
  }
}

// Function to process and extract relevant weather data
export function extractWeatherData(rawData) {
  const { address, resolvedAddress, currentConditions, days } = rawData;

  const result = {
    address: address,
    resolvedAddress: resolvedAddress,
    currentWeather: {
      temperature: currentConditions.temp,
      feelsLike: currentConditions.feelslike,
      humidity: currentConditions.humidity,
      uvIndex: currentConditions.uvindex,
    },
    forecast: [],
  };

  if (days && days.length > 0) {
    const nextDayForecast = days[0];
    result.forecast.push({
      date: nextDayForecast.datetime,
      tempMax: nextDayForecast.tempmax,
      tempMin: nextDayForecast.tempmin,
      precip: nextDayForecast.precip,
    });
  }

  return result;
}
