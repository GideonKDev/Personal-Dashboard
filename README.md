# Personal Dashboard – Group 3

A premium personal dashboard built with HTML, CSS, and JavaScript for the **Introduction to Web Design and Programming** Take-Away CAT (Year 2, Semester 2).

## Features

- **Real-Time Clock** – Displays the current time (HH:MM:SS) and date, updating every second.
- **Weather Widget** – Fetches live weather data using the [Open-Meteo API](https://open-meteo.com/) including temperature, wind speed, humidity, and a dynamic weather condition description with matching icon. Uses browser geolocation with a Nairobi fallback.
- **Random Quote Generator** – Fetches inspirational quotes from [DummyJSON](https://dummyjson.com/quotes). Includes a manual refresh button and offline fallback via `localStorage`.
- **Persistent To-Do List** – Add, complete, and delete tasks. All data is saved to `localStorage` and persists after page refresh.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | Vanilla CSS (custom properties, flexbox, media queries) |
| Logic | Vanilla JavaScript (Fetch API, localStorage, Geolocation API) |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Icons | [Phosphor Icons](https://phosphoricons.com/) via CDN |

## APIs Used

- **Open-Meteo** – Free weather API (no key required)
- **BigDataCloud** – Reverse geocoding for city name from coordinates
- **DummyJSON** – Random quote generation

## File Structure

```
Grp3 Personal Dashboard/
├── index.html    # Main HTML structure
├── style.css     # All styling and responsive design
├── script.js     # Clock, weather, quotes, and to-do logic
└── README.md     # This file
```

## How to Run

1. Open `index.html` in any modern browser.
2. Allow location access when prompted (for accurate weather data).
3. That's it — no build tools or servers needed.

## Responsive Design

The dashboard uses a two-column layout on desktop (≥768px) and stacks vertically on mobile devices, scaling fonts and padding to fit smaller screens.

## Group 3 Members

| Name | Role |
|------|------|
| Members | Web Design & Development |
| Kirui Gideon | Cyber Security |

## License

This project was created for academic purposes as part of a university assignment.
