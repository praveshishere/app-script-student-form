## Setup Instructions

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure clasp**
   ```bash
   cp .clasp.json.example .clasp.json
   # Edit .clasp.json and add your script ID
   ```

3. **Login to clasp**
   ```bash
   clasp login
   ```

4. **Push your code**
   ```bash
   pnpm push
   ```

## Why This Structure?

- **`src/` directory**: Keeps source code organized and separate from config
- **`.clasp.json` git-ignored**: Each developer has their own script ID for testing
- **`.clasp.json.example` committed**: Template for new developers
- **`rootDir` in clasp config**: Only pushes files from `src/` folder
- **TypeScript in `src/`**: Clean separation, easy to navigate
- **Scripts in package.json**: Convenient aliases for common commands

## Team Workflow

For team projects, each developer:
1. Creates their own Apps Script project
2. Copies `.clasp.json.example` to `.clasp.json`
3. Adds their personal script ID
4. Can test independently without conflicts