# Resume Builder

A modern, web-based resume builder application built with **React** and **Vite**. Create professional resumes using a live editor, beautiful templates, and export to PDF.

## Features

- 📝 **Resume Editor** — Add and edit personal info, experience, education, skills, and more
- 🎨 **Template System** — Choose from Basic, Modern, and Professional designs
- 👁️ **Live Preview** — See changes in real time
- 📄 **PDF Export** — Download your resume as a PDF
- 💾 **Save / Load** — Auto-save to localStorage and manage resumes
- 🧠 **AI Assistance** (planned) — Generate and improve content
- 🔎 **ATS Support** (planned) — Optimize for applicant tracking systems
- 🔐 **Authentication & Database** (planned) — Cloud sync with accounts

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Zustand (state management)
- jsPDF (PDF generation)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
resume-builder/
├── public/            # Static assets (images, icons)
├── src/
│   ├── components/    # Reusable UI, layout, and common components
│   ├── pages/         # Route pages (Home, Builder, Templates, Dashboard)
│   ├── features/      # Feature modules (resume, templates, preview, pdf)
│   ├── services/      # API and storage services
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Helper utilities
│   ├── styles/        # Global styles
│   ├── App.jsx        # Main app with routing
│   └── main.jsx       # Entry point
├── package.json
├── vite.config.js
├── .env
├── .gitignore
└── README.md
```

## Build

```bash
npm run build
```

## License

MIT
