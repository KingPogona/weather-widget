var searchTerm = document.getElementById('searchTerm').value;
var date0El = document.getElementById('date0');
var weatherData = "";



function getWeather(location) {

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
                'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly&appid=aa754955e12084ca219e14374971d05a'


            )
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.dir(response);

                    for (var i = 0; i < 5; i++) {
                        writeText(response, i)
                    }
                    // var responseContainerEl = document.querySelector('#response-container');
                    // responseContainerEl.innerHTML = '';
                    // var gifImg = document.createElement('img');
                    // gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
                    // responseContainerEl.appendChild(gifImg);

                })
        })
}


function writeText(source, day) {
    // valueType 
    // daily[0].temp
    // console.log(source);
    console.log(source.daily[day].temp.day);
    $('.temp').eq(day).text(source.daily[day].temp.day);
    $('.humidity').eq(day).text(source.daily[day].humidity);


    var temp = source.daily[day].temp.day

    temp = temp * (9/5) - 459.67
    temp = temp.toFixed(2);


    $('.temp').eq(day).text(temp);
}

getWeather('orem');
console.log(weatherData);

// console.log(date0El);
// date0El.textContent = "test";

