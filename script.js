const API_KEY = "d34ac75b7194e2b89c4600db2a1feb82"; 

document.getElementById("toggleMode").addEventListener("change", function () {
    const isCityMode = this.checked;
    document.getElementById("manualMode").style.display = isCityMode ? "none" : "block";
    document.getElementById("cityMode").style.display = isCityMode ? "block" : "none";

    document.getElementById("latitude").required = !isCityMode;
    document.getElementById("longitude").required = !isCityMode;
    document.getElementById("country").required = isCityMode;
    document.getElementById("city").required = isCityMode;
});

document.getElementById("locationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const isCityMode = document.getElementById("toggleMode").checked;

    if (isCityMode) {
        
        const city = document.getElementById("city").value.trim();
        const country = document.getElementById("country").value.trim();

        if (!city) {
            document.getElementById("result").innerText = "⚠ Please enter a valid city!";
            return;
        }

        const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${API_KEY}`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    document.getElementById("result").innerText = "⚠ Invalid city or country!";
                    return;
                }

                const lat = data[0].lat;
                const lon = data[0].lon;

                getAirPollutionData(lat, lon);
            })
            .catch(error => {
                console.error("Error fetching coordinates:", error);
                document.getElementById("result").innerText = "⚠ Failed to get location data!";
            });

    } else {
        
        const lat = document.getElementById("latitude").value.trim();
        const lon = document.getElementById("longitude").value.trim();

        if (!lat || !lon) {
            document.getElementById("result").innerText = "⚠ Please enter valid latitude and longitude!";
            return;
        }

        getAirPollutionData(lat, lon);
    }
});

function getAirPollutionData(lat, lon) {
    const pollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(pollutionUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.list || data.list.length === 0) {
                document.getElementById("result").innerText = "⚠ No pollution data available!";
                return;
            }

            const aqi = data.list[0].main.aqi;
            const components = data.list[0].components;

            const aqiLevels = ["Good 😊", "Fair 🙂", "Moderate 😐", "Poor 😟", "Very Poor 😷"];
            const aqiText = aqiLevels[aqi - 1] || "Unknown";

            document.getElementById("result").innerHTML = `
                <h3>🌍 Air Quality Index: <b>${aqiText}</b> (Level ${aqi})</h3>
                <p>🔬 <b>Pollutants:</b></p>
                <ul>
                    <li>CO (Carbon Monoxide): ${components.co} μg/m³</li>
                    <li>NO (Nitrogen Oxide): ${components.no} μg/m³</li>
                    <li>NO₂ (Nitrogen Dioxide): ${components.no2} μg/m³</li>
                    <li>O₃ (Ozone): ${components.o3} μg/m³</li>
                    <li>SO₂ (Sulfur Dioxide): ${components.so2} μg/m³</li>
                    <li>PM2.5 (Fine Particles): ${components.pm2_5} μg/m³</li>
                    <li>PM10 (Coarse Particles): ${components.pm10} μg/m³</li>
                    <li>NH₃ (Ammonia): ${components.nh3} μg/m³</li>
                </ul>
            `;
        })
        .catch(error => {
            console.error("Error fetching pollution data:", error);
            document.getElementById("result").innerText = "⚠ Failed to fetch pollution data!";
        });
}
