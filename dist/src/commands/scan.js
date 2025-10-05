"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils/utils");
const karuta_work_1 = require("../utils/karuta-work");
const ytPromo_1 = require("../utils/ytPromo");
const userJobBoards = new Map();
setInterval(() => {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    for (const [userId, data] of userJobBoards.entries()) {
        if (data.timestamp < fiveMinutesAgo) {
            userJobBoards.delete(userId);
        }
    }
}, 5 * 60 * 1000);
exports.default = {
    triggers: ["scan", "work"],
    async execute(message) {
        if (!message.reference)
            return;
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (!repliedTo)
            return;
        if (!repliedTo.author.bot || repliedTo.author.id !== utils_1.Karuta)
            return;
        const content = message.content.toLowerCase();
        let triggeredByUser = false;
        if (repliedTo.reference) {
            const originalMessage = await message.channel.messages.fetch(repliedTo.reference.messageId).catch(() => null);
            if (originalMessage?.author.id === message.author.id) {
                triggeredByUser = true;
            }
        }
        const { embed: ytEmbed, button: ytButton } = (0, ytPromo_1.YouTubePromoEmbed)();
        if (!triggeredByUser) {
            await message.reply({
                embeds: [(0, karuta_work_1.NotTriggeredByYou)(), ytEmbed],
                components: [ytButton],
            });
            return;
        }
        const embed = repliedTo.embeds[0];
        if (!embed?.description)
            return;
        const userId = message.author.id;
        if (content.startsWith("kkscan")) {
            const healthyCards = [];
            const lines = embed.description.split("\n").map((line) => line.trim()).filter(Boolean);
            let foundJobBoard = false;
            for (const line of lines) {
                const match = line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`(Healthy|Injured)`/);
                if (match) {
                    foundJobBoard = true;
                    const [_, position, name, effort, status] = match;
                    if (status === "Healthy") {
                        healthyCards.push({ position, name });
                    }
                }
            }
            if (!foundJobBoard) {
                const gifPath = path_1.default.join(__dirname, utils_1.DORO_GIF_LOCATION);
                const gif = new discord_js_1.AttachmentBuilder(gifPath);
                await message.reply({
                    embeds: [(0, karuta_work_1.NoJobBoardFound)(), ytEmbed],
                    components: [ytButton],
                    files: [gif]
                });
                return;
            }
            if (healthyCards.length === 0) {
                const hasCards = lines.some(line => line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`Injured`/));
                if (!hasCards) {
                    await message.reply({
                        embeds: [(0, karuta_work_1.EmptyJobBoard)(), ytEmbed],
                        components: [ytButton]
                    });
                    return;
                }
            }
            userJobBoards.set(userId, {
                healthyCards,
                timestamp: Date.now()
            });
            const healthyCount = healthyCards.length;
            const injuredCount = lines.filter(line => line.match(/^(🇦|🇧|🇨|🇩|🇪)\s(.+?)\s·\s\*\*(\d+)\*\*\sEffort\s·\s`Injured`/)).length;
            if (healthyCount === 5) {
                await message.reply({
                    embeds: [(0, karuta_work_1.AllCardsHealthyEmbed)(), ytEmbed],
                    components: [ytButton]
                });
                return;
            }
            await message.reply({
                embeds: [(0, karuta_work_1.JobBoardSummary)(healthyCount, injuredCount), ytEmbed],
                components: [ytButton]
            });
        }
        if (content.startsWith("kkwork")) {
            const userData = userJobBoards.get(userId);
            const availableCards = [...embed.description.matchAll(/\*\*`([^`]+)`\*\*.*\*\*(.+?)\*\*$/gm)].map((match) => ({
                code: match[1],
                name: match[2].trim(),
            }));
            if (availableCards.length === 0) {
                await message.reply({
                    embeds: [(0, karuta_work_1.NoCardsFound)(), ytEmbed],
                    components: [ytButton]
                });
                return;
            }
            const allLabels = ["A", "B", "C", "D", "E"];
            let availableLabels;
            if (!userData || userData.healthyCards.length === 0) {
                availableLabels = [...allLabels];
            }
            else {
                const emojiToLabel = {
                    "🇦": "A",
                    "🇧": "B",
                    "🇨": "C",
                    "🇩": "D",
                    "🇪": "E",
                };
                const usedLabels = userData.healthyCards
                    .map((card) => emojiToLabel[card.position])
                    .filter(Boolean);
                availableLabels = allLabels.filter((label) => !usedLabels.includes(label));
            }
            let labelIndex = 0;
            for (const { code, name } of availableCards) {
                if (userData && userData.healthyCards.some((card) => name.startsWith(card.name)))
                    continue;
                if (labelIndex >= availableLabels.length)
                    break;
                const label = availableLabels[labelIndex++];
                if (message.channel.isTextBased()) {
                    await message.channel.send(`kjw ${label.toLowerCase()} ${code}`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            if (labelIndex === 0) {
                await message.reply({
                    embeds: [(0, karuta_work_1.AllCardsHealthyEmbed)(), ytEmbed],
                    components: [ytButton]
                });
            }
        }
    },
};
