"use strict";

const INTERVAL = 15000;
let running = {};

module.exports = {
  config: {
    name: "kss15",
    aliases: [],
    version: "1.0.0",
    author: "Neoaz",
    category: "fun",
    cooldown: 2,
    role: 0,
    noPrefix: true
  },

  onStart: async function ({ message, event, api, args }) {
    const threadID = event.threadID;
    const command = (args[0] || "").toLowerCase();

    if (command === "stop") {
      if (running[threadID]) {
        clearInterval(running[threadID]);
        delete running[threadID];
        return message.reply("⛔ تم إيقاف kss15.");
      }

      return message.reply("ℹ️ ما كاين حتى kss15 خدام.");
    }

    const reply = event.messageReply;

    if (!reply || !reply.attachments?.length) {
      return message.reply("📸 رد على صورة وكتب kss15");
    }

    const photo = reply.attachments.find(
      a => a.type === "photo" && a.url
    );

    if (!photo) {
      return message.reply("❌ خاصك ترد على صورة.");
    }

    if (running[threadID]) {
      return message.reply("⚠️ kss15 راه خدام.\nكتب: kss15 stop");
    }

    running[threadID] = setInterval(async () => {
      try {
        const stream =
          await global.utils.getStreamFromURL(photo.url);

        await api.sendMessage(
          { attachment: stream },
          threadID
        );
      } catch (error) {
        // ما نوقفوش بسبب خطأ عابر
      }
    }, INTERVAL);

    return message.reply(
      "✅ kss15 خدام\n" +
      "📸 صورة كل 15 ثانية\n" +
      "⛔ للإيقاف: kss15 stop"
    );
  }
};
