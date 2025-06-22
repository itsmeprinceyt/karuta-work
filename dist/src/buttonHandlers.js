"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonHandlers = void 0;
const utils_1 = require("./utils/utils");
exports.buttonHandlers = {
    get_invite_link: async (interaction) => {
        await interaction.reply({
            content: `${utils_1.DISCORD_BOT_INVITE_LINK}`,
            flags: 64,
        });
    },
};
