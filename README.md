# Audio Player

A modern audio player application built with Next.js, featuring multi-track support and dynamic audio pill management.

## Features

- Upload and manage audio files (.mp3, .wav)
- Multi-track timeline interface
- Drag-and-drop audio pill arrangement
- Real-time playback with dynamic updates
- Modern and intuitive user interface

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Getting Started

### Installation

1. Clone original repository or created fork:
```bash
git clone https://github.com/kamilszczepanik/audio-player
cd audio-player
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

Link to project demo: https://audio-player-ruby.vercel.app/

**Deployment is running after every commit pushed to the main branch.**

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- Wavesurfer Multitrack
- Lucide React