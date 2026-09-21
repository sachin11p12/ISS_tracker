# 🛰️ ISS Live Tracker & Orbital Intelligence Platform

An advanced, real-time tracking dashboard and space intelligence platform for the **International Space Station (ISS)** and **Tiangong Space Station**, featuring 60 FPS continuous orbital trajectory interpolation, photorealistic 3D WebGL Earth globe, live NASA HD camera streaming, and comprehensive astronaut biographical archives.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=flat-square&logo=three.js)
![Leaflet](https://img.shields.io/badge/Leaflet-2D%20Maps-199900?style=flat-square&logo=leaflet)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)

---

## ✨ Key Features

### 1. 🛰️ 60 FPS Real-Time Orbital Tracking

- **Continuous Dead-Reckoning Interpolation**: Satellite markers, pulsing radar indicators, and radio footprint horizons glide smoothly along orbital vectors at 60 FPS without jerky telemetry jumps.
- **Sinusoidal Multi-Orbit Ground Tracks**: Displays full past, current, and future Keplerian orbit ground tracks spanning $-51.64^\circ$ to $+51.64^\circ$ latitude with antimeridian wrap splitting at $\pm 180^\circ$ longitude.
- **Auto-Follow & Smooth Viewport Centering**: Dynamic camera tracking that keeps the ISS centered in real-time.
- **Compact & Wide View Modes**: Responsive map container with quick-toggle expand/compact sizing.

### 2. 🌍 Photorealistic 3D Three.js WebGL Globe

- High-fidelity 3D Earth sphere with procedural fallback and shared texture caching (Day texture, Specular ocean reflections, and dynamic atmospheric cloud layers).
- Atmospheric Fresnel glow halo shader simulating orbital horizon scattering.
- Fully interactive 3D camera controls (orbit drag, pinch-to-zoom, auto-rotation, and direct ISS focal lock).

### 3. 🎥 Live HD Space Station Camera Stream

- Direct NASA HDEV external camera live feed embedded via responsive 16:9 player with instant 1-click expand/collapse overlay.
- Real-time Earth views from orbit broadcasting direct downlinks from Columbus and Destiny modules.

### 4. 👨‍🚀 Comprehensive Astronaut Biographical & Research Archive

- **Official High-Resolution Photography**: Verified portraits for all active astronauts and cosmonauts across NASA, ESA, Roscosmos, and CMSA.
- **Deep Biographical Records**: Date of birth, birthplace, flight missions, cumulative days in space, and spacewalk (EVA) durations.
- **Academic Qualifications**: Degrees earned across institutions like Harvard, Stanford, Brown, MIT, and ISAE-SUPAERO.
- **Published Research Papers**: Curated peer-reviewed publications covering extreme physiology, microgravity materials synthesis, vestibular countermeasures, and emergency medicine.
- **High-Speed Cached Image Proxy**: Server-side memory-cached proxy (`/api/image-proxy`) ensuring 0ms photo delivery without CORS or hotlink blocks.

<!-- ### 5. 📚 Technical History & Orbital Specs Architecture (`/history`)
- Complete mathematical breakdown of orbital mechanics equations:
  - Kepler's Third Law: $T = 2\pi \sqrt{\frac{a^3}{\mu}}$
  - Orbital Velocity: $v = \sqrt{\frac{\mu}{r}} \approx 7.66 \text{ km/s}$
  - Daily Nodal Precession Drift: $\Delta \Omega \approx -5.02^\circ / \text{day}$
- Interactive timeline documenting the evolution of the station from 1998 (Zarya launch) through 2030 decommissioning. -->

---

## 🛠️ Technology Stack

| Domain               | Technology                                                             |
| :------------------- | :--------------------------------------------------------------------- |
| **Framework**        | [Next.js 16 (App Router)](https://nextjs.org/)                         |
| **Language**         | [TypeScript 5](https://www.typescriptlang.org/)                        |
| **UI Library**       | [React 19](https://react.dev/)                                         |
| **Styling**          | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS              |
| **2D Mapping**       | [Leaflet](https://leafletjs.com/) & OpenStreetMap / Esri World Imagery |
| **3D Graphics**      | [Three.js](https://threejs.org/) (WebGL Canvas & Custom Shaders)       |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand)                           |
| **Icons**            | [Lucide React](https://lucide.dev/)                                    |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.17.0 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sachin11p12/ISS_tracker.git
   cd ISS_tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

<!-- ## 🌐 Deploy to Vercel

The application is fully optimized for 1-click zero-configuration deployment on Vercel:

### Via GitHub (Recommended)

1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy ISS Tracker"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com), click **Add New Project**, and import your repository.
3. Click **Deploy**.

### Via Vercel CLI

```bash
npx vercel --prod
```

> **Note**: No environment variables or API keys are required. All telemetry feeds, map tile layers, and live camera streams are open and work out of the box.

--- -->

## 📡 Live Telemetry Data Sources

- **ISS Real-Time Position & Solar Coordinates**: [Where The ISS At API](https://wheretheiss.at/)
- **Space Station Human Presence**: [Open-Notify / Corquaid APIs](https://corquaid.github.io/international-space-station-APIs/)
- **2D Cartographic Tiles**: [OpenStreetMap](https://www.openstreetmap.org/) & [Esri World Imagery](https://www.esri.com/)
- **Astronaut Photography & Documents**: [NASA Johnson Space Center](https://www.nasa.gov/), [ESA](https://www.esa.int/), [Roscosmos](https://www.roscosmos.ru/), [CMSA](http://www.cmse.gov.cn/), and [Wikimedia Commons](https://commons.wikimedia.org/)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and customize for educational, scientific, and personal projects.
