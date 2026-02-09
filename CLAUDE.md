Technology Stack & Architecture
• Framework: Next.js 16 (App Router) using React Server Components for optimized performance.
• Runtime: Bun is mandatory for all operations to ensure 30x faster package management and native TypeScript support.
• Architecture: BFF (Backend-for-Frontend). The Next.js server acts as a middleware, attaching an API Secret for communication with the Node.js core server.
• Data Source: Currently using Mock Data (located in lib/ or local JSON) to facilitate rapid MVP development. Final integration will point to the Node.js API as the "Single Source of Truth".
Logic & Content Structure (MVP Phase)
• Core Model: Every content piece must follow the hierarchy: Story 
→
 Question 
→
 Short Answer (Initially Hidden) 
→
 Expansion (Hidden).
• Categorization: Content must be taggable by Seder HaShas (Masechet, Perek, Daf), Shulchan Aruch (Chelek, Siman, Se'if), and Concepts (Subject, Concept).
• Search Engine: Implement Debounced search with Virtualized lists for the UI to handle large result sets efficiently.
AI Workflow & Git Rules
• Plan Before Action: Always use Plan Mode (Shift + Tab in Claude Code) to research and describe changes before implementation.
• Mandatory Backups: For every code change or feature implementation, perform a Git backup.
• Detailed Commits: Commit messages MUST be detailed and written in Hebrew, explaining exactly what was changed and why.
UI & Design Guidelines
• Style: Glassmorphism with backdrop blur effects, clean and elegant aesthetics on a white background.
• Styling Engine: Tailwind CSS 4 with OKLch color support.
• Components: Utilize Shadcn/ui and Lucide Icons for consistent and accessible interface elements.
Authentication & Security
• Provider: NextAuth.js using Google OAuth only.
• Sessions: Use Cookie-based sessions (HttpOnly). Do not store tokens in localStorage.
• Protection: Implement protected routes for "User Profiles" and specific content "Expansions" based on permissions