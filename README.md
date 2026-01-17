# Sorted Beans 🫘
The Minimalist Day Planner for Focused Productivity
Most calendar apps are great for seeing your month at a glance, but they often fail when it entails the granular "hour-by-hour" reality of a busy day. Sorted Beans is a minimalist day-planning application designed to bridge that gap, offering a clean, distraction-free interface specifically optimized for daily scheduling.

## Key Features
- Granular Day Planning: Track tasks with titles, descriptions, and specific durations (minutes).
- Flexible Scheduling: Assign tasks to specific dates or keep them "dateless" to tackle whenever you're ready.
- Time Travel: Easily navigate between previous accomplishments and future plans with a simple day-flipper UI.

Personalization:
- Custom Themes: Start with the cozy Coffee default or choose from a variety of selectable color palettes.
- Cartoon Avatars: A unique profile picture to make your workspace feel like home.
- Daily Inspiration: An integrated quote component to kickstart your morning.
- Smart Weather: Grant location permissions to receive real-time weather updates to help plan your outdoor (or indoor) tasks.

## Tech Stack
Sorted Beans is built with a modern, type-safe stack for speed and reliability:
- Frontend: React & TypeScript
- State Management: Zustand (for lightweight, performant global state)
- Database & Auth: Supabase

Note: The project originally utilized a local PostgreSQL setup; historical configurations can be found in earlier commits.

Styling: Custom CSS/Tailwind (Theme-aware)

## Getting Started
To keep your "beans" synced across devices, make sure to:

Sign In: Click the GitHub Login button on the main screen. This ensures your tasks are securely stored in the cloud and tied to your account.

Location Access: When prompted, allow location permissions. This enables the weather notification feature, helping you decide if today is a "work from the park" day or a "stay inside" day.

## Installation (Local Development)
Bash

 Clone the repository
git clone https://github.com/Sutagu/SortedBeans.git

 Install dependencies
npm install

 Set up environment variables
 Create a .env file with your Supabase URL and Anon Key (follow env.example)

# Start the development server
npm run dev
