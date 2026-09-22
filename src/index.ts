import { Client, GatewayIntentBits, Events, Message } from "discord.js";
import { config } from "dotenv";
import msgCommands from "./msgCommandHandler";
import { buttonHandlers } from "./buttonHandlers";
import { CooldownData } from "./types/cooldown.type";
import { handleMessageUpdate } from "./commands/bits";

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = "kk";

client.once(Events.ClientReady, () => {
  console.log(
    `[ READY ] Logged in as ${client.user?.tag} (${client.user?.id})`,
  );
});

const cooldowns = new Map<string, CooldownData>();

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const trigger = args.shift()?.toLowerCase();
  if (!trigger) return;

  const command = msgCommands.get(trigger);
  if (!command) {
    console.warn(
      `[ WARN ] Unknown command: kk${trigger} (user: ${message.author.tag})`,
    );
    return;
  }

  const userId = message.author.id;
  const now = Date.now();
  const cooldownData = cooldowns.get(userId);

  if (cooldownData) {
    const timePassed = now - cooldownData.lastUsed;

    if (timePassed < cooldownData.penalty) {
      cooldownData.penalty += 3000;
      cooldownData.lastUsed = now;
      cooldowns.set(userId, cooldownData);

      const unixTime = Math.floor(
        (cooldownData.lastUsed + cooldownData.penalty) / 1000,
      );
      console.warn(
        `[ COOLDOWN ] ${message.author.tag} hit cooldown on kk${trigger} (penalty now ${cooldownData.penalty}ms)`,
      );
      await message.reply(`⏳ You can use the command again <t:${unixTime}:R>`);
      return;
    }
  }

  cooldowns.set(userId, { lastUsed: now, penalty: 3000 });

  setTimeout(() => {
    cooldowns.delete(userId);
  }, 30000);

  const startTime = Date.now();
  try {
    await command.execute(message, args.join(" "));
    const elapsed = Date.now() - startTime;
    console.log(
      `[ CMD ] kk${trigger} | ${message.author.tag} (${userId}) | ` +
        `${message.guild?.name ?? "DMs"} (${message.guild?.id ?? "DM"}) | ${elapsed}ms`,
    );
  } catch (err) {
    console.error(
      `[ ERROR ] Command "kk${trigger}" failed for ${message.author.tag}:`,
      err,
    );
    await message
      .reply("There was an error executing that command.")
      .catch(() => {});
  }
});

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  if (newMessage.partial) await newMessage.fetch();
  if (oldMessage.partial) await oldMessage.fetch();

  await handleMessageUpdate(oldMessage as Message, newMessage as Message);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const handler = buttonHandlers[interaction.customId];
  if (!handler) return;

  try {
    await handler(interaction);
  } catch (error) {
    console.error(
      `[ ERROR ] Failed to handle button "${interaction.customId}":`,
      error,
    );
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
