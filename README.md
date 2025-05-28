# LuxCraft AI - Jewelry Image Generator

A modern web application that uses AI to generate custom jewelry designs based on text prompts.

## Features

- AI-powered jewelry image generation using DALL·E
- User-friendly prompt interface for describing desired jewelry
- Multiple image generation (5+ options) from a single prompt
- Detailed product pages with jewelry-specific attributes
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Python, Flask
- **API Integration**: OpenAI DALL·E

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)

### Installation

1. Clone the repository
2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### Running the application

1. Start the backend server:

```bash
npm run backend
```

2. In a new terminal, start the frontend development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src` - React frontend application
- `/backend` - Python Flask API
- `/public` - Static assets

## Development

To enable DALL·E image generation you will need an OpenAI API key. Set the
`OPENAI_API_KEY` environment variable before starting the backend.
## Tests

Run lint and build to verify the project:

```bash
npm run lint
npm run build
```


## License

MIT