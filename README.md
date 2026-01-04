# Keymark

Keymark is a small Chrome extension that helps you quickly find and open bookmarks using fuzzy search and keyboard-first navigation.

Features
- Fuzzy-search bookmarks .
- Keyboard navigation with ArrowUp/ArrowDown and Enter to open a bookmark.
- Grouped results with collapsible site groups.
- Light and Dark theme toggle .
- Quick open from a keyboard shortcut (configure in the Extension settings).



https://github.com/user-attachments/assets/4270be28-bed0-45fa-89df-03f3f54468fb



Quickstart

Prerequisites
- Node.js (recommended >= 20.19.0) — Vite recommends Node 20+. Builds may still work on older Node versions but you'll see warnings.
- npm

Install deps

```bash
cd path/to/keymark
npm install
```

Development (local)

This runs the TypeScript build and Vite in dev mode. For extension development you will usually build and then load the `dist` folder into Chrome.

```bash
npm run dev
# or to produce a production build (recommended before loading into Chrome):
npm run build
```

Build

`npm run build` runs `tsc -b` then `vite build` and outputs the distributable assets to `dist/`.

Load into Chrome (unpacked)
1. Run `npm run build`.
2. Open `chrome://extensions/` in Chrome.
3. Enable "Developer mode" (top-right).
4. Click "Load unpacked" and select the `dist` folder inside this repository.

Usage
- Open the popup via the extension toolbar button or the configured keyboard command.
- Start typing to filter bookmarks. The search uses fuzzy matching.
- Use ArrowUp/ArrowDown to change selection. Press Enter to open the selected bookmark.
- Toggle the theme with the theme button (top-right) — the selection and state are 


Development tips
- Source files live under `src/`. The popup UI is in `src/popup/`.
- The background worker is `src/background.ts` and is emitted as `background.js` during the build (configured in `vite.config.ts`).
- Search logic is implemented using Fuse.js in `src/services`.

Troubleshooting
- If Chrome reports "Could not load background script" or similar, make sure you've built the project and that `dist/background.js` exists.
- If you see a Vite warning about Node.js version, consider upgrading Node to >= 20.19.

Contributing
- Open an issue or a PR. Keep changes small and include a test or manual verification steps.

License
- MIT
