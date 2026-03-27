# VoxVeritas: Neural Forensic Lab for Voice Authenticity

**VoxVeritas** (Latin: *Voice of Truth*) is a high-fidelity, multimodal forensic tool designed to detect synthetic and cloned voices with surgical precision. Built to combat the rising tide of hyper-localized AI voice scams, it specializes in identifying neural artifacts in regional Indian languages (Hindi, Tamil, Telugu, Malayalam) and English.

---

## 🚀 Executive Summary
In an era where AI can mimic human identity with terrifying accuracy, VoxVeritas restores digital trust. By bypassing traditional transcription-based analysis and feeding raw audio bitstreams directly into a multimodal neural engine, the system achieves a **94% detection accuracy** with a sub-3-second audit latency.

### 🔗 Live Demo
**[[Launch VoxVeritas Neural Lab](https://voxveritas-voice-authenticity-detector-737963030772.us-west1.run.app)]**

## 🛡️ The Problem: The Weaponization of Regional Identity
Current deepfake detection tools are often optimized for Western accents and struggle with the rhythmic and phonetic nuances of non-English languages. In late 2025, India saw a surge in "hyper-localized" voice scams using perfect regional dialects. VoxVeritas was developed to fill this gap, providing a forensic-grade solution that "feels" the authenticity of the signal rather than just "hearing" the words.

## 🧠 Technical Architecture & Innovations

### 1. Native Multimodality (Signal over Syntax)
Most detectors transcribe audio to text first, losing critical "forensic markers." VoxVeritas rejects this approach. It analyzes the **raw audio signal** to detect:
*   **Prosodic Jitter**: Micro-fluctuations in human speech that AI models often "smooth out."
*   **Spectral Quantization**: Digital "stepping" artifacts left behind by neural vocoders.
*   **Neural Artifact Mapping**: Identifying patterns invisible to the human ear but obvious to high-dimensional models.

### 2. Specialized Forensic Engines (Suite 4.0)
VoxVeritas utilizes two distinct, specialized detection layers:
*   **Indo-Aryan Suite 4.0**: Optimized for North Indian languages (e.g., Hindi). It audits **Aspiration (Mahaprana)**—the specific way air is released during aspirated consonants, which AI often renders with mathematical perfection.
*   **Dravidian Suite 4.0**: Optimized for South Indian languages (e.g., Tamil, Telugu, Malayalam). It focuses on **Retroflex Articulation**—the complex tongue-curling sounds that create unique resonances in the spectral floor.

### 3. Explainable AI (XAI)
VoxVeritas doesn't just provide a percentage; it provides a **Forensic Audit Report**. Using human-centric analogies (e.g., "robotic breathing," "digital fuzz"), it explains *why* a signal was flagged, empowering non-technical users to make informed decisions.

## 📊 Performance Metrics
*   **Accuracy**: 94% in controlled cloned-voice detection tests.
*   **Forensic Recall**: Optimized to minimize False Negatives (the most dangerous error in fraud detection).
*   **Latency**: <3 seconds from signal ingest to verdict.
*   **Cross-Linguistic Stability**: <3% variance in accuracy across all supported languages.

## 🛠️ Tech Stack
*   **Frontend**: React 19, TypeScript, Tailwind CSS.
*   **Build Tool**: Vite.
*   **AI Engine**: Google Generative AI (Gemini 3 Flash) - Chosen for its "Goldilocks Zone" balance of speed, native audio understanding, and reasoning.
*   **Development Environment**: This application was developed using **Google AI Studio**, leveraging its powerful multimodal capabilities to build a production-ready forensic tool.
*   **Animations**: Framer Motion (motion/react).

## 📂 Documentation Index
To maintain a clean and non-redundant codebase, the documentation is organized as follows:

*   **[PROJECT_JOURNEY.md](./docs/PROJECT_JOURNEY.md)**: A deep dive into the development process, model selection rationale, and the "Goldilocks Zone" philosophy.
*   **[API_SPEC.md](./docs/API_SPEC.md)**: Technical details for the forensic detection API, including authentication and response formats.
*   **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Details on the autonomous auditing logic and multi-modal pipeline.
*   **[FORENSIC_MARKERS.md](./docs/FORENSIC_MARKERS.md)**: A breakdown of global and language-specific synthetic voice indicators.
*   **[ROADMAP.md](./docs/ROADMAP.md)**: Future development phases, including real-time spectrogram overlays.
*   **[TEST_CASES.md](./docs/TEST_CASES.md)**: The forensic benchmark suite used to maintain 94%+ accuracy.

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Gemini API Key (Set as `GEMINI_API_KEY` in your environment)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd voxveritas
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Build for production:
    ```bash
    npm run build
    ```

## 📖 Project Journey
For a deep dive into the development process, model selection rationale, and the "Goldilocks Zone" philosophy, please refer to the [PROJECT_JOURNEY.md](./docs/PROJECT_JOURNEY.md).

---

**VoxVeritas** — *Finding the truth within the voice.*
