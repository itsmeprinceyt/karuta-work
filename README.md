# Karuta Work - Discord Bot

A utility bot built for the Karuta card game on Discord. It streamlines card management and helps players stay efficient.

---

## Features

- `kkhelp` – List available commands and usage instructions.
- `kkinvite` – Get an invite link to add the bot to your server.
- `kkscan` – Analyze your job board and highlight healthy/injured cards.
- `kkwork` – Automatically assign available cards to job board slots.
- `kkbits` – Calculate total bits or a custom total based on selling price. Example: `kkbits 2300` while replying to a kbi embed.
- `kkabout` – Learn more about the bot and its creator.
- Anti-spam cooldown system with dynamic timers to prevent abuse.
- Rich embeds with GIFs and embedded YouTube support.

---

## Development Commands

### `dev`

- **Command:** `npm run dev` or `nodemon`
- **Description:** Starts the development server. Watches for changes in source files (`src/index.ts`) and automatically restarts on updates. Uses `tsx watch` in a TypeScript execution environment.

### `build`

- **Command:** `npm run build`
- **Description:** Compiles the TypeScript source and copies necessary assets via `node dist/copyAssets.js`, ensuring static files (images, CSS, etc.) are included in the build output.

### `start`

- **Command:** `npm run start`
- **Description:** Runs the compiled application from `dist/src/index.js` after a successful build.

---

> Originally built for personal use, this bot has since been made public so others can invite and use it in their own servers.

### Discord Invite Link

https://discord.com/oauth2/authorize?client_id=1384236212092538880&permissions=2147601472&integration_type=0&scope=bot
