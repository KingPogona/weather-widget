
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



//           **********Start of Functions**********
// if the history is greater than 7 items it slices the array down to 7
// it will only display up to 7 items on the page at a time
function capHistory() {
    if (searchHistory.length >= 7) {
        searchHistory = searchHistory.slice(0, 7);
    }

    $('.historyItem').slice(6).remove();
}

// gets the current date and returns it with on offset
function getDate(offset) {

    var a = moment(currentTime).add(offset, 'd')
    var formattedTime = moment(a).format('MM/DD/YYYY');

    return formattedTime
}

// displays weather info on the page
function write5DayText(source, day) {

    var date = getDate(day);
    var weather = source.daily[day].weather[0].main;
    var temp = source.daily[day].temp.day;
    var humidity = source.daily[day].humidity;

    weather = weather.toLowerCase();

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

// takes the search term and requests the cordinates for it
// it then takes that and requests the weather for the next week
// it then calls the write5DayText function to display the data
function getWeather(location) {

    // console.log("getweather: " + location);

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


//     -----Local Storage Functions-----
function loadContent() {
    loadedSearchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));

    if (!loadedSearchHistory) {
        return
    };

    searchHistory = loadedSearchHistory;

    capHistory();

    // console.log(searchHistory);

    for (var i = searchHistory.length - 1; i > -1; i--) {
        displayHistory(searchHistory[i])
    }

    searchInputEl.value = searchHistory[0];
    // console.log("loadContent: " + searchHistory[0]);
    getWeather(searchHistory[0]);
};
// run load content
loadContent();

// saves to local storage
function saveContent() {
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
};


//      -----Search History Functions-----
// adds the search term to the history and runs saveContent
function addToHistory(searchTerm) {
    
    searchHistory.unshift(searchTerm);

    capHistory();

    // console.log(searchHistory);

    saveContent();
}

// adds the element to the page for the provided search term
function displayHistory(searchTerm) {
    var listItemEl = document.createElement("li");

    listItemEl.className = "list-group-item historyItem";
    listItemEl.textContent = searchTerm;

    searchListEl.prepend(listItemEl);
}


//      -----Input Handlers-----
// handles clicking on a history item
function historyClickHandler(event) {
    event.preventDefault();

    // var searchTerm = searchInputEl.value.trim();

    getWeather(searchTerm);
}

// handles clicking the search button or hitting return
function formSubmitHandler(event) {
    event.preventDefault();

    var searchTerm = searchInputEl.value.trim();

    addToHistory(searchTerm);
    displayHistory(searchTerm);
    getWeather(searchTerm);
}




//           **********Event Listeners**********

userFormEl.addEventListener("submit", formSubmitHandler);

$("#searchList").on("click", ".historyItem", function () {
    let text = $(this).text().trim();


    searchInputEl.value = text;
    // console.log("history click: " + text);
    getWeather(text);

});