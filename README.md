# 🌀 Artemos — Space Dashboard

> A real-time space weather dashboard tracking solar activity, geomagnetic conditions, and satellites in orbit.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-vanilla%20JS-yellow)
![APIs](https://img.shields.io/badge/data-NOAA%20%2F%20SWPC-blue)

---

## ✨ Features

### ☀️ Live Solar & Space Weather Monitoring
Six real-time metric cards pulled from NOAA SWPC APIs, each with a live sparkline chart and animated status indicators:

| Metric | Source | Description |
|---|---|---|
| **Solar X-Ray Flux** | GOES Primary | Current flare class (A → X) with flux value |
| **Geomagnetic Activity** | NOAA Kp Index | Planetary Kp index, storm level classification |
| **Solar Wind Speed** | SWPC Plasma Feed | Charged particle speed in km/s |
| **Sunspot Count** | Computed / SSN | Daily sunspot number estimate |
| **Solar Radiation** | Derived from flux | Proton event scale (NORMAL → S5) |
| **Aurora Probability** | Kp-derived | Estimated northern lights visibility % |

All values run through a **live simulation loop** (1.5s interval) that applies small random walks to keep readings feeling continuous between API refreshes.

---

### 🛰️ Satellite Tracker

A full real-time orbital tracker built on the SGP4 propagation model:

- **World map** rendered on Canvas with GeoJSON coastlines
- **25 satellites** including ISS, Hubble, Tiangong, Starlink, GPS, GOES, and more
- **Filter** by category: Space Stations, Weather, Navigation, Communication
- **Click any satellite** to see live altitude, velocity, and coordinates
- **Orbit path** computed and rendered for the selected satellite
- **Telemetry feed panel** with a rotating 3D wireframe and live readouts
- Keyboard navigation with `←` / `→` arrow keys between satellites

---

### 📰 Space News Feed

Pulls the latest articles from the **Spaceflight News API** with randomized offsets so refreshes surface different stories. Includes source, publication date, and direct article links.

---

### 🌌 Hero Visualization

A custom black hole simulation drawn entirely in Canvas 2D:

- 300 particles in elliptical orbits with depth sorting (front/back pass separation)
- Pulsing accretion disk with radial gradient glow
- Animated event horizon with dashed ring and crosshair lines
- Fully responsive — recalculates on resize

---

## 🔌 Data Sources

| Source | Endpoint |
|---|---|
| NOAA SWPC Kp Index | `services.swpc.noaa.gov/products/noaa-planetary-k-index.json` |
| SWPC Solar Wind Plasma | `services.swpc.noaa.gov/products/solar-wind/plasma-1-day.json` |
| GOES X-Ray Flux | `services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json` |
| Spaceflight News API | `api.spaceflightnewsapi.net/v4/articles/` |
| World GeoJSON | `holtzy/D3-graph-gallery` (GitHub raw) |

Data refreshes every **5 minutes** automatically.

---

## 🛠️ Stack

- **Vanilla JavaScript** — zero build step, zero dependencies to install
- **Chart.js 4.4.1** — sparkline charts
- **satellite.js** — SGP4/SDP4 orbital propagation
- **Canvas 2D API** — hero visualization, world map, telemetry feed

---

## 🚀 Running Locally
```bash
git clone https://github.com/Non-Aarush/artemos
cd artemos
# Serve with any static server, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080`. No npm install. No build. It's just files.

---

## 📁 Structure
```
artemos/
├── index.html        
├── styles.css        
├── app.js            
├── tracker.js        
├── satellite.min.js  
└── assets/
    ├── planet.png
    ├── ufo.png
    └── astronaut.png
```

---

## 🗺️ Roadmap

- [ ] Live TLE data from Celestrak
- [ ] NASA SDO solar imagery integration  
- [ ] Geolocation-aware aurora forecasting
- [ ] Mobile-optimized satellite tracker
- [ ] Space events calendar (launches, eclipses, meteor showers)
- [ ] Light mode

---

