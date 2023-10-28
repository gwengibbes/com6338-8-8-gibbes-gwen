var weatherUrl = "https://api.openweathermap.org/data/2.5/weather"
//To convert temperature from kelvins to farenheit// 
var queryString = "?units=imperial&appid=d928ffc4aa1b3bdd98b858a5a8fc2883&";
var fetchURL = weatherUrl + queryString
var btn = document.querySelector('button')
var weatherEl = document.getElementById('weather');
var weatherSearchEl = document.getElementById('weather-search')

//Open Weather API using JavaScript Fetch API//
function getWeatherData(city) {
    return fetch(fetchURL + 'q=' + city)
        .then(function (response) {
            console.log('The response from the API is: ', response);
            return response.json().then(function (responseAsJson) {
                console.log('The response as JSON is: ', JSON.stringify(responseAsJson));
                return responseAsJson;
            })
        })
        .catch(function (error) {
            console.log('Failed to get a successful response from the API');
            return Promise.reject(error);
        })
}

function getGoogleMapsUrl(coords) {
    return 'https://www.google.com/maps/search/?api=1&query=' + coords.lat + ',' + coords.lon
}

function displayWeatherData(weatherData) {
    console.log('Displaying the provided weather data', weatherData);
    // Clear the elements from previous search
    weatherEl.textContent = '';

    // Add the City and country to the UI
    //Notify the user that a location is not found//
    var cityCountryEl = document.createElement('h2');
    if (!weatherData.name) {
        cityCountryEl.textContent = 'Location not found';
    } else {
        cityCountryEl.textContent = weatherData.name + ', ' + weatherData.sys.country;
    }
    weatherEl.appendChild(cityCountryEl);

    // Add the Google Maps link on screen
    var googleMapsLinkEl = document.createElement('a');
    googleMapsLinkEl.setAttribute('href', getGoogleMapsUrl(weatherData.coord));
    googleMapsLinkEl.setAttribute('target', '__BLANK');
    googleMapsLinkEl.textContent = 'Click to view map';
    weatherEl.appendChild(googleMapsLinkEl);

    //Add image on screen//
    var imageEl = document.createElement('img');
    imageEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');
    weatherEl.appendChild(imageEl);

    //Add condition on screen//
    var conditionEl = document.createElement('p');
    conditionEl.style.textTransform = 'capitalize';
    conditionEl.textContent = weatherData.weather[0].description;
    weatherEl.appendChild(conditionEl);

    //Add current temperature on screen//
    var currentTempEl = document.createElement('p')
    currentTempEl.textContent = 'Current: ' + weatherData.main.temp + '° F';
    weatherEl.appendChild(currentTempEl);

    //Add feels like on screen//
    var feelsLikeEl = document.createElement('p')
    feelsLikeEl.textContent = 'Feels Like: ' + weatherData.main.feels_like + '° F';
    weatherEl.appendChild(feelsLikeEl);

    //Last Updated Time//
    var date = new Date(weatherData.dt * 1000);
    var timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
    var lastUpdatedEl = document.createElement('p')
    lastUpdatedEl.textContent = 'Last updated:' + timeString;
    weatherEl.appendChild(lastUpdatedEl);
}


function load() {
    //Access the form//
    var formEl = document.querySelector('#weather-app form');
    //When the form is submitted, only the input field and search button should be visible // 
    formEl.onsubmit = function (eventProperties) {
        eventProperties.preventDefault()
        console.log('submitted', eventProperties)

        var enteredCity = weatherSearchEl.value.trim();
        if (enteredCity == '') {
            return;
        }
        weatherSearchEl.value = '';
        // Clear the inputted value after the search
        console.log('The user city entered is:', enteredCity);
        getWeatherData(enteredCity).then(function (weatherData) {
            console.log('The weather data for the city ' + enteredCity, weatherData)
            displayWeatherData(weatherData);
        }).catch(function(error){
            var cityCountryEl = document.createElement('h2');
            cityCountryEl.textContent = 'Please try again later';
            weatherEl.appendChild(cityCountryEl);
        });
    }
}
load();

