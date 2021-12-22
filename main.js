const cityNameEl = document.querySelector(".city-name");
const cityTempEl = document.querySelector(".temp");
const weatherIconEl = document.querySelector(".icon");

const windEl = document.querySelector(".wind");
const skyEl = document.querySelector(".sky");
const feelsLikeEl = document.querySelector(".feels-like");

const citySearchEl = document.querySelector("input");
const searchBtnEl = document.querySelector("button");
const weatherStatsEl = document.querySelector("#statistics");
const prayerEl = document.querySelector("#prayer");

const bgContainer = document.querySelector(".bg-image-container");

searchBtnEl.addEventListener('click', () => {
    let cityName = citySearchEl.value;
    reset();
    if (cityName) {
        fetchWeatherPrayer(cityName);
    }
})

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let cityName = citySearchEl.value;
        reset();
        if (cityName) {
            fetchWeatherPrayer(cityName);
        }
    }
})

async function fetchWeatherPrayer(city) {
    try {
        let req = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c5a26cad9228e2350414709036207c06`);
        let data = await req.json();

        let reqPrayer = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=United Arab Emirates&method=0`);
        let dataPrayer = await reqPrayer.json();

        if (city.includes(" ")) {
            let HttpCopmatCityName = city.split(" ").join("+");
            bgContainer.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${HttpCopmatCityName}*)`;
        } else {
            bgContainer.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${city}*)`;
        }

        addDataToDOM(data, dataPrayer);
    } catch (e) {
        console.log(e)
    }
}

function addDataToDOM(data, dataPrayer) {
    if (data.cod === "404") return console.log('404 Weather');
    if (dataPrayer.code === "404") return console.log('404 Prayer');

    // Display Weather Statistics Wrapper
    weatherStatsEl.classList.add('opac');

    cityNameEl.innerText = data.name;

    // Displaying Temperature
    let temp = data.main.temp;
    temp = Math.round(temp - 273.15);
    cityTempEl.innerText = `${temp}°C`;

    // Displaying Weather Icon
    let iconcode = data.weather[0].icon;
    let iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
    weatherIconEl.src = iconurl;

    // Displaying Wind
    let wind = data.wind.speed;
    // Adjust Float Precision
    wind = (wind * 60 * 60 / 1000).toFixed(2);
    windEl.innerText = `Wind Speed ${wind} km/h`;

    // Displaying Description
    let desc = data.weather[0].description;
    skyEl.innerText = desc;

    // Displaying Feels Like
    let temp2 = data.main.feels_like;
    temp2 = Math.round(temp2 - 273.15);
    feelsLikeEl.innerText = `Feels Like ${temp2}°C`;

    // Displaying Prayer Times
    let prayerTimes = dataPrayer.data.timings;
    for (namaz in prayerTimes) {

        if ((namaz != "Sunrise") && (namaz != "Imsak") && (namaz != "Midnight") && (namaz != "Sunset")) {
            prayerEl.querySelector('.prayer-detail').innerText += `${namaz}: ${prayerTimes[namaz]},\xa0`;
        }
        prayerEl.classList.add('opac2');
    }
}
function reset() {
    bgContainer.style.backgroundImage = "url(images/bg-img.jpg)";
    citySearchEl.value = '';
    weatherStatsEl.classList.remove('opac');
    cityTempEl.innerText = '';
    weatherIconEl.src = '';
    windEl.innerText = '';
    skyEl.innerText = '';
    feelsLikeEl.innerText = '';
    prayerEl.querySelector('.prayer-detail').innerText = '';
    prayerEl.classList.remove('opac2');
    citySearchEl.value = '';
}
