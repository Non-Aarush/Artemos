# 🛰️ Artemos — Space Dashboard


**Artemos** is a high-performance, interactive 3D satellite visualization platform designed to bridge the gap between complex orbital mechanics and cinematic web design. It tracks thousands of satellites in real-time, providing technical telemetry, orbital paths, and geographic data through a sleek, retro-futuristic HUD.

## ✨ Core Experience

### 🌍 Real-Time 3D Visualization
Watch thousands of satellites traverse the globe in real-time. The engine uses **pixel-perfect texture mapped meshes** and **custom shaders** to render Earth with a distinct "digital twin" aesthetic.

### 📡 Physics-Based Propagation
Positions are not static. Using **SGP4/SDP4 orbital models** , Artemos calculates the exact location of every object every frame based on official TLE (Two-Line Element) data from CelesTrak.

### 🔍 Discovery & Telemetry
- **Categorized Tracking**: Instantly switch between Starlink, GPS, Scientific, Weather, and Space Stations.
- **Deep Intel**: Click any satellite to "lock on" and view its velocity, altitude, orbital inclination, and raw TLE data.
- **Local Scanner**: Use the "Scan Overhead" feature to identify satellites currently passing through your specific sky coordinates.



## 🛠️ Technical Stack
- **Next.js**: Utilizing the App Router for optimized performance and server-side navigation.
- **Three.js + React Three Fiber**: The heavy lifting for 3D rendering, including instance mesh optimization for high-count satellite displays.
- **Tailwind CSS**: Built with a custom theme for rapid, consistent styling of HUD elements.


## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-repo/artemos.git
   cd artemos/app
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

---


