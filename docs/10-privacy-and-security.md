# Privacy & security

- **No accounts, no tracking, no analytics, no cookies.** Progress, flashcard boxes, preferences and tool data (such as the marks typed into the APS calculator) are stored only in the learner's browser (`localStorage`, under `lifemzansi:` keys). Nothing is sent to LifeMzansi – POPIA-friendly by design.
- Learners can **export** their progress to a file and **import** it on another device, or **reset** it.
- The sexual-health, mental-health and first-aid lessons are **health education, not medical advice**; they point learners to free public clinics and help lines. Nothing the learner does in these lessons is recorded beyond lesson completion on their own device.
- **Read-aloud** uses the device's speech engine.
- Typed answers are checked in the browser by plain string comparison – nothing a learner types is ever run as code.
- The `/api/curriculum` endpoint is a static, read-only JSON description of the curriculum (no learner data).
