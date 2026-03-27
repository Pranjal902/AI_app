
# VoxVeritas - Architecture 2026 (Intelligent Update)

The VoxVeritas system has transitioned from a manual input model to a **Zero-Trust Linguistic Logic** model.

## 1. Autonomous Auditing Logic
Unlike standard detectors that optimize analysis based on a user-provided language hint, VoxVeritas 3.2 uses the first **1.2 seconds of audio** for an independent linguistic identifier.

- **Verification Loop**: 
  - User Input: `Tamil`
  - Forensic ID: `Hindi`
  - Result: `languageMismatch: true`
  - Output: Analysis continues using Hindi-specific biometric suites to ensure accurate classification despite the input error.

## 2. Multi-Modal Pipeline
We leverage the native audio tokens of **Gemini 3.0 Pro** to bypass the "spectral compression" inherent in older STT-based models. This allows us to see raw "quantization noise" in the frequencies above 16kHz, a hallmark of AI voice synthesis.

## 3. Indic Forensic Suites
The engine selects from five specialized forensic profiles:
- **Dravidian Profile**: Specialized for retroflex and lateral transitions.
- **Indo-Aryan Profile**: Specialized for aspiration (Mahaprana) and nasal resonance.
- **English/Global Profile**: Optimized for prosodic metronome detection.
