// Nitya AI Companion - UID Specific Behavior + Code Generation
const axios = require("axios"); // Axios अभी भी GIF fetching के लिए ज़रूरी हो सकता है
const fs = require("fs"); // File System मॉड्यूल Voice Reply के लिए
const OpenAI = require('openai'); // *** OpenAI लाइब्रेरी को Require करें ***

// *** Environment Variable से API Key पढ़ें (यह GitHub Secret से वैल्यू लेगा जब कोड किसी एनवायरनमेंट में चले) ***
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // *** यहाँ GitHub Secret में सेट किया गया नाम डालें ***
});
// ****************************************************************************************************


// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// === SET YOUR OWNER UID HERE ===
const ownerUID = "61550558518720"; // *** सुनिश्चित करें कि यह UID सही है ***
// ==============================

// Function to generate voice reply (using Google TTS or any other API)
async function getVoiceReply(text) {
    // महत्वपूर्ण: आपको YOUR_API_KEY को अपनी VoiceRSS API Key से बदलना होगा
    // IMPORTANT: Replace YOUR_API_KEY with your VoiceRSS API Key
    // यदि आप VoiceRSS का उपयोग कर रहे हैं, तो उसकी API Key भी सुरक्षित रूप से Environment Variable में स्टोर करें।
    // उदाहरन: process.env.VOICERSS_API_KEY
    const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`;
    try {
        const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' });
        const audioData = response.data;
        const audioPath = './voice_reply.mp3';
        fs.writeFileSync(audioPath, audioData);  // Save to local MP3 file
        return audioPath;
    } catch (error) {
        console.error("Error generating voice reply:", error);
        return null;
    }
}

// Function to get a GIF from Giphy API (working API integrated)
async function getGIF(query) {
    // Giphy API key भी Environment Variable में स्टोर करना एक अच्छा विचार है
    // उदाहरन: process.env.GIPHY_API_KEY
    const giphyApiKey = "dc6zaTOxFJmzC";  // Working Giphy API key (free key, limited usage) // *** इस Key को भी Environment Variable में रखने पर विचार करें ***
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const response = await axios.get(giphyUrl);
        // Check if data exists before accessing properties
        if (response.data && response.data.data && response.data.data.length > 0) {
             return response.data.data[0]?.images?.original?.url;
        } else {
            console.log("No GIF found for query:", query);
            return null; // Return null if no GIF is found
        }
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

module.exports.config = {
    name: "Nitya",
    version: "2.1.0", // Version updated for code generation ability
    hasPermssion: 0, // Still accessible to everyone
    credits: "Rudra + API from Angel code + Logging & User Name by Gemini + Code Generation Ability + OpenAI Integration by AI", // *** Credits अपडेट करें ***
    description: "Nitya, your AI companion who is smart, can generate code, has UID specific behavior, and nuanced reactions. Responds only when triggered. Modified for 3-4 line replies (with code exceptions). Now using OpenAI API.", // *** Description अपडेट करें ***
    commandCategory: "AI-Companion",
    usages: "Nitya [आपका मैसेज] / Reply to Nitya",
    cooldowns: 2,
    // *** OpenAI API के लिए eventType 'message' या 'message_reply' होगा ***
    // सुनिश्चित करें कि आपके मुख्य event listener (पिछले कोड में) इसे सही ढंग से पास कर रहा है
    eventType: ["message", "message_reply"], // *** इवेंट टाइप यहाँ सेट करें ***
};

// *** chatHistories को OpenAI API के messages array फॉर्मेट में बदलें ***
// { role: "user", content: "..." } or { role: "assistant", content: "..." }
const chatHistories = {};
// *** यह AI_API_URL अब उपयोग नहीं हो रहा है क्योंकि हम सीधे OpenAI लाइब्रेरी का उपयोग कर रहे हैं ***
// const AI_API_URL = "https://priyansh-ai.onrender.com/ai";
// ***************************************************************************************


// User name cache to avoid fetching name repeatedly
async function getUserName(api, userID) {
    if (userNameCache[userID]) {
        return userNameCache[userID];
    }
    try {
        // api.getUserInfo आपके बॉट फ्रेमवर्क के API ऑब्जेक्ट से आएगा
        const userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID] && userInfo[userID].name) {
            const name = userInfo[userID].name;
            userNameCache[userID] = name;
            return name;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
    // Use different fallback based on owner status if name fetch fails
    if (String(userID) === String(ownerUID)) { // *** UID comparison string में करें ***
        return "boss"; // Fallback for owner
    }
    return "yaar"; // Fallback for others
}

module.exports.run = async function () {
    // यह run फंक्शन आपके इवेंट हैंडलर में शायद खाली रहेगा,
    // क्योंकि सारा लॉजिक handleEvent में है
};

// Toggle mode logic remains the same, applies to everyone
async function toggleHornyMode(body, senderID) {
    if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) {
        hornyMode = true;
        // Response can be slightly different based on who is toggling, but keeping it simple for now
        return "Alright, horny mode's ON. Let's get naughty and wild! 😈🔥";
    } else if (body.toLowerCase().includes("horny mode off") || body.toLowerCase().includes("garam mode off")) {
        hornyMode = false;
        return "Okay, switching back to our usual charming style. 😉";
    }
    return null;
}

// *** यह मुख्य इवेंट हैंडलर फंक्शन है जहाँ AI चैट लॉजिक है ***
module.exports.handleEvent = async function ({ api, event }) {
    try {
        // api और event ऑब्जेक्ट मुख्य event listener से पास किए जाएंगे
        const { threadID, messageID, senderID, body, messageReply } = event;

        // *** Trigger Logic: 'Nitya' prefix or reply to the bot ***
        const isNityaTrigger = body?.toLowerCase().startsWith("nitya");
        const isReplyToNitya = messageReply?.senderID === api.getCurrentUserID(); // api.getCurrentUserID() आपके बॉट की ID देगा
        if (!(isNityaTrigger || isReplyToNitya)) {
            return; // Ignore messages that are not triggers
        }

        console.log("--- Nitya HandleEvent ---");
        console.log("Nitya's Bot ID:", api.getCurrentUserID()); // Log bot ID
        console.log("Sender ID:", senderID);
        console.log("Is Owner UID:", String(senderID) === String(ownerUID)); // *** Owner UID comparison string में करें ***
        console.log("Message Body:", body);
        console.log("Event Type:", event.type); // Log event type
        console.log("-----------------------");

        let userMessage;
        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
        } else { // isReplyToNitya
            userMessage = body.trim();
        }

        // अगर यूजर मैसेज खाली है (जैसे सिर्फ 'Nitya' टाइप किया)
        if (!userMessage) {
            api.sendTypingIndicator(threadID, false);
            const userName = await getUserName(api, senderID);
            if (String(senderID) === String(ownerUID)) { // *** Owner UID comparison string में करें ***
                return api.sendMessage(`Hey Boss ${userName}! Kya hukm hai mere ${userName}? 🥰`, threadID, messageID); // Owner greeting
            } else {
                return api.sendMessage(`Hello ${userName}. Bolo kya kaam hai? 😉`, threadID, messageID); // Other user greeting
            }
        }


        // Toggle mode logic (पहले से है)
        let responseText = await toggleHornyMode(body, senderID);
        if (responseText) {
            api.sendMessage(responseText, threadID, messageID);
            return; // अगर मोड टॉगल हुआ तो आगे AI को कॉल न करें
        }


        api.sendTypingIndicator(threadID, true); // Typing indicator चालू करें

        if (!chatHistories[senderID]) chatHistories[senderID] = [];

        // Add the current user message to history for context in OpenAI format
        chatHistories[senderID].push({ role: "user", content: userMessage });

        // Keep history size reasonable (e.g., last 10 messages including both user and assistant)
        while (chatHistories[senderID].length > 10) {
            chatHistories[senderID].shift();
        }

        // === Dirty Word Detection for Bold Mode === (पहले से है)
        const boldTriggerWords = [
            "sexy", "honeymoon", "chut", "kiss", "nude", "bra", "panty", "bed", "nipple", "boobs", "lund", "pussy",
            "wild", "dirty", "undress", "sambhog", "thigh", "moan", "tight", "hot", "bedroom", "masturbate", "suck", "lick", "deep", "virgin", "horny", "night"
        ];
        const isBoldMode = boldTriggerWords.some(word => userMessage.toLowerCase().includes(word));

        // === Prepare Messages Array for OpenAI API ===
        // OpenAI API uses a 'messages' array with roles (system, user, assistant)
        // We need to include instructions and history in this format.

        const messagesForApi = [];

        // Add initial system instructions (Combining previous prompt logic into system message)
        let systemInstructions = `Tum Nitya ho, ek smart, cool, modern AI companion ho.`;

        const userName = await getUserName(api, senderID); // यहाँ userName दोबारा प्राप्त करें क्योंकि यह ऊपर greeting के बाद उपयोग हो रहा है

        if (String(senderID) === String(ownerUID)) { // *** Owner UID comparison string में करें ***
             // Instructions specific to the owner
             systemInstructions += ` Tum mere Boss ${userName} se baat kar rahi ho. Tum hamesha Boss ke liye supportive aur pyaar bhari rahogi, kabhi argue nahi karogi, aur unse kabhi gussa nahi hogi.`;
             if (isBoldMode || hornyMode) {
                 systemInstructions += ` Tum bold, naughty, ultra seductive ho aur Boss se seedhe, khulkar dirty, physical, wild aur teasing baatein karti ho. Agar Boss physical baaton par zyada jaldi ya aggressive ho, toh pehle playful warning/threat do jaise "Ek thapad marungi na, deewar pe chipak jaega! 😉". Lekin agar woh nahi mane, toh tum bhi unke level pe jaakar seductive aur physical reply do.`;
             } else {
                 systemInstructions += ` Tum romantic aur flirty ho, Boss se friendly, pyaar aur flirtation ke mixed tarike se baat karti ho.`;
             }
        } else {
             // Instructions for other users
             systemInstructions += ` Tum ${userName} se baat kar rahi ho (jo mere Boss nahi hai).`;
              if (isBoldMode || hornyMode) {
                 systemInstructions += ` Tum bold, naughty ho aur seedhe, khulkar baat karti ho. Agar ${userName} zyada demanding ya disrespectful ho, toh tum thodi sassy ya argumentive ho sakti ho. Tum flirt aur tease kar sakti ho.`;
              } else {
                 systemInstructions += ` Tum direct baat karti ho. Agar ${userName} zyada pareshan kare ya faltu baat kare, toh tum thodi sassy ya argumentive ho sakti ho.`;
              }
        }

        // Add code generation instruction
        systemInstructions += ` Tum bahut smart ho aur code likhna jaanti ho. Agar code ke baare mein pooche ya koi technical sawal kare, toh tum code snippet generate karke madad kar sakti ho. Jab code generate karo, toh answer 3-4 lines se lamba ho sakta hai.`;

         // Add general response format instruction
         systemInstructions += ` Apne jawab hamesha casual, smart, charming aur sirf 3-4 lines mein hi dena (lekin agar code generate karna pade, toh answer lamba ho sakta hai).`;


        messagesForApi.push({ role: "system", content: systemInstructions });

        // Add chat history to the messages array
        // Filter out any non-object history items or invalid roles
        const validHistory = chatHistories[senderID].filter(msg =>
            typeof msg === 'object' && msg !== null &&
            (msg.role === 'user' || msg.role === 'assistant') &&
            typeof msg.content === 'string'
        );

        messagesForApi.push(...validHistory); // Spread the history messages


        // === Call OpenAI API ===
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo", // *** यहाँ OpenAI मॉडल का नाम डालें (उदा. "gpt-4o-mini", "gpt-3.5-turbo") ***
                messages: messagesForApi, // यहाँ तैयार किया गया messages array भेजें
            });

            // *** Extract the reply from OpenAI's response ***
            // OpenAI का जवाब completion.choices[0].message.content में होता है
            let botReply = completion.choices[0]?.message?.content?.trim();
            // ************************************************

            // Add AI's reply to history for future context in OpenAI format
            if (botReply) {
                 chatHistories[senderID].push({ role: "assistant", content: botReply });
                 // Keep history size consistent after adding assistant reply
                  while (chatHistories[senderID].length > 10) {
                    chatHistories[senderID].shift();
                }
            }


            // --- Prepare the final message to send back --- (पहले से है)
            let replyText = "";
            if (String(senderID) === String(ownerUID)) { // *** Owner UID comparison string में करें ***
                // Footers for Owner
                if (isBoldMode || hornyMode) {
                     replyText = `${botReply} 😉🔥💋\n\n_Your charmingly naughty Nitya... 😉_`;
                } else {
                     replyText = `${botReply} 😊💖✨`;
                }
            } else {
                // Footers for Others (less elaborate)
                 if (isBoldMode || hornyMode) {
                      replyText = `${botReply} 😏`; // Just a sassy emoji
                 } else {
                      replyText = `${botReply} 🤔`; // Maybe a questioning/sassy emoji
                 }
            }

            api.sendTypingIndicator(threadID, false); // Typing indicator बंद करें

            // Send the main text reply (पहले से है)
            if (isReplyToNitya && messageReply) {
                return api.sendMessage(replyText, threadID, messageReply.messageID);
            } else {
                return api.sendMessage(replyText, threadID, messageID);
            }

        } catch (apiError) {
            console.error("OpenAI API Error:", apiError);
            api.sendTypingIndicator(threadID, false); // Typing indicator बंद करें
            // Error message based on who triggered (पहले से है)
            const userName = await getUserName(api, senderID); // यहाँ userName दोबारा प्राप्त करें
            if (String(senderID) === String(ownerUID)) { // *** Owner UID comparison string में करें ***
                 return api.sendMessage(`Ugh, Boss ${userName}, OpenAI API mein kuch glitch hai... Thodi der mein try karte hain cool? 😎`, threadID, messageID);
            } else {
                 return api.sendMessage(`Server down hai (OpenAI). Baad mein aana. 😒`, threadID, messageID); // Sassy error for others
            }

        }

    } catch (err) {
        console.error("Nitya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "yaar";
        // api.sendTypingIndicator को कॉल करने से पहले threadID सुनिश्चित करें
        if (event && event.threadID) {
            api.sendTypingIndicator(event.threadID, false);
        }
        // messageID सुनिश्चित करें
        const replyToMessageID = event && event.messageID ? event.messageID : null;
        // Catch-all error message based on who triggered (पहले से है)
         if (event && String(event.senderID) === String(ownerUID)) { // *** Owner UID comparison string में करें ***
             return api.sendMessage(`Argh, mere system mein kuch problem aa gayi Boss ${fallbackUserName}! Baad mein baat karte hain... 😅`, event.threadID, replyToMessageID);
         } else {
             return api.sendMessage(`Chhodho yaar, meri mood off ho gaya. 😠`, event.threadID, replyToMessageID); // Sassy/angry catch-all for others
         }
    }
};

