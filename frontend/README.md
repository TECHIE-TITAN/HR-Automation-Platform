# HR Assistant Frontend

Professional React-based frontend for the Orion HR Assistant application.

## Features

- 📄 **Resume Upload**: Upload and process PDF resumes
- 📋 **Job Role Input**: Specify the position being hired for
- ❓ **Policy Questions**: Ask company policy-related questions
- 📊 **Comprehensive Results**: View candidate scores, skills, and personalized onboarding plans
- 💬 **Policy Q&A**: Get instant answers to policy questions based on company rulebook

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000` and proxy API calls to `http://localhost:9000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ResumeUploader.tsx
│   │   ├── FormSection.tsx
│   │   ├── ResultsViewer.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   ├── types.ts            # TypeScript type definitions
│   └── api.ts              # API client
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env
```

## Configuration

Update the API endpoint in `.env`:

```
VITE_API_URL=http://localhost:9000
```

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **Axios**: HTTP client
- **Lucide React**: Icon library

## API Integration

The frontend communicates with the backend orchestrator API at the `/orchestrate` endpoint.

### Request Format

```typescript
{
  pdf_path: string;      // Path to the resume PDF
  job_role: string;      // Target job position
  policy_questions: [];  // Array of policy questions
}
```

### Response Format

```typescript
{
  candidate_info: {
    name: string;
    College: string;
    Tech_skills: string[];
    Soft_skills: string[];
    CGPA: string;
    score: number;
  };
  onboarding_plan: string;
  policy_answers: Record<string, string>;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
