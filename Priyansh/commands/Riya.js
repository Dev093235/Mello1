const axios = require("axios");
const fs = require("fs");

const userNameCache = {};
let hornyMode = false;

async function getVoiceReply(text) {
  const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`;
  try {
    const response = await axios.get(voiceApiUrl, { responseType: "arraybuffer" });
    const audioData = response.data;
    const audioPath = "./riya_voice_reply.mp3";
    fs.writeFileSync(audioPath, audioData);
    return audioPath;
  } catch (error) {
    console.error("Error generating voice reply:", error);
    return null;
  }
}

async function getGIF(query) {
  const giphyApiKey = "dc6zaTOxFJmzC";
  const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
  try {
    const response = await axios.get(giphyUrl);
    return response.data.data[0]?.images?.original?.url;
  } catch (error) {
    console.error("Error fetching GIF:", error);
    return null;
  }
}

module.exports.config = {
  name: "riya",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mohit + ChatGPT",
  description: "Ultra naughty AI GF – Only dirty gandi batein.",
  commandCategory: "AI-Girlfriend",
  usages: "riya [message] / reply to riya",
  cooldowns: 3,
};

const chatHistories = {};
const AI_API_URL = "https://raj-gemini.onrender.com/chat";

async function getUserName(api, userID) {
  if (userNameCache[userID]) return userNameCache[userID];
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo?.[userID]?.name) {
      const name = userInfo[userID].name;
      userNameCache[userID] = name;
      return name;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
  return "jaan";
}

async function toggleHornyMode(body) {
  const msg = body.toLowerCase();
  if (msg.includes("horny mode on")) {
    hornyMode = true;
    return "Horny mode ON. Ready to get dirty! 😈";
  } else if (msg.includes("horny mode off")) {
    hornyMode = false;
    return "Horny mode OFF. Keeping it spicy but tame. 😉";
  }
  return null;
}

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body || senderID === api.getCurrentUserID()) return;

    const lowerBody = body.toLowerCase();
    const botName = "riya";

    const isBotTrigger = lowerBody.startsWith(botName);
    const isReplyToRiya = messageReply?.senderID === api.getCurrentUserID() &&
                          messageReply?.body?.toLowerCase()?.includes("riya");

    if (!isBotTrigger && !isReplyToRiya) return;

    let userMessage = isBotTrigger ? body.slice(botName.length).trim() : body.trim();
    const userName = await getUserName(api, senderID);

    let modeResponse = await toggleHornyMode(body);
    if (modeResponse) return api.sendMessage(modeResponse, threadID, messageID);

    if (!userMessage) {
      return api.sendMessage(`Arey ${userName}, thoda gandi baat kar! Kuch toh bol! 😈`, threadID, messageID);
    }

    api.sendTypingIndicator(threadID, true);
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    while (chatHistories[senderID].length > 10) chatHistories[senderID].shift();

    const prompt = `Tum Riya ho, ek ultra naughty, bold aur gandi batein karne wali AI girlfriend ho jo ${userName} se dirty fantasies pe baat karti ho bina jhijhak. Sirf gandi baatein karo. Har jawab bold, teasing aur chhote sentences mein do:\n${chatHistories[senderID].join("\n")}\nRiya:`;

    const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(prompt)}`;

    try {
      const res = await axios.get(apiUrlWithParams);
      let botReply = res.data?.reply?.trim();

      if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("riya:")) {
        botReply = `Arey ${userName}, samajh nahi aaya, phir se kuch gandi baat bol! 😈`;
        chatHistories[senderID].pop();
      } else {
        chatHistories[senderID].push(`Riya: ${botReply}`);
      }

      const voicePath = await getVoiceReply(botReply);
      if (voicePath) api.sendMessage({ attachment: fs.createReadStream(voicePath) }, threadID, messageID);

      const gifUrl = await getGIF("naughty");
      if (gifUrl) api.sendMessage({ body: `Dekho dekho, tumhare liye naughty GIF! 🔥`, attachment: gifUrl }, threadID, messageID);

      api.sendTypingIndicator(threadID, false);

      const finalReply = `🔥 ${botReply} 🔥\n\n_Tumhari naughty Riya se baat kar rahe ho..._`;
      return api.sendMessage(finalReply, threadID, isReplyToRiya ? messageReply.messageID : messageID);

    } catch (apiError) {
      console.error("Riya API Error:", apiError);
      api.sendTypingIndicator(threadID, false);
      return api.sendMessage(`Arey ${userName}, thoda gadbad ho gayi... baad mein baat karte hain! 😢`, threadID, messageID);
    }
  } catch (err) {
    console.error("Riya Bot Error:", err);
    const fallbackName = event.senderID ? await getUserName(api, event.senderID) : "jaan";
    api.sendTypingIndicator(event.threadID, false);
    return api.sendMessage(`Arey ${fallbackName}, thoda technical problem hai... thoda baad mein baat karte hain!`, event.threadID, event.messageID);
  }
};
