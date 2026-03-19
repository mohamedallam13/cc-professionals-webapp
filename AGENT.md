# AGENT.md — cc-professionals-webapp

## Purpose
A Google Apps Script WebApp acting as a platform and contact point for people seeking mental health professionals. Client/server split architecture.

## Structure
```
cc-professionals-webapp/
├── README.md
├── AGENT.md
├── .gitignore
└── src/
    ├── appsscript.json  ← GAS manifest
    ├── client/          ← HTML/CSS/JS frontend (directory / search UI)
    └── server/          ← GAS server-side scripts (professional data access)
```

## Key Facts
- **Platform:** Google Apps Script WebApp
- **Data store:** Google Sheets (professional directory)
- **Purpose:** Public-facing directory for mental health professionals — search, filter, contact
- **Entry point:** `server/` contains the `doGet()` / `doPost()` functions

## Development Notes
- All source files live under `src/` — push with clasp from that directory
- No Node/npm at runtime; ES5-compatible GAS code only
