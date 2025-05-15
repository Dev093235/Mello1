const ytdl = require('ytdl-core'); // YouTube डाउनलोड के लिए
const fs = require('fs-extra'); // फ़ाइल हैंडलिंग के लिए
const path = require('path'); // पाथ बनाने के लिए
const axios = require('axios'); // URL से कुछ भी डाउनलोड करने के लिए (अगर YouTube नहीं है)

module.exports = {
    config: {
        name: "getvideo", // कमांड का नाम (जैसे !getvideo)
        version: "1.0.0",
        hasPermssion: 0, // 0: कोई भी उपयोग कर सकता है, 1: ग्रुप एडमिन, 2: NDH, 3: बॉट एडमिन
        credits: "आपका नाम", // अपना नाम यहाँ लिखें
        description: "वेबसाइट का लिंक भेजता है या वीडियो डाउनलोड/भेजने की कोशिश करता है।",
        commandCategory: "मीडिया", // कमांड की कैटेगरी
        usages: "https://pathokbd.com/article/4714/", // उपयोग कैसे करें
        cooldowns: 5, // कमांड के बीच कूलडाउन (सेकंड में)
        dependencies: { // इस कमांड के लिए ज़रूरी dependencies (ये package.json में होने चाहिए)
            "ytdl-core": "^4.11.2", // सुनिश्चित करें कि version package.json से मेल खाता हो
            "fs-extra": "^10.1.0",
            "axios": "^0.26.1"
        }
    },

    run: async ({ api, event, args }) => {
        const input = args.join(" "); // कमांड के बाद यूजर का पूरा इनपुट

        if (!input) {
            return api.sendMessage("कृपया वेबसाइट का URL या वीडियो URL दें।", event.threadID, event.messageID);
        }

        // अगर इनपुट एक URL जैसा दिखता है
        if (input.startsWith('http://') || input.startsWith('https://')) {
            const url = input;

            // सीधे URL भेजें ताकि Messenger प्रीव्यू दिखा सके
            api.sendMessage(`यह लिंक: ${url}`, event.threadID, event.messageID);

            // वीडियो डाउनलोड करने की कोशिश करें अगर यह YouTube URL है
            if (url.includes("youtube.com") || url.includes("youtu.be")) {
                try {
                    api.sendMessage("वीडियो डाउनलोड करने की कोशिश कर रहा हूँ, कृपया प्रतीक्षा करें...", event.threadID, event.messageID);

                    const videoId = ytdl.getURLVideoID(url);
                    const info = await ytdl.getInfo(videoId);
                    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' }); // आप क्वालिटी चुन सकते हैं

                    if (!format) {
                         return api.sendMessage("YouTube वीडियो फॉर्मेट नहीं मिला।", event.threadID, event.messageID);
                    }

                    const videoPath = path.join(__dirname, 'cache', `${videoId}.mp4`); // cache फोल्डर में सेव करें

                    // स्ट्रीम को फ़ाइल में पाइप करें
                    const videoStream = ytdl(url, { format: format });
                    const writeStream = fs.createWriteStream(videoPath);

                    videoStream.pipe(writeStream);

                    writeStream.on('finish', async () => {
                        console.log(`Downloaded ${videoPath}`);

                        // चेक करें कि फ़ाइल बहुत बड़ी तो नहीं है Messenger के लिए
                        const fileSize = fs.statSync(videoPath).size; // बाइट्स में साइज़
                        const maxMessengerSize = 25 * 1024 * 1024; // उदाहरण: 25 MB (यह वास्तविक लिमिट से भिन्न हो सकती है)

                        if (fileSize > maxMessengerSize) {
                            api.sendMessage(`वीडियो डाउनलोड हो गया लेकिन फ़ाइल बहुत बड़ी है (${(fileSize / (1024*1024)).toFixed(2)} MB) इसे सीधे Messenger में भेजने के लिए। कृपया मूल लिंक से देखें: ${url}`, event.threadID, event.messageID);
                             fs.unlink(videoPath).catch(e => console.error("Error deleting large file:", e)); // बड़ी फ़ाइल डिलीट करें
                        } else {
                            // फ़ाइल को Messenger में भेजें
                            try {
                                api.sendMessage({
                                    body: "यह डाउनलोड किया गया वीडियो:",
                                    attachment: fs.createReadStream(videoPath)
                                }, event.threadID, async (err, messageInfo) => {
                                    // फ़ाइल भेजने के बाद उसे डिलीट कर दें ताकि स्पेस बचे
                                    fs.unlink(videoPath).catch(e => console.error("Error deleting file:", e));
                                    if (err) {
                                        console.error("Error sending video:", err);
                                        api.sendMessage("वीडियो भेजने में एरर हुई।", event.threadID, event.messageID);
                                    } else {
                                         console.log(`Video sent with message ID ${messageInfo.messageID}`);
                                    }
                                });
                            } catch (e) {
                                 console.error("Error creating read stream or sending message:", e);
                                 api.sendMessage("वीडियो फ़ाइल को प्रोसेस करने में एरर हुई।", event.threadID, event.messageID);
                                 fs.unlink(videoPath).catch(e => console.error("Error deleting file after send error:", e)); // एरर पर भी डिलीट करें
                            }
                        }
                    });

                    writeStream.on('error', (err) => {
                        console.error("Error writing video stream:", err);
                         api.sendMessage("वीडियो डाउनलोड करने में एरर हुई। स्ट्रीम एरर।", event.threadID, event.messageID);
                         // एरर पर फ़ाइल डिलीट करने की कोशिश करें अगर बन रही थी
                         fs.unlink(videoPath).catch(e => console.error("Error deleting file after stream error:", e));
                    });

                } catch (error) {
                    console.error("Error downloading or processing YouTube video:", error);
                    api.sendMessage(`YouTube वीडियो डाउनलोड करने या प्रोसेस करने में एरर हुई: ${error.message}`, event.threadID, event.messageID);
                }
            } else {
                 // अगर यह YouTube नहीं है, तो सीधे लिंक भेजें
                 api.sendMessage("फिलहाल मैं सिर्फ़ YouTube वीडियो डाउनलोड करने की कोशिश कर सकता हूँ। यहाँ मूल लिंक है:", event.threadID, event.messageID);
                 api.sendMessage(url, event.threadID, event.messageID);

                 // आप यहाँ axios का उपयोग करके अन्य प्रकार के फ़ाइल डाउनलोड करने का प्रयास कर सकते हैं,
                 // लेकिन यह बहुत जटिल हो सकता है और हर वेबसाइट के लिए काम नहीं करेगा।
            }

        } else {
            // अगर इनपुट URL नहीं है, तो इसे सर्च क्वेरी मान सकते हैं
            // आप यहाँ googlethis dependency का उपयोग कर सकते हैं
            // const google = require('googlethis');
            // try {
            //     const searchResults = await google.search(input);
            //     let replyMsg = `सर्च रिजल्ट्स "${input}" के लिए:\n\n`;
            //     searchResults.results.slice(0, 5).forEach((result, i) => {
            //         replyMsg += `${i + 1}. ${result.title}\n${result.url}\n\n`;
            //     });
            //     api.sendMessage(replyMsg, event.threadID, event.messageID);
            // } catch (e) {
            //      console.error("Google search error:", e);
            //      api.sendMessage("सर्च करने में एरर हुई।", event.threadID, event.messageID);
            // }
             api.sendMessage(`"${input}" के लिए सीधे URL या वीडियो लिंक दें। सर्च फंक्शन अभी लागू नहीं है।`, event.threadID, event.messageID);
        }
    }
};
