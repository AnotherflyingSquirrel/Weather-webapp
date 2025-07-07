document.addEventListener("DOMContentLoaded", () => {
  const cityInputField = document.querySelector("#city-input");
  const getWeatherButton = document.querySelector("#get-weather-btn");
  const weatherDataDiv = document.querySelector("#weather-info");
  const cityNameDisplayTextbox = document.querySelector("#city-name");
  const temperatureDisplayTextbox = document.querySelector("#temperature");
  const descriptionDisplayTextbox = document.querySelector("#description");
  const errorMessageDisplay = document.querySelector("#error-message");
  const weatherConditionPng = document.querySelector("#weather-condition");
  let unsuccessfulFetch = "false";

  const WEATHER_API_KEY = process.env.API_KEY || "";

  getWeatherButton.addEventListener("click", async () => {
    const cityName = cityInputField.value.trim();
    if (!cityName) {
      weatherDataDiv.classList.toggle("hidden", unsuccessfulFetch);
      errorMessageDisplay.classList.remove("hidden");

      return;
    }
    try {
      const weatherData = await fetchWeatherData(cityName);
      renderWeatherInfo(weatherData);
    } catch (e) {
      //   .then((weatherData) => {})
      //   .catch((e) => {
      weatherDataDiv.classList.add("hidden");
      console.error(e);
      errorMessageDisplay.classList.remove("hidden");
      // toggleError(false);
    }
  });

  function fetchWeatherData(cityName) {
    return new Promise(async (resolve) => {
      const URL = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${cityName}&aqi=no`;
      const data = await fetch(URL);
      // console.log(data);
      if (!data.ok) {
        unsuccessfulFetch = true;
        errorMessageDisplay.classList.remove("hidden");
        // errorMessageDisplay.innerHTML = "";
        weatherDataDiv.classList.add("hidden");
        throw new Error("Invalid response received from server");
      }
      const dataJson = await data.json();
      console.log(dataJson);
      // console.log(data);
      unsuccessfulFetch = false;
      resolve(dataJson);

      //resolves into weather data and rejects into null
    });
  }

  function renderWeatherInfo(weatherData) {
    errorMessageDisplay.classList.add("hidden");
    cityNameDisplayTextbox.innerHTML = `${weatherData["location"]["name"]}`;
    descriptionDisplayTextbox.innerHTML = `Temperature: ${weatherData["current"]["temp_c"]}&deg;C`;
    temperatureDisplayTextbox.innerHTML = `${weatherData["current"]["condition"]["text"]}`;
    weatherConditionPng.src = weatherData["current"]["condition"]["icon"];
    weatherDataDiv.classList.remove("hidden");
  }

  function toggleError(bool) {
    errorMessageDisplay.classList.toggle("hidden", bool);
  }
});
