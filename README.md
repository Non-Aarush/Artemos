
# 🛰️ Artemos

**Real-time 3D satellite tracker**

Artemos visualizes thousands of orbiting satellites on an interactive 3D globe using real TLE data from [CelesTrak](https://celestrak.org/). Click any dot to lock on, inspect its telemetry, and watch its orbital path trace across the Earth. It is a high-performance, interactive 3D satellite visualization platform designed to bridge the gap between complex orbital mechanics and cinematic web design. It tracks thousands of satellites in real-time, providing technical telemetry, orbital paths, and geographic data.

<img width="1866" height="888" alt="Screenshot 2026-03-11 141816" src="https://github.com/user-attachments/assets/a1ec9344-80ee-4800-9e0e-2c1b9751826e" />


## Demo

> **Live**: https://artemos.vercel.app

## Features

- **Live SGP4 propagation** — satellite positions computed every frame
- **Lock-on telemetry** — click any satellite to see velocity, altitude, category, and raw TLE data
- **Orbital path rendering** — unique trajectory lines drawn per-satellite based on its actual orbit
- **Category filters** — Active, Space Stations, GPS, Weather, Scientific, Iridium, Starlink
- **Full-text search** — filter satellites by name in real time
- **Overhead scanner** — detect satellites currently above your coordinates
- **Post-processing** — bloom and luminance effects for the signature green glow

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js |
| 3D Engine | Three.js + React Three Fiber + Drei |
| Post-FX | @react-three/postprocessing |
| Orbital Math | satellite.js (SGP4/SDP4) |
| Styling | Tailwind CSS |
| Font | [Monocraft](https://github.com/IdreesInc/Monocraft) (pixel monospace) |
| Data Source | CelesTrak NORAD TLE feeds |

## Project Structure

```
app/
├── app/
│   ├── api/s/         
│   ├── globals.css    
│   ├── layout.tsx     
│   └── page.tsx        
├── logic/
│   ├── AppTypes.ts   
│   ├── Data.ts         
│   ├── State.tsx       
│   └── Utils.ts       
├── parts/
│   ├── Main.tsx    
│   ├── Globe.tsx      
│   ├── Dots.tsx        
│   ├── Ring.tsx        
│   ├── Info.tsx        
│   ├── Side.tsx       
│   ├── Top.tsx       
│   └── Loc.tsx         
└── public/
    └── textures/     
```

## Getting Started

```bash
git clone https://github.com/Non-Aarush/Artemos.git
cd Artemos/app
npm install
npm run dev
```

```bash
npm run build
npm start
```

---
