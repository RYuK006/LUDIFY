<div align="center">
  
  # LUDIFY
  
  **Autonomous AI Agent Rental Concierge**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
  [![Status: Beta](https://img.shields.io/badge/Status-Beta-pink.svg)](https://github.com/RYuK006/ludify)
  [![Powered By: Gemini](https://img.shields.io/badge/AI-Gemini_2.5-blue.svg)](https://deepmind.google/technologies/gemini/)
  [![Framework: React](https://img.shields.io/badge/Frontend-React_19-cyan.svg)](https://react.dev)

  <p align="center">
    LUDIFY ("Let Us Do It For You") is a next-generation AI agent system that autonomously navigates the chaotic rental market. 
    <br />
    It transforms a simple instruction into a verified schedule of property visits.
  </p>
</div>

---

## 🚀 The Mission

Finding a home is broken. You browse endlessly, send emails into the void, and stress about commute times. 

**LUDIFY fixes this by deploying a squad of specialized AI agents to work for you.**

Instead of searching, you command. LUDIFY executes a 3-phase strategic mission to find, verify, and schedule viewings for properties that match your exact lifestyle and budget constraints.

## 🧠 Autonomous Workflow

LUDIFY operates through a linear, multi-agent pipeline:

![LUDIFY Workflow Schematic](assets/workflow.png)

### Phase 1: The Strategist (Targeting)
*   **Engine:** Gemini 2.5 Flash + Google Maps Grounding
*   **Mission:** Analyzes your work location and commute tolerance to calculate dynamic "Commute Zones." It identifies high-value neighborhoods that maximize your budget.

### Phase 2: The Hunter (Discovery)
*   **Engine:** Gemini 2.0 Flash (Architect Mode) + Google Search
*   **Mission:** Scans disparate data sources (Zillow, Craigslist, etc.) in real-time. It parses unstructured web data into structured "Candidate Listings" with direct links and pricing.

### Phase 3: The Closer (Outreach)
*   **Engine:** Gemini 3 Flash Preview
*   **Mission:** Simulates outreach to property managers. It verifies availability, filters out "ghost" listings, and locks in a confirmed viewing time (e.g., "Saturday @ 11:30 AM").

---

## 🛠 Tech Stack

*   **Core:** React 19, TypeScript, Vite
*   **AI Models:** Google Gemini 2.0 Pro, Gemini 2.5 Flash
*   **Styling:** TailwindCSS, Lucide React (Icons)
*   **Grounding:** Google Maps Platform, Google Search

## ⚡ Quick Start

### Prerequisites
*   Node.js 20+
*   Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/ludify.git
    cd ludify
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Launch Mission Control**
    ```bash
    npm run dev
    ```

---

## 🔮 Roadmap

- [ ] **Voice Command Module:** Initialize missions via voice.
- [ ] **Multi-City Support:** Simultaneous hunting in multiple metropolitan areas.
- [ ] **Negotiator Bot:** Automated price negotiation based on market value analysis.
- [ ] **Mobile App:** Native iOS/Android interface.

---

<div align="center">
  <sub>Built with ❤️ by the LUDIFY Team. <b>Let Us Do It For You.</b></sub>
</div>
