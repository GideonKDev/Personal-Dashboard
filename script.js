document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initWeather();
    initQuotes();
    initTodo();
});

// --- CLOCK & DATE WIDGET ---
function initClock() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');

    function updateTime() {
        const now = new Date();
        
        // Time format: HH:MM:SS
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;

        // Date format: Day, Month Date
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    updateTime();
    setInterval(updateTime, 1000); // Update every second
}

// --- WEATHER WIDGET ---
function initWeather() {
    const weatherContainer = document.getElementById('weather-content');

    // Default to Nairobi coordinates if geolocation fails
    const fallbackLat = -1.286389;
    const fallbackLon = 36.817223;

    function getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Drizzle',
            55: 'Heavy Drizzle', 56: 'Freezing Drizzle', 57: 'Heavy Freezing Drizzle',
            61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
            66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
            71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
            80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers',
            85: 'Light Snow Showers', 86: 'Snow Showers',
            95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Heavy Thunderstorm'
        };
        return descriptions[code] || 'Unknown';
    }

    function getWeatherIcon(code) {
        if (code === 0) return 'ph-sun';
        if (code === 1) return 'ph-sun';
        if (code === 2) return 'ph-cloud-sun';
        if (code === 3) return 'ph-cloud';
        if (code >= 45 && code <= 48) return 'ph-cloud-fog';
        if (code >= 51 && code <= 57) return 'ph-cloud-rain';
        if (code >= 61 && code <= 67) return 'ph-cloud-rain';
        if (code >= 71 && code <= 77) return 'ph-cloud-snow';
        if (code >= 80 && code <= 82) return 'ph-cloud-rain';
        if (code >= 85 && code <= 86) return 'ph-cloud-snow';
        if (code >= 95) return 'ph-cloud-lightning';
        return 'ph-cloud';
    }

    function fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&wind_speed_unit=kmh`;
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

        Promise.all([
            fetch(url).then(res => res.json()),
            fetch(geoUrl).then(res => res.json()).catch(() => ({}))
        ])
            .then(([weatherData, geoData]) => {
                const temp = weatherData.current.temperature_2m;
                const windSpeed = weatherData.current.wind_speed_10m;
                const humidity = weatherData.current.relative_humidity_2m;
                const weatherCode = weatherData.current.weather_code;
                const city = geoData.city || geoData.locality || "Unknown Location";
                const condition = getWeatherDescription(weatherCode);
                const icon = getWeatherIcon(weatherCode);
                
                weatherContainer.innerHTML = `
                    <div class="weather-top">
                        <div class="weather-city">
                            <span class="weather-city-name">${city}</span>
                            <span class="weather-city-desc">${condition}</span>
                        </div>
                        <i class="ph-fill ${icon}"></i>
                    </div>
                    <div class="weather-main fade-in">${Math.round(temp)}&deg;</div>
                    <div class="weather-bottom fade-in">
                        <div class="weather-stat">
                            <span class="weather-stat-label"><i class="ph ph-wind"></i> WIND</span>
                            <span class="weather-stat-val">${windSpeed} km/h</span>
                        </div>
                        <div class="weather-stat">
                            <span class="weather-stat-label"><i class="ph ph-drop-half-bottom"></i> HUMIDITY</span>
                            <span class="weather-stat-val">${humidity}%</span>
                        </div>
                    </div>
                `;
            })
            .catch(err => {
                console.error("Weather error:", err);
                weatherContainer.innerHTML = `<span style="color: var(--danger-color)">Failed to load weather.</span>`;
            });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
            (error) => {
                console.log("Geolocation denied or failed, using fallback.");
                fetchWeather(fallbackLat, fallbackLon);
            }
        );
    } else {
        fetchWeather(fallbackLat, fallbackLon);
    }
}

// --- QUOTE WIDGET ---
function initQuotes() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const refreshBtn = document.getElementById('refresh-quote');

    function fetchQuote() {
        if(refreshBtn) {
            refreshBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => refreshBtn.style.transform = 'rotate(0deg)', 300);
        }
        
        quoteText.textContent = "Loading inspiration...";
        quoteAuthor.textContent = "";
        
        fetch('https://dummyjson.com/quotes/random')
            .then(res => res.json())
            .then(data => {
                quoteText.classList.remove('fade-in');
                void quoteText.offsetWidth; // Trigger reflow for animation
                quoteText.classList.add('fade-in');
                
                quoteText.textContent = `"${data.quote}"`;
                quoteAuthor.textContent = `- ${data.author}`;
                
                // Persist last quote to local storage in case offline
                localStorage.setItem('savedQuote', JSON.stringify(data));
            })
            .catch(err => {
                console.error("Quote error:", err);
                const saved = localStorage.getItem('savedQuote');
                if (saved) {
                    const data = JSON.parse(saved);
                    quoteText.textContent = `"${data.quote}"`;
                    quoteAuthor.textContent = `- ${data.author} (Offline)`;
                } else {
                    quoteText.textContent = "Could not fetch quote.";
                }
            });
    }

    fetchQuote();

    if(refreshBtn) {
        refreshBtn.addEventListener('click', fetchQuote);
    }
}

// --- TO-DO WIDGET ---
function initTodo() {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    let tasks = JSON.parse(localStorage.getItem('dashboardTasks')) || [];

    function saveTasks() {
        localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        todoList.innerHTML = '';
        const countSpan = document.getElementById('task-count');
        if(countSpan) {
            const uncompletedCount = tasks.filter(t => !t.completed).length;
            countSpan.textContent = `${uncompletedCount} REMAINING`;
        }
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `todo-item fade-in ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <button class="check-btn" title="${task.completed ? 'Uncheck' : 'Complete'}">
                    <i class="ph ${task.completed ? 'ph-check-square' : 'ph-square'}"></i>
                </button>
                <span class="todo-text">${task.text}</span>
                ${task.completed ? '<span class="completed-tag">COMPLETED</span>' : '<span class="high-tag">HIGH</span>'}
                <button class="delete-btn" title="Delete">
                    <i class="ph ph-x"></i>
                </button>
            `;

            // Complete toggler
            li.querySelector('.check-btn').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });
            
            li.querySelector('.todo-text').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });

            // Delete task
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            todoList.appendChild(li);
        });
    }

    function addTask() {
        const text = todoInput.value.trim();
        if (text !== "") {
            tasks.push({ text: text, completed: false });
            saveTasks();
            renderTasks();
            todoInput.value = '';
        }
    }

    addBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Initial render
    renderTasks();
}
