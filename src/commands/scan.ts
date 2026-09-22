import { Message, TextChannel, AttachmentBuilder } from "discord.js";
import path from "path";
import { DORO_GIF_LOCATION, Karuta } from "../utils/utils";
import {
  AllCardsHealthyEmbed,
  EmptyJobBoard,
  NoJobBoardFound,
  NotTriggeredByYou,
  NoCardsFound,
  JobBoardSummary,
  ScanFirst,
} from "../utils/karuta-work";
import { YouTubePromoEmbed } from "../utils/ytPromo";
import { UserJobBoardData } from "../types/UserJobBoardData.type";

const userJobBoards = new Map<string, UserJobBoardData>();

const EMOJI_TO_LABEL: Record<string, string> = {
  "🇦": "A",
  "🇧": "B",
  "🇨": "C",
  "🇩": "D",
  "🇪": "E",
};
const ALL_SLOTS = ["A", "B", "C", "D", "E"];

setInterval(
  () => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    for (const [userId, data] of userJobBoards.entries()) {
      if (data.timestamp < fiveMinutesAgo) {
        userJobBoards.delete(userId);
      }
    }
  },
  5 * 60 * 1000,
);

export default {
  triggers: ["scan", "work"],
  async execute(message: Message) {
    if (!message.reference) return;
    const repliedTo = await message.channel.messages.fetch(
      message.reference.messageId!,
    );
    if (!repliedTo) return;
    if (!repliedTo.author.bot || repliedTo.author.id !== Karuta) return;

    const content = message.content.toLowerCase();
    let triggeredByUser = false;
    if (repliedTo.reference) {
      const originalMessage = await message.channel.messages
        .fetch(repliedTo.reference.messageId!)
        .catch(() => null);
      if (originalMessage?.author.id === message.author.id) {
        triggeredByUser = true;
      }
    }

    const { embed: ytEmbed, button: ytButton } = YouTubePromoEmbed();

    if (!triggeredByUser) {
      await message.reply({
        embeds: [NotTriggeredByYou(), ytEmbed],
        components: [ytButton],
      });
      return;
    }

    const embed = repliedTo.embeds[0];
    if (!embed?.description) return;

    const userId = message.author.id;

    // ================================================================ //
    // KKSCAN — Parse the job board (kjb output)
    // ================================================================ //
    if (content.startsWith("kkscan")) {
      const healthyCards: { position: string; name: string; effort: number }[] =
        [];
      const injuredSlots: string[] = [];
      const occupiedSlots: string[] = [];

      const boardCardKeys = new Set<string>();
      const boardNames = new Set<string>();
      const boardEfforts = new Set<number>();

      let foundJobBoard = false;

      const lines = embed.description
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const rawLine of lines) {
        // Detect leading slot emoji (🇦–🇪)
        let currentSlot: string | null = null;
        let rest = rawLine;
        for (const [emoji, label] of Object.entries(EMOJI_TO_LABEL)) {
          if (rawLine.startsWith(emoji)) {
            currentSlot = label;
            rest = rawLine.slice(emoji.length).trim();
            break;
          }
        }
        if (!currentSlot) continue;

        // Permissive regex — matches the main script's parser.
        // Accepts any status word in backticks (Healthy / Injured / …).
        const fieldMatch = rest.match(
          /^(.+?)\s*·\s*\*\*(\d+)\*\*\s*Effort\s*·\s*`([^`]+)`/,
        );
        if (!fieldMatch) continue;

        foundJobBoard = true;

        const name = fieldMatch[1].trim();
        const effort = parseInt(fieldMatch[2], 10);
        const status = fieldMatch[3].trim();
        const isInjured = status.toLowerCase().includes("injured");

        // Build all three alias-bypass lookup sets
        boardCardKeys.add(`${name}_${effort}`);
        boardNames.add(name);
        boardEfforts.add(effort);

        occupiedSlots.push(currentSlot);

        if (isInjured) {
          injuredSlots.push(currentSlot);
        } else {
          healthyCards.push({ position: currentSlot, name, effort });
        }
      }

      // Not a job board at all
      if (!foundJobBoard) {
        const gifPath = path.join(__dirname, DORO_GIF_LOCATION);
        const gif = new AttachmentBuilder(gifPath);
        await message.reply({
          embeds: [NoJobBoardFound(), ytEmbed],
          components: [ytButton],
          files: [gif],
        });
        return;
      }

      // Empty board (no cards at all, healthy OR injured)
      if (occupiedSlots.length === 0) {
        await message.reply({
          embeds: [EmptyJobBoard(), ytEmbed],
          components: [ytButton],
        });
        return;
      }

      const emptySlots = ALL_SLOTS.filter((s) => !occupiedSlots.includes(s));

      userJobBoards.set(userId, {
        healthyCards,
        injuredSlots,
        emptySlots,
        boardCardKeys,
        boardNames,
        boardEfforts,
        timestamp: Date.now(),
      });

      const healthyCount = healthyCards.length;
      const injuredCount = injuredSlots.length;

      if (healthyCount === 5) {
        await message.reply({
          embeds: [AllCardsHealthyEmbed(), ytEmbed],
          components: [ytButton],
        });
        return;
      }

      await message.reply({
        embeds: [JobBoardSummary(healthyCount, injuredCount), ytEmbed],
        components: [ytButton],
      });
      return;
    }

    // ================================================================ //
    // KKWORK — Replace injured + fill empty slots using owned cards
    // ================================================================ //
    if (content.startsWith("kkwork")) {
      const userData = userJobBoards.get(userId);

      // ---------- 1) Parse owned cards (kc o:eff output) ----------
      // Line format: ✧<effort> … **`<code>`** … **<name>**
      const availableCards: { code: string; name: string; effort: number }[] =
        [];

      const lines = embed.description
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      for (const line of lines) {
        // Effort = first ✧NUMBER on the line
        const effortMatch = line.match(/✧(\d+)/);
        // Code = value inside **`code`**
        const codeMatch = line.match(/\*\*`([^`]+)`\*\*/);
        // Name = LAST **bold** segment that is NOT backtick-wrapped
        const nameMatch = line.match(/\*\*([^`*][^*]*)\*\*\s*$/);

        if (!effortMatch || !codeMatch || !nameMatch) continue;

        availableCards.push({
          effort: parseInt(effortMatch[1], 10),
          code: codeMatch[1].trim(),
          name: nameMatch[1].trim(),
        });
      }

      if (availableCards.length === 0) {
        await message.reply({
          embeds: [NoCardsFound(), ytEmbed],
          components: [ytButton],
        });
        return;
      }

      // ---------- 2) Decide which slots need action ----------
      let slotsToReplace: string[];
      let boardNames: Set<string>;
      let boardCardKeys: Set<string>;
      let boardEfforts: Set<number>;

      if (!userData) {
        // No prior scan — try every slot and don't skip anything
        slotsToReplace = [...ALL_SLOTS];
        boardNames = new Set();
        boardCardKeys = new Set();
        boardEfforts = new Set();
      } else {
        // Injured slots FIRST (replacement), then empty slots (filling)
        slotsToReplace = [...userData.injuredSlots, ...userData.emptySlots];
        boardNames = userData.boardNames;
        boardCardKeys = userData.boardCardKeys;
        boardEfforts = userData.boardEfforts;
      }

      // ---------- 3) ALIAS-BYPASS FILTER ----------
      // Skip any owned card that already exists on the board by:
      //   • same NAME              → skip
      //   • same NAME + EFFORT     → skip
      //   • same EFFORT alone      → skip  (this handles aliases)
      const replacements = availableCards.filter((card) => {
        const nameMatch = boardNames.has(card.name);
        const nameEffortMatch = boardCardKeys.has(
          `${card.name}_${card.effort}`,
        );
        const effortMatch = boardEfforts.has(card.effort);
        return !(nameMatch || nameEffortMatch || effortMatch);
      });

      if (replacements.length === 0) {
        await message.reply({
          embeds: [AllCardsHealthyEmbed(), ytEmbed],
          components: [ytButton],
        });
        return;
      }

      // ---------- 4) Send kjw per slot ----------
      const count = Math.min(replacements.length, slotsToReplace.length);

      if (count === 0) {
        await message.reply({
          embeds: [AllCardsHealthyEmbed(), ytEmbed],
          components: [ytButton],
        });
        return;
      }

      for (let i = 0; i < count; i++) {
        const slot = slotsToReplace[i];
        const card = replacements[i];

        if (message.channel.isTextBased()) {
          await (message.channel as TextChannel).send(
            `kjw ${slot.toLowerCase()} ${card.code}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
      return;
    }
  },
};
