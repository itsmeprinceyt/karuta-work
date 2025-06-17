# 🤖 Karuta Work - Discord Bot

A helpful utility bot built for the Karuta card game on Discord. It simplifies card management, saves time, and helps players stay efficient — with style!

---

## ✨ Features

- 📖 `kkhelp` – Get a list of commands and learn how the bot works.
- 📨 `kkinvite` – Receive an invite link to add this bot to your server.
- 🛠️ `kkscan` – Analyze your job board and highlight healthy/injured cards.
- ⚒️ `kkwork` – Automatically assign available cards to job board slots.
- 📺 `kkabout` – Learn more about the bot and support its creator.
- 🕒 Anti-spam cooldown system to avoid abuse (with dynamic timers).
- 🎥 Embedded YouTube support and visuals with GIFs and rich embeds.

---
# Development Commands
`dev`
- **Command:** `npm run dev` or `nodemon`

- **Description:** Starts the development server. This command typically watches for changes in your source files (`src/index.ts` in this case) and automatically restarts the server, allowing for a rapid development workflow. It uses tsx watch for this purpose, indicating a TypeScript execution environment.

`build`
- **Command:** `npm run build`

- **Description:** Compiles the TypeScript source code and copies necessary assets using `node dist/copyAssets.js`. After compilation, this script is executed to copy any static assets (like images, CSS, or other non-TypeScript files) from your source directory to the build output directory, ensuring they are included in the final build. 

`start`
- **Command:** `npm run start`

- **Description:** Runs the compiled application. This command is used to start ( `dist/src/index.js` ) after it has been build using `npm run build`.
---
> This is the bot I originally built for myself, but it turns out a lot of others find it useful too — so I’ve created a public version that you can now invite and use in any server!

### Discord Invite Link
https://discord.com/oauth2/authorize?client_id=1384236212092538880&permissions=2147601472&integration_type=0&scope=bot
