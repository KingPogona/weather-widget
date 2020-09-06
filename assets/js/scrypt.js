
var searchHistory = [];

var userFormEl = document.getElementById("user-form");
var searchInputEl = document.getElementById('searchTerm');
var searchListEl = document.getElementById('searchList');

var weatherIcon = {
    thunderstorm: "⛈",
    drizzle: "🌦",
    rain: "🌧",
    snow: "❄️",
    clear: "☀️",
    clouds: "☁️",
    mist: "🌫",
    smoke: "🌫",
    haze: "🌫",
    dust: "🌫",
    fog: "🌁",
    sand: "🌫",
    ash: "🌫",
    squall: "💨",
    tornado: "🌪"
};

var currentTime = moment();


function formSubmitHandler(event) {
    event.preventDefault();

    var searchTerm = searchInputEl.value.trim();

    getWeather(searchTerm);
}


function getWeather(location) {

    console.log("getweather: " + location);

    fetch(
        'http://www.mapquestapi.com/geocoding/v1/address?key=GAKZihaP7YzWQWAiaS5mAthRcK7FX8fF&location=' + location


    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // console.dir(response);

            var lat = response.results[0].locations[0].latLng.lat
            var lon = response.results[0].locations[0].latLng.lng
            // console.log(lat + ' and ' + lon);

            return fetch(
                'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude=minutely,hourly&appid=aa754955e12084ca219e14374971d05a'


            )
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    // console.dir(response);

                    for (var i = 0; i < 6; i++) {
                        write5DayText(response, i)
                    }
                })
        })
}
function getDate(offset) {

    var a = moment(currentTime).add(offset, 'd')
    var formattedTime = moment(a).format('MM/DD/YYYY');

    return formattedTime
}

function write5DayText(source, day) {
    // valueType 
    // daily[0].temp
    // console.log(source);
    // console.log(source.daily[day].temp.day);
    // $('.temp').eq(day).text(source.daily[day].temp.day);
    // $('.humidity').eq(day).text(source.daily[day].humidity);

    var date = getDate(day);
    var weather = source.daily[day].weather[0].main;
    var temp = source.daily[day].temp.day;
    var humidity = source.daily[day].humidity;

    weather = weather.toLowerCase();


    // temp = temp * 9 / 5 - 459.67;
    // temp = temp.toFixed(2);

    // console.log(weather);

    if (day == 0) {

        var locName = searchInputEl.value.trim();
        var windSpeed = source.daily[day].wind_speed;
        var UVI = source.daily[day].uvi;

        // console.log(locName);

        locName = locName.toUpperCase();

        $('#locDate').text(locName + " (" + date + ") " + weatherIcon[weather]);
        $('#temp').text("Temp: " + temp + " ℉");
        $('#humidity').text("Humidity: " + humidity + "%");
        $('#windSpeed').text("Wind Speed: " + windSpeed + " MPH");
        $('#UV').text("UV Index: " + UVI);
    }
    else {
        $('.date').eq(day - 1).text(date);
        $('.weather').eq(day - 1).text(weatherIcon[weather]);
        $('.temp').eq(day - 1).text("Temp: " + temp + " ℉");
        $('.humidity').eq(day - 1).text("Humidity: " + humidity + "%");
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

// getWeather(searchTerm);


// console.log(date0El);
// date0El.textContent = "test";

