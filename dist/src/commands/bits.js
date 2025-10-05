"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessageUpdate = handleMessageUpdate;
const utils_1 = require("../utils/utils");
const ytPromo_1 = require("../utils/ytPromo");
const karuta_bits_1 = require("../utils/karuta-bits");
const userBitsSessions = new Map();
setInterval(() => {
    const now = Date.now();
    const tenMinutesAgo = now - (10 * 60 * 1000);
    for (const [userId, session] of userBitsSessions.entries()) {
        if (session.timestamp < tenMinutesAgo) {
            userBitsSessions.delete(userId);
        }
    }
}, 10 * 60 * 1000);
exports.default = {
    triggers: ["bits"],
    async execute(message) {
        if (!message.reference)
            return;
        const repliedTo = await message.channel.messages.fetch(message.reference.messageId);
        if (!repliedTo)
            return;
        if (!repliedTo.author.bot || repliedTo.author.id !== utils_1.Karuta)
            return;
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
                embeds: [(0, karuta_bits_1.NotTriggeredByYouBits)(), ytEmbed],
                components: [ytButton],
            });
            return;
        }
        const embed = repliedTo.embeds[0];
        if (!embed?.description && !embed?.fields.length) {
            await message.reply({
                embeds: [(0, karuta_bits_1.NoBitsFound)(), ytEmbed],
                components: [ytButton]
            });
            return;
        }
        const userId = message.author.id;
        const pageData = parseBitsFromEmbed(embed);
        const paginationInfo = parsePaginationInfo(embed.footer?.text || "");
        const args = message.content.split(' ');
        let ratio = null;
        if (args.length > 1) {
            const ratioInput = args[1];
            const parsedRatio = parseInt(ratioInput);
            if (isNaN(parsedRatio) || parsedRatio <= 0) {
                await message.reply({
                    embeds: [(0, karuta_bits_1.InvalidInput)(), ytEmbed],
                    components: [ytButton]
                });
                return;
            }
            ratio = parsedRatio;
        }
        let userSession = userBitsSessions.get(userId);
        if (!userSession) {
            userSession = {
                bits: new Map(),
                username: pageData.username,
                userId: userId,
                totalBits: 0,
                currentPage: paginationInfo.currentPage,
                totalPages: paginationInfo.totalPages,
                timestamp: Date.now(),
                isComplete: false,
                ratio: ratio || undefined
            };
            userBitsSessions.set(userId, userSession);
        }
        else {
            if (ratio) {
                userSession.ratio = ratio;
            }
        }
        for (const [bitName, quantity] of pageData.bits) {
            if (!userSession.bits.has(bitName)) {
                userSession.bits.set(bitName, quantity);
                userSession.totalBits += quantity;
            }
        }
        userSession.currentPage = paginationInfo.currentPage;
        userSession.timestamp = Date.now();
        const isLastPage = paginationInfo.currentPage >= paginationInfo.totalPages;
        const summaryText = userSession.ratio ?
            createRatioSummaryText(userSession, userSession.ratio, isLastPage) :
            createFinalBitsSummaryText(userSession, isLastPage);
        if (!isLastPage) {
            if (userSession.lastMessageId) {
                try {
                    const prevMsg = await message.channel.messages.fetch(userSession.lastMessageId);
                    await prevMsg.edit({
                        content: summaryText,
                        embeds: [ytEmbed],
                        components: [ytButton]
                    });
                }
                catch (err) {
                    console.error("Failed to edit previous message:", err);
                }
            }
            else {
                const sent = await message.reply({
                    content: summaryText,
                    embeds: [ytEmbed],
                    components: [ytButton]
                });
                userSession.lastMessageId = sent.id;
            }
            return;
        }
        userSession.isComplete = true;
        if (userSession.lastMessageId) {
            try {
                const prevMsg = await message.channel.messages.fetch(userSession.lastMessageId);
                await prevMsg.edit(summaryText);
            }
            catch (err) {
                console.error("Failed to edit final message:", err);
                await message.reply(summaryText);
            }
        }
        else {
            await message.reply(summaryText);
        }
        setTimeout(() => {
            userBitsSessions.delete(userId);
        }, 30000);
    },
};
async function handleMessageUpdate(oldMessage, newMessage) {
    if (!newMessage.author.bot || newMessage.author.id !== utils_1.Karuta)
        return;
    if (!newMessage.embeds[0]?.description?.includes('Bits carried by'))
        return;
    const embed = newMessage.embeds[0];
    const paginationInfo = parsePaginationInfo(embed.footer?.text || "");
    const userId = newMessage.mentions.users.first()?.id ||
        newMessage.embeds[0]?.description?.match(/<@!?(\d+)>/)?.[1];
    if (!userId)
        return;
    const userSession = userBitsSessions.get(userId);
    if (!userSession || userSession.isComplete)
        return;
    if (paginationInfo.currentPage > userSession.currentPage) {
        const pageData = parseBitsFromEmbed(embed);
        for (const [bitName, quantity] of pageData.bits) {
            if (!userSession.bits.has(bitName)) {
                userSession.bits.set(bitName, quantity);
                userSession.totalBits += quantity;
            }
        }
        userSession.currentPage = paginationInfo.currentPage;
        userSession.timestamp = Date.now();
        const isLastPage = paginationInfo.currentPage >= paginationInfo.totalPages;
        const summaryText = userSession.ratio ?
            createRatioSummaryText(userSession, userSession.ratio, isLastPage) :
            createFinalBitsSummaryText(userSession, isLastPage);
        if (isLastPage) {
            userSession.isComplete = true;
            if (userSession.lastMessageId) {
                try {
                    const prevMsg = await newMessage.channel.messages.fetch(userSession.lastMessageId);
                    await prevMsg.edit(summaryText);
                }
                catch (err) {
                    console.error("Failed to edit final message:", err);
                    await newMessage.channel.send(summaryText);
                }
            }
            else {
                await newMessage.channel.send(summaryText);
            }
            setTimeout(() => {
                userBitsSessions.delete(userId);
            }, 30000);
        }
        else {
            if (userSession.lastMessageId) {
                try {
                    const prevMsg = await newMessage.channel.messages.fetch(userSession.lastMessageId);
                    await prevMsg.edit(summaryText);
                }
                catch (err) {
                    console.error("Failed to edit progress message:", err);
                }
            }
            else {
                const sent = await newMessage.channel.send(summaryText);
                userSession.lastMessageId = sent.id;
            }
        }
    }
}
function parsePaginationInfo(footerText) {
    const match = footerText.match(/Showing bits (\d+)–(\d+) of (\d+)/);
    if (match) {
        const end = parseInt(match[2]);
        const total = parseInt(match[3]);
        const itemsPerPage = 10;
        const currentPage = Math.ceil(end / itemsPerPage);
        const totalPages = Math.ceil(total / itemsPerPage);
        return { currentPage, totalPages };
    }
    return { currentPage: 1, totalPages: 1 };
}
function parseBitsFromEmbed(embed) {
    const bits = new Map();
    let username = "Unknown User";
    const description = embed.description || "";
    const usernameMatch = description.match(/Bits carried by <@!?(\d+)>/);
    if (usernameMatch) {
        username = `<@${usernameMatch[1]}>`;
    }
    else {
        const altUsernameMatch = description.match(/Bits carried by @([^\n]+)/);
        if (altUsernameMatch) {
            username = altUsernameMatch[1].trim();
        }
    }
    const lines = description.split('\n').filter((line) => line.trim());
    for (const line of lines) {
        const bitMatch = line.match(/◾\s+\*\*([\d,]+)\*\*\s+·\s+`([^`]+)`\s+·\s+\*([^\*]+)\*/);
        if (bitMatch) {
            const quantity = parseInt(bitMatch[1].replace(/,/g, ''));
            const bitName = bitMatch[3].trim().toLowerCase();
            if (!isNaN(quantity)) {
                bits.set(bitName, quantity);
            }
        }
    }
    return { bits, username };
}
function createFinalBitsSummaryText(session, isLastPage = false) {
    const bitsArray = Array.from(session.bits.entries())
        .sort(([, quantityA], [, quantityB]) => quantityB - quantityA);
    const bitsString = bitsArray.map(([bitName, quantity]) => `${quantity.toLocaleString().replace(/,/g, '')} ${bitName}`).join(', ');
    const totalMorphs = session.bits.size;
    const combinedMorphs = Math.floor(session.totalBits / 250);
    let text = `${bitsString}\n\n**${session.totalBits.toLocaleString().replace(/,/g, '')}** bits ${session.username} (**${totalMorphs}** total morphs | \`${session.totalBits}/250=${combinedMorphs}\` combined morphs)`;
    if (!isLastPage) {
        text = `👉 **Move to the next page to calculate that as well.**\n\n${bitsString}\n\n**${session.totalBits.toLocaleString().replace(/,/g, '')}** bits ${session.username} (**${totalMorphs}** total morphs | \`${session.totalBits}/250=${combinedMorphs}\` combined morphs)`;
    }
    return text;
}
function createRatioSummaryText(session, ratio, isLastPage = false) {
    const bitsArray = Array.from(session.bits.entries())
        .sort(([, quantityA], [, quantityB]) => quantityB - quantityA);
    if (!isLastPage) {
        const bitsString = bitsArray.map(([bitName, quantity]) => `${quantity.toLocaleString().replace(/,/g, '')} ${bitName}`).join(', ');
        return `👉 **Move to the next page to calculate ratio properly.**\n\n**Current Progress:**\n${bitsString}\n\n**Total Bits so far:** ${session.totalBits.toLocaleString()}\n**Ratio:** ${ratio}`;
    }
    const totalBits = session.totalBits;
    const tickets = Math.floor(totalBits / ratio);
    const ratioAmount = tickets * ratio;
    const remainingBits = totalBits - ratioAmount;
    const adjustedBits = new Map(session.bits);
    let bitsToSubtract = remainingBits;
    for (const [bitName, quantity] of bitsArray) {
        if (bitsToSubtract <= 0)
            break;
        if (quantity >= bitsToSubtract) {
            adjustedBits.set(bitName, quantity - bitsToSubtract);
            bitsToSubtract = 0;
        }
        else {
            adjustedBits.set(bitName, 0);
            bitsToSubtract -= quantity;
        }
    }
    const adjustedBitsArray = Array.from(adjustedBits.entries())
        .filter(([, quantity]) => quantity > 0)
        .sort(([, quantityA], [, quantityB]) => quantityB - quantityA);
    const bitsString = adjustedBitsArray.map(([bitName, quantity]) => `${quantity.toLocaleString().replace(/,/g, '')} ${bitName}`).join(', ');
    return `**Total Bits:** ${totalBits.toLocaleString()}\n**Ratio:** ${ratio}\n**Ratio Amount:** ${ratioAmount.toLocaleString()}\n\nselling **${ratioAmount.toLocaleString()}** bits for ${tickets} :tickets:\n${bitsString}`;
}
