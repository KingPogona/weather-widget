
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




function loadContent() {
    loadedSearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));

    if (!loadedSearchHistory) {
        return
    };

    searchHistory = loadedSearchHistory;

    console.log(searchHistory);

    for (var i = searchHistory.length - 1; i > -1; i--) {
        displayHistory(searchHistory[i])
    }

    searchInputEl.value = searchHistory[0];
    console.log("loadContent: " + searchHistory[0]);
    getWeather(searchHistory[0]);
};
// run load content
loadContent();

// saves to local storage
function saveContent() {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
};


function addToHistory(searchTerm) {
    searchHistory.unshift(searchTerm);
    
    console.log(searchHistory);

    saveContent();
}


function displayHistory(searchTerm) {
    var listItemEl = document.createElement("li");

    listItemEl.className = "list-group-item historyItem";
    listItemEl.textContent = searchTerm;

    searchListEl.prepend(listItemEl);
}

function historyClickHandler(event) {
    event.preventDefault();

    // var searchTerm = searchInputEl.value.trim();

    getWeather(searchTerm);
}


function formSubmitHandler(event) {
    event.preventDefault();

    var searchTerm = searchInputEl.value.trim();

    addToHistory(searchTerm);
    displayHistory(searchTerm);
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
        $('#temp').text(temp + " ℉");
        $('#humidity').text(humidity + "%");
        $('#windSpeed').text(windSpeed + " MPH");
        $('#UV').text(UVI);

        if (UVI < 3) {
            $('#UV').addClass("bg-success");
        }
        else if (UVI >= 3 && UVI < 6) {
            $('#UV').addClass("bg-warning");
        }
        else {
            $('#UV').addClass("bg-danger");
        }
    }
    else {
        $('.date').eq(day - 1).text(date);
        $('.weather').eq(day - 1).text(weatherIcon[weather]);
        $('.temp').eq(day - 1).text(temp + " ℉");
        $('.humidity').eq(day - 1).text(humidity + "%");
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);

$("#searchList").on("click", ".historyItem", function () {
    let text = $(this).text().trim();

    
    searchInputEl.value = text;
    console.log("history click: " + text);
    getWeather(text);

});
// getWeather(searchTerm);


// console.log(date0El);
// date0El.textContent = "test";

