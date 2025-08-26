const apiKey = "5586e71a5f5ed4cb882750a620ea9f74"
const input = document.querySelector("input");
const btn = document.querySelector("button");
const notFound = document.querySelector(".error");
const weather = document.querySelector(".weather");
const intro = document.querySelector(".intro");
const cityText = document.querySelector(".city");
const dateText = document.querySelector(".date");
const weatherIcon = document.querySelector(".weatherImage");
const tempText = document.querySelector(".temp");
const cloudsStatus = document.querySelector(".clouds-status");
const humidityText = document.querySelector(".humidity");
const windSpeedText = document.querySelector(".speed");
const futureWeather=document.querySelector(".future-weather");
function getCurrentDate() {
    let currentDate = new Date();
    return currentDate.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });

}
function getWeatherIcon(id) {
    if (id <= 232) {
        return "assets/weather/thunderstorm.svg";
    }
    else if (id <= 321) {
        return "assets/weather/drizzle.svg"
    }
    else if (id <= 531) {
        return "assets/weather/rain.svg";
    }
    else if (id <= 622) {
        return "assets/weather/snow.svg";
    }
    else if (id <= 781) {
        return "assets/weather/atmosphere.svg";
    }
    else if (id == 800) {
        return "assets/weather/clear.svg";
    }
    else {
        return "assets/weather/clouds.svg";
    }
}
btn.addEventListener("click", (e) => {
    updateWeatherInfo(input.value);
    console.log(input.value);
    input.value = "";
    input.blur();
})
input.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        updateWeatherInfo(input.value);
        console.log(input.value);
        input.value = "";
        input.blur();
    }

})
async function getFetchData(endPoint, city) {
    let url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    return response.json();
}

async function updateWeatherInfo(city) {

    const weatherData = await getFetchData("weather", city);
    if (weatherData.cod != 200) {
        showDisplay(notFound);
        return;
    }
    showDisplay(weather);
    console.log(weatherData);
    const {
        name: country,
        wind: { speed },
        main: { humidity, temp },
        weather: [{ id, description }]
    } = weatherData
    cityText.textContent = country;
    tempText.textContent = Math.round(temp) + " °C";
    cloudsStatus.textContent = description;
    humidityText.textContent = humidity + "%";
    windSpeedText.textContent = speed + "M/s";
    weatherIcon.src = getWeatherIcon(id);
    dateText.textContent = getCurrentDate();
    updateForecastInfo(city);

}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData("forecast", city);
    console.log(forecastData);
    let timeTaken="12:00:00";
    let todayDate=new Date().toISOString().split("T")[0];
    console.log(todayDate);
    futureWeather.innerHTML="";
    forecastData.list.forEach((data) => { 
        if(data.dt_txt.includes(timeTaken) && !data.dt_txt.includes(todayDate)){
            updateForecastItems(data);
            console.log(data);
        }
    })
    
}

function updateForecastItems(data){
    const{
        main:{temp},
        weather:[{id}],
        dt_txt:date
    }=data
    const dateTaken=new Date(date);
    const options={
        day:"2-digit",
        month:"short"
    };
    const dateResult=dateTaken.toLocaleDateString("en-US",options);
    const weather=`
     <div class="items">
                     <p>${dateResult}</p>
                    <img  height="60" src=${getWeatherIcon(id)} alt="">
                    <p>${Math.round(temp)}°C</p>

                </div>
    `
    futureWeather.insertAdjacentHTML("beforeend",weather);
}

function showDisplay(section) {
    let arr = [notFound, weather, intro];
    arr.forEach((el) => {
        el.style.display = "none"
    });
    section.style.display = "block";
}