// Function to initialize weather forecast on booking confirmation page
function initBookingWeatherForecast(destination, country, startDate, endDate) {
    // Create weather forecast container
    const weatherContainer = document.createElement('div');
    weatherContainer.className = 'booking-weather-container';
    weatherContainer.innerHTML = `
        <h3>Weather Forecast for Your Trip</h3>
        <p>Here's the weather forecast for your upcoming trip to ${destination}, ${country}.</p>
        <div class="loading-weather">
            <i class="fas fa-spinner"></i>
            <p>Loading weather forecast...</p>
        </div>
        <div class="weather-forecast-cards"></div>
    `;
    
    // Add container to the page
    document.querySelector('.booking-confirmation').appendChild(weatherContainer);
    
    // Fetch weather data
    fetchWeatherForBooking(destination, country, startDate, endDate);
}

// Function to fetch weather data for booking
async function fetchWeatherForBooking(destination, country, startDate, endDate) {
    try {
        // Get coordinates
        const coordinates = await getCoordinates(destination, country);
        
        if (!coordinates) {
            showWeatherError('Could not find location coordinates');
            return;
        }
        
        // Get weather data
        const weatherData = await getWeatherData(
            coordinates.latitude, 
            coordinates.longitude, 
            startDate, 
            endDate
        );
        
        if (!weatherData) {
            showWeatherError('Could not retrieve weather data');
            return;
        }
        
        // Display weather data
        displayBookingWeather(weatherData);
        
    } catch (error) {
        console.error('Error fetching booking weather:', error);
        showWeatherError('An error occurred while fetching weather data');
    }
}

// Function to display weather on booking confirmation
function displayBookingWeather(weatherData) {
    // Hide loading indicator
    document.querySelector('.loading-weather').style.display = 'none';
    
    // Get container for weather cards
    const weatherCardsContainer = document.querySelector('.weather-forecast-cards');
    
    // Create forecast cards for each day (limit to 5 days)
    const days = weatherData.daily.time.slice(0, 5);
    
    days.forEach((day, index) => {
        const weatherCode = weatherData.daily.weathercode[index];
        const maxTemp = weatherData.daily.temperature_2m_max[index];
        const minTemp = weatherData.daily.temperature_2m_min[index];
        const precipitation = weatherData.daily.precipitation_sum[index];
        const windSpeed = weatherData.daily.windspeed_10m_max[index];
        
        // Get weather icon and condition
        const { icon, condition } = getWeatherIconAndCondition(weatherCode);
        
        // Create card element
        const card = document.createElement('div');
        card.className = 'booking-weather-card';
        card.innerHTML = `
            <div class="weather-date">${formatDate(new Date(day))}</div>
            <div class="weather-icon">${icon}</div>
            <div class="weather-condition">${condition}</div>
            <div class="weather-temp">${Math.round(maxTemp)}°C / ${Math.round(minTemp)}°C</div>
            <div class="weather-details">
                <div><i class="fas fa-wind"></i> ${windSpeed} km/h</div>
                <div><i class="fas fa-tint"></i> ${precipitation} mm</div>
            </div>
        `;
        
        weatherCardsContainer.appendChild(card);
    });
}

// Function to show weather error
function showWeatherError(message) {
    document.querySelector('.loading-weather').style.display = 'none';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'weather-error';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
        <p>You can check the weather forecast later in the Weather section.</p>
    `;
    
    document.querySelector('.weather-forecast-cards').appendChild(errorElement);
} 