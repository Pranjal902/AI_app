
# VoxVeritas - Forensic Voice API

VoxVeritas is a high-security REST API designed to identify AI-generated voices across five languages: Tamil, English, Hindi, Malayalam, and Telugu.

## 🔑 Authentication (For Evaluators)

To prevent **401 Unauthorized** errors in the Live Console:
- **API Key Header**: `x-api-key`
- **Secret Value**: `vv_dev_2026_key`

In the **API Console** tab, you can click the **"USE EVALUATION KEY"** button to automatically populate the required credentials.

## 🚀 API Endpoint

- **Method**: `POST`
- **Route**: `/api/v1/voice-detection`
- **Body**:
  ```json
  {
    "language": "Tamil",
    "audioFormat": "mp3",
    "audioBase64": "..."
  }
  ```

## 🧪 Response Format

Success Response (200 OK):
```json
{
  "status": "success",
  "language": "Tamil",
  "classification": "AI_GENERATED",
  "confidenceScore": 0.95,
  "explanation": "Specific forensic markers detected..."
}
```

Error Response (401/400/500):
```json
{
  "status": "error",
  "message": "Human-readable description of the failure"
}
```
