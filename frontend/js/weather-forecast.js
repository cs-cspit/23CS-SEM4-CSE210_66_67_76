document.addEventListener('DOMContentLoaded', function() {
    // Initialize date inputs with today's date and a week from today
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    document.getElementById('startDate').valueAsDate = today;
    document.getElementById('endDate').valueAsDate = nextWeek;
    
    // Add event listener to the Get Weather button
    document.getElementById('getWeatherBtn').addEventListener('click', getWeatherForecast);
});

// Main function to get weather forecast
async function getWeatherForecast() {
    // Get input values
    const destination = document.getElementById('destination').value.trim();
    const country = document.getElementById('country').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Validate inputs
    if (!destination || !country || !startDate || !endDate) {
        showError('Please fill in all fields');
        return;
    }
    
    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (endDateObj < startDateObj) {
        showError('End date cannot be before start date');
        return;
    }
    
    // Calculate date difference (in days)
    const dateDiff = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    
    // Limit forecast to 16 days (API limitation)
    if (dateDiff > 16) {
        showError('Weather forecast is limited to 16 days');
        return;
    }
    
    // Show loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('weatherResults').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    
    try {
        // Step 1: Get coordinates for the destination
        const coordinates = await getCoordinates(destination, country);
        
        if (!coordinates) {
            showError('Could not find coordinates for the specified location');
            document.getElementById('loadingIndicator').style.display = 'none';
            return;
        }
        
        // Step 2: Get weather forecast using coordinates
        const weatherData = await getWeatherData(coordinates.latitude, coordinates.longitude, startDate, endDate);
        
        if (!weatherData) {
            showError('Could not retrieve weather data');
            document.getElementById('loadingIndicator').style.display = 'none';
            return;
        }
        
        // Step 3: Display the weather forecast
        displayWeatherForecast(weatherData, destination, country, startDate, endDate);
        
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while fetching weather data');
    } finally {
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}

// Function to get coordinates (latitude and longitude) for a location
async function getCoordinates(city, country) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }
        
        // Filter by country if provided
        let result = data.results[0];
        if (country) {
            const countryMatch = data.results.find(r => 
                r.country && r.country.toLowerCase() === country.toLowerCase()
            );
            if (countryMatch) {
                result = countryMatch;
            }
        }
        
        return {
            latitude: result.latitude,
            longitude: result.longitude,
            name: result.name,
            country: result.country
        };
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

// Function to get weather forecast data
async function getWeatherData(latitude, longitude, startDate, endDate) {
    try {
        // Format dates for API
        const formattedStartDate = startDate;
        const formattedEndDate = endDate;
        
        // Build API URL with all required parameters
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_hours,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&timezone=auto&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
        
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Error getting weather data:', error);
        return null;
    }
}

// Function to display weather forecast
function displayWeatherForecast(weatherData, city, country, startDate, endDate) {
    // Update destination info
    document.getElementById('locationName').textContent = `${city}, ${country}`;
    
    // Format dates for display
    const formattedStartDate = formatDate(new Date(startDate));
    const formattedEndDate = formatDate(new Date(endDate));
    document.getElementById('travelDates').textContent = `Travel Dates: ${formattedStartDate} - ${formattedEndDate}`;
    
    // Clear previous forecast cards
    const forecastCardsContainer = document.getElementById('forecastCards');
    forecastCardsContainer.innerHTML = '';
    
    // Create forecast cards for each day
    const days = weatherData.daily.time;
    
    days.forEach((day, index) => {
        const weatherCode = weatherData.daily.weathercode[index];
        const maxTemp = weatherData.daily.temperature_2m_max[index];
        const minTemp = weatherData.daily.temperature_2m_min[index];
        const windSpeed = weatherData.daily.windspeed_10m_max[index];
        const windGusts = weatherData.daily.windgusts_10m_max[index];
        const windDirection = weatherData.daily.winddirection_10m_dominant[index];
        const precipitation = weatherData.daily.precipitation_sum[index];
        const precipitationHours = weatherData.daily.precipitation_hours[index];
        const sunrise = weatherData.daily.sunrise[index].split('T')[1];
        const sunset = weatherData.daily.sunset[index].split('T')[1];
        
        // Create forecast card
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        // Get weather icon and condition text
        const { icon, condition } = getWeatherIconAndCondition(weatherCode);
        
        card.innerHTML = `
            <div class="forecast-date">${formatDate(new Date(day))}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-details">
                <div class="forecast-temp">${Math.round(maxTemp)}°C / ${Math.round(minTemp)}°C</div>
                <div class="forecast-condition">${condition}</div>
                <div class="forecast-item">
                    <span class="forecast-label">Wind</span>
                    <span class="forecast-value">${windSpeed} km/h</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Gusts</span>
                    <span class="forecast-value">${windGusts} km/h</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Precipitation</span>
                    <span class="forecast-value">${precipitation} mm</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Rain Hours</span>
                    <span class="forecast-value">${precipitationHours} h</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Sunrise</span>
                    <span class="forecast-value">${sunrise}</span>
                </div>
                <div class="forecast-item">
                    <span class="forecast-label">Sunset</span>
                    <span class="forecast-value">${sunset}</span>
                </div>
            </div>
        `;
        
        forecastCardsContainer.appendChild(card);
    });
    
    // Show results
    document.getElementById('weatherResults').style.display = 'block';
}

// Function to get weather icon and condition based on WMO weather code
function getWeatherIconAndCondition(code) {
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    switch (true) {
        case code === 0:
            return { icon: '☀️', condition: 'Clear sky' };
        case code === 1:
            return { icon: '🌤️', condition: 'Mainly clear' };
        case code === 2:
            return { icon: '⛅', condition: 'Partly cloudy' };
        case code === 3:
            return { icon: '☁️', condition: 'Overcast' };
        case code === 45 || code === 48:
            return { icon: '🌫️', condition: 'Fog' };
        case code >= 51 && code <= 55:
            return { icon: '🌦️', condition: 'Drizzle' };
        case code >= 56 && code <= 57:
            return { icon: '🌧️', condition: 'Freezing Drizzle' };
        case code >= 61 && code <= 65:
            return { icon: '🌧️', condition: 'Rain' };
        case code >= 66 && code <= 67:
            return { icon: '🌨️', condition: 'Freezing Rain' };
        case code >= 71 && code <= 77:
            return { icon: '❄️', condition: 'Snow' };
        case code >= 80 && code <= 82:
            return { icon: '🌦️', condition: 'Rain Showers' };
        case code >= 85 && code <= 86:
            return { icon: '🌨️', condition: 'Snow Showers' };
        case code >= 95 && code <= 99:
            return { icon: '⛈️', condition: 'Thunderstorm' };
        default:
            return { icon: '❓', condition: 'Unknown' };
    }
}

// Helper function to format date
function formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to show error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorElement.style.display = 'block';
} 