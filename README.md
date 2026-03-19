# CC Professionals WebApp

A Google Apps Script WebApp acting as a public directory and contact platform for mental health professionals. Users can search and filter a curated list of professionals and reach out directly.

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-WebApp-blue)

---

## Overview

This platform helps people find mental health professionals by providing a searchable, filterable directory backed by Google Sheets. Professionals are listed with their specialisation, contact details, and availability, making it easy for users to find and connect with the right person.

---

## Features

- Searchable and filterable professional directory
- Professional cards with specialisation, contact info, and availability
- Filter by field, area, or other criteria
- Clean, accessible public-facing UI
- Client/server split architecture

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Platform | Google Apps Script              |
| UI       | HTML5, CSS3, Vanilla JavaScript |
| Database | Google Sheets                   |
| Deploy   | clasp CLI                       |

---

## Project Structure

```
cc-professionals-webapp/
├── README.md
├── AGENT.md
├── .gitignore
└── src/
    ├── appsscript.json  # GAS manifest
    ├── client/          # Directory UI — search, filter, professional cards
    └── server/          # doGet(), Sheets data access
```

---

## Getting Started

### Prerequisites

- A Google account with Google Apps Script access
- [clasp](https://github.com/google/clasp) installed globally

```bash
npm install -g @google/clasp
clasp login
```

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamedallam13/cc-professionals-webapp.git
   cd cc-professionals-webapp
   ```

2. Link to your Apps Script project:
   ```bash
   clasp create --type webapp --title "CC Professionals" --rootDir src
   ```

3. Push source files:
   ```bash
   clasp push
   ```

---

## Deployment

1. In the Apps Script editor, go to **Deploy > New deployment**
2. Select type: **Web app**
3. Set **Who has access**: Anyone
4. Click **Deploy** and share the public Web App URL

---

## Author

**Mohamed Allam** — [GitHub](https://github.com/mohamedallam13) · [Email](mailto:mohamedallam.tu@gmail.com)
