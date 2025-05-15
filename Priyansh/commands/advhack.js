const axios = require('axios'); // Required for downloading profile picture
const fs = require('fs-extra'); // Required for file handling (reading/deleting)
const path = require('path');   // Required for handling file paths

module.exports.config = {
  name: "advhack",
  version: "1.8", // Version updated
  hasPermssion: 0,
  credits: "Mohit x Rudra & Modified by Your AI (Ultimate Prank Mode - Fast)", // Added modification credit and prank context
  description: "Complete 20-30 sec FAST hacking animation (progress, fake login+pic), fake security alert DM, and final message to admin in group.", // Updated description for duration
  commandCategory: "fun",
  usages: "@user",
  cooldowns: 30, // Cooldown increased slightly for faster execution recovery
};

const adminUID = "61550558518720"; // Replace with the actual admin UID

// --- EXTREME PRANK WARNING & DISCLAIMER ---
// THIS MODULE CONTAINS FEATURES THAT SEND FAKE SECURITY ALERTS
// AND MIMIC HACKING ACTIVITY. IT IS SOLELY FOR EXTREME PRANK PURPOSES
// AND IS NOT REAL. USING THIS MAY CAUSE DISTRESS TO THE RECIPIENT.
// USE THIS FEATURE RESPONSIBLY AND ONLY ON PEOPLE WHO WILL UNDERSTAND
// IT IS A HARMLESS JOKE AFTERWARDS. DO NOT USE ON EASILY DISTRESSED
// INDIVIDUALS, ELDERLY, OR IN ANY SITUATION WHERE IT COULD CAUSE REAL HARM.
// THE CODE DOES NOT PERFORM ANY ACTUAL HACKING OR DATA BREACH.
// --- END WARNING & DISCLAIMER ---

// Separate list for general hacking simulation messages (excluding progress bars)
const generalAnimations = [
    "[ SYSINIT ] Initiating secure encrypted channel...",
    "[ NETWORK ] Scanning target subnet 192.168.1.0/24...",
    "[ TARGET ID ] Host found: 192.168.1.105 - Device: Android Mobile",
    "[ PORT SCAN ] Checking open ports on 192.168.1.105...",
    "  -> PORT 22 (SSH): OPEN",
    "  -> PORT 80 (HTTP): OPEN",
    "  -> PORT 443 (HTTPS): FILTERED",
    "  -> PORT 8080 (HTTP-Proxy): OPEN",
    "[ VULN SCAN ] Running automated vulnerability assessment...",
    "[ INFO ] Detected potential weak points on port 8080 (Proxy).",
    "[ EXPLOIT ] Loading exploit module: 'ProxyShell.py'",
    "[ ATTACK ] Executing exploit against 192.168.1.105:8080...",
    "[ STATUS ] Shell access acquired!",
    "[ SHELL ] root@target:~#",
    "[ CMD ] cat /etc/passwd",
    "root:x:0:0:root:/root:/bin/bash",
    "user:x:1000:1000::/home/user:/bin/bash",
    "[ CMD ] ls -la /home/user/",
    "drwxr-xr-x 5 user user 4096 Apr 21 00:30 .",
    "-rw------- 1 user user 1234 Apr 21 00:25 .ssh/id_rsa", // SCARY FILE
    "-rw-r--r-- 1 user user 5678 Apr 20 18:00 Documents/passwords.txt", // SCARY FILE
    "[ DATA ] Analyzing extracted data...",
    "[ EXTRACT ] Found 15 sets of login credentials.",
    "[ INJECT ] Deploying persistence mechanism: backdoor.sh @ /etc/init.d/",
    "[ PERSIST ] Adding startup script...",
    "[ NETWORK ] Setting up covert channel via DNS TXT records...",
    "[ MONITOR ] Activating keylogger and screen capture.",
    "[ CAPTURE ] Grabbing current screen buffer...",
    "[ LOGS ] Wiping system logs and shell history...",
    "[ CLEANUP ] Removing temporary files from /tmp",
    "[ STEALTH ] Obfuscating process names and network traffic.",
    "[ STATUS ] All primary objectives achieved.",
    "[ FINALIZING ] Verifying backdoor access...",
    "[ VERIFIED ] Persistent root access confirmed.",
    "[ WARNING ] User activity detected. Minimizing footprint.",
    "[ ERROR ] Failed to wipe audit logs. Manual cleanup required.",
    "[ RETRY ] Attempting log wipe using alternative method...",
    "[ SUCCESS ] Audit logs successfully cleared.",
    "[ SYSTEM ] Disconnecting all external sessions.",
    "[ COMPLETE ] Operation finished. Exiting system processes.",
    "[ STATUS ] Leaving no detectable traces.",
    "[ REPORT ] Target system: COMPROMISED. Data: EXFILTRATED. Persistence: ESTABLISHED.",
    "[ SESSION ] Closing encrypted tunnel.",
    "[ SHUTDOWN ] Core modules offline.",
    "[ IDLE ] Waiting for next command...",
    "[ ALERT BYPASS ] Security software heuristics evaded.",
    "[ DATA DUMP ] Dumping Browse history...",
    "[ ACCESS ] Gained access to internal storage.",
    "[ DECRYPT ] Attempting to decrypt encrypted files...",
    "[ FINANCIAL ] Scanning for banking app data.",
    "[ CAMERA ] Activating front camera stream...",
    "[ MICROPHONE ] Initializing audio capture...",
    "[ GEOLOCATION ] Tracking target's real-time location.",
    "[ COMMAND ] Executing `reboot` command as a diversion. (Simulation Only)",
    "[ ERROR ] Permission denied to execute reboot. Access level insufficient.",
    "[ STATUS ] Full control maintained.",
    "[ ARTIFACTS ] Deleting exploit remnants.",
    "[ COVERT ] Hiding network connections.",
    "[ ZOMBIE ] Adding target device to botnet.",
    "[ SUCCESS ] Target is now a zombie node.",
    "[ FILE ACCESS ] Reading contents of clipboard.",
    "[ SNIFFING ] Capturing local network packets.",
    "[ MALWARE ] Injecting banking Trojan...",
    "[ PHISHING ] Setting up fake login page on local network.",
    "[ WIPING ] Formatting SD card... (Simulation Only)",
    "[ IMPORTANT ] Simulation: Formatting not actually happening.",
    "[ FAKE ] Initiating self-destruct sequence... (Simulation Only)",
    "[ FAKE ] Countdown: 10... 9... 8...",
    "[ FAKE ] Simulation Aborted: Self-destruct cancelled.",
    "[ PROCESS LIST ] Analyzing running processes...",
    "[ SUSPICIOUS ] Found unknown process PID 9999...",
    "[ KILLING ] Terminating suspicious process...",
    "[ LOG ] Connection established from unknown IP 203.0.113.12.",
    "[ UPLOAD ] Uploading encrypted payload...",
    "[ CHECK ] Verifying integrity of exfiltrated data.",
    "[ SYSTEM ALERT ] Low disk space on target (Simulation).",
    "[ PROXY ] Bypassing geo-restrictions via proxy chain.",
    "[ ROOTKIT ] Installing kernel-level rootkit for deep access.",
    "[ STATUS ] Rootkit installation complete.",
    "[ RECON ] Mapping internal network topology.",
    "[ PIVOT ] Pivoting to internal network segment.",
    "[ DATA CORRUPT ] Simulating data corruption on non-critical files.",
    "[ WARNING ] Critical system file modification failed (Simulation).",
    "[ SUCCESS ] Non-critical data corrupted.",
    // Add more general messages if needed
];

// Separate list specifically for progress bar messages
const progressBarAnimations = [
  "Downloading data.zip...",
  "Uploading results to C2 server...",
  "Encrypting user data...",
  "Decrypting encrypted volume...",
  "Transferring sensitive files...",
  "[██░░░░░░░░░] 20%",
  "[████░░░░░░░] 40%",
  "[██████░░░░░] 60%",
  "[████████░░░] 80%",
  "[██████████░] 90%",
  "[███████████] 99%", // Near completion
  "Downloading config files...",
  "Uploading screenshots...",
  "Transferring database dump...",
  "[░░░░░░░░░░░] 5%", // Start
  "[████████████] 100% Complete." // Completion message
  // Add more progress messages if needed
];


module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  // Admin check - Ensure only specific user can trigger this prank
  if (senderID !== adminUID) {
    return api.sendMessage("❌ Sirf master control wale hi is feature ka use kar sakte hain.", threadID, messageID);
  }

  // Mention check - Make sure someone is mentioned for the prank target
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ Mention karo kisko hack dikhana hai! (Prank ke liye)", threadID, messageID);
  }

  // Get target info
  const targetName = Object.values(mentions)[0].replace(/@/g, ""); // Clean the name
  const targetUID = Object.keys(mentions)[0]; // Get the target's UID

  // --- Prank Timing Configuration (Modified for 20-30 seconds) ---
  const durationSeconds = 25; // Aiming for ~25 seconds total duration
  const generalIntervalTime = 150; // Send a general message every 150 milliseconds (very fast)
  const progressBarIntervalTime = 1500; // Send a progress message every 1.5 seconds

  // Calculate how many general messages are needed to fill the duration
  const maxMessages = Math.ceil(durationSeconds * 1000 / generalIntervalTime);

  // Initial prank message in the group chat
  api.sendMessage(`⚠️ Initiating HIGH-SPEED intrusion simulation on target: ${targetName} [UID: ${targetUID}]\nThis is a simulated operation for testing purposes. Duration: ~${durationSeconds} seconds.`, threadID, messageID);

  let count = 0; // Counter for overall messages sent via general interval

  // Variables to store interval IDs so we can stop them later
  let generalIntervalId;
  let progressIntervalId;

  // --- Function to send the final prank messages (DM + Group Pic/Login + Group Admin Message) ---
  const sendFinalPrankMessages = async (targetUid, threadId, messageIdForReply, targetName) => {
      // --- 1. Send Fake Security Alert DM to Target User ---
      const fakeDirectMessageText = `🚨 SECURITY ALERT 🚨\n\nआपका अकाउंट कॉम्प्रोमाइज़ हो गया है।\nआपकी आईडी और पासवर्ड Rudra जी को दे दिया गया है।\n\nकृपया तुरंत अपना पासवर्ड बदलें!`; // Fake scary Hindi text

      try {
          // Send the direct message to the target UID
          await api.sendMessage(fakeDirectMessageText, targetUid);
          console.log(`Sent fake direct message to ${targetUid} (${targetName}).`);
      } catch (dmError) {
          console.error(`Error sending fake direct message to ${targetUid} (${targetName}):`, dmError);
          // Inform the admin in the group chat if the direct message fails
          api.sendMessage(`⚠️ Warning: Failed to send fake direct message to ${targetName}. (Prank might not be fully delivered).`, threadId).catch(console.error);
      }

      // --- 2. Send Fake Login Page Message with Profile Pic in Group Chat ---
      try {
          const userInfo = await api.getUserInfo(targetUid); // Get user info using API

          // Check if user info was successfully retrieved and has a profile URL
          if (!userInfo || !userInfo[targetUid] || !userInfo[targetUid].profileUrl) {
               console.error("Could not retrieve user info or profile URL for UID:", targetUid);
               // Send a simplified final message in the group chat if profile pic fails
               api.sendMessage(`✅ Simulation for target ${targetName} complete. Operation finalized. (Could not retrieve profile info). This was a test.`, threadId).catch(console.error);
               return; // Stop here if group message with pic can't be sent
          }

          const profilePicUrl = userInfo[targetUid].profileUrl;
          const finalTargetName = userInfo[targetUid].name; // Use full name from info

          // --- Download the profile picture ---
          const imageDir = path.join(__dirname, 'cache');
          const imagePath = path.join(imageDir, `${targetUid}_profile_pic.jpg`); // Temp path

          // Ensure cache directory exists
          await fs.ensureDir(imageDir);

          const response = await axios({
              url: profilePicUrl,
              method: 'GET',
              responseType: 'stream'
          });

          const writer = fs.createWriteStream(imagePath);
          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
          });

          // --- Construct the fake login page message body ---
          const fakeLoginMessageBody =
`[ SYSTEM ] Access granted to user profile: ${finalTargetName}
[ PROFILE PIC ] Latest profile image below:

--- FAKE LOGIN INTERFACE ---
TARGET_SYSTEM_LOGIN:

Username: ${targetUid}
Password: **************

STATUS: Authenticated as ${finalTargetName}.
Last Login: Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
----------------------------
[ SYSTEM ] Simulation Complete. This was a test.`;

          // --- Send the final message with attachment in group chat ---
          // Use a callback to send the next message only after this one is sent
          api.sendMessage({
              body: fakeLoginMessageBody,
              attachment: fs.createReadStream(imagePath) // Attach the downloaded image
          }, threadId, async (err) => { // Use async callback
              // Clean up the downloaded image file after sending (and after callback)
              fs.unlink(imagePath).catch(console.error);

              if (err) {
                  console.error("Error sending final group message (pic/login page):", err);
                  // Send a simplified final message if sending pic fails
                  api.sendMessage(`✅ Simulation for target ${targetName} complete. Operation finalized. (Error sending pic/login page). This was a test.`, threadId).catch(console.error);
              } else {
                  console.log(`Sent fake login page message to thread ${threadId}.`);
                  // --- 3. Send Final Message to Admin in Group Chat (after pic/login page) ---
                  const finalMessageToAdminText = `Rudra ji, kaam ho gaya hai, login kar lo id pass aapke paas bhej diya hai.`;
                   // We need the admin's name for the mention tag. Assuming "Rudra ji" is correct based on user context.
                   const adminNameForMention = "Rudra ji"; // Hardcoded as requested by the user
                   const mentionAdmin = { tag: adminNameForMention, id: adminUID }; // Mention the admin UID

                   try {
                        // Send the message mentioning the admin
                        await api.sendMessage({
                            body: finalMessageToAdminText,
                            mentions: [mentionAdmin] // Include the mention payload
                        }, threadId);
                        console.log(`Sent final message to admin ${adminUID} in thread ${threadId}.`);
                   } catch (adminMsgError) {
                        console.error(`Error sending final message to admin ${adminUID} in thread ${threadId}:`, adminMsgError);
                        // Optional: Send a fallback text message without mention if mention fails
                        api.sendMessage(`✅ Simulation complete. Admin (${adminUID}), kaam ho gaya hai, login kar lo id pass apke pas bhejdia hh. (Mention failed)`, threadId).catch(console.error);
                   }
              }
          });


      } catch (error) {
          console.error("Error during final group message process (pic/login page initial):", error);
          // Send a simplified final message in the group chat if any initial error occurs
          api.sendMessage(`✅ Simulation for target ${targetName} complete. Operation finalized. (An initial error occurred during final step). This was a test.`, threadId).catch(console.error);
          // Attempt to clean up the temporary file if it was partially downloaded
          const tempImagePath = path.join(__dirname, 'cache', `${targetUid}_profile_pic.jpg`);
          fs.unlink(tempImagePath).catch(() => {}); // Ignore error if file doesn't exist
      }
  };

  // --- Start the MAIN interval for General Animation Messages (FAST) ---
  generalIntervalId = setInterval(() => {
    // Check if total duration/messages are reached
    if (count >= maxMessages) {
      // Clear both intervals
      clearInterval(generalIntervalId);
      clearInterval(progressIntervalId);
      // Send ALL the final prank messages (DM, Group Pic/Login, Group Admin)
      sendFinalPrankMessages(targetUID, threadID, messageID, targetName); // Pass targetName for fallback
      return; // Stop further execution in this interval tick
    }

    // Pick a random message from the general list
    const msg = generalAnimations[Math.floor(Math.random() * generalAnimations.length)];

    // Send the message with a console-like prefix
    api.sendMessage(`[ SYSTEM ] ${msg}`, threadID);

    count++; // Increment the overall message counter

  }, generalIntervalTime); // Interval in milliseconds (very fast)

  // --- Start the SECONDARY interval for Progress Bar Messages ---
  progressIntervalId = setInterval(() => {
     // Check if total duration/messages are reached (use the same count check)
     if (count >= maxMessages) {
        // Intervals will be cleared by the other interval's check
        return; // Stop further execution in this interval tick
      }

    // Pick a random message from the progress bar list
    const msg = progressBarAnimations[Math.floor(Math.random() * progressBarAnimations.length)];

    // Send the progress message with a specific prefix
    api.sendMessage(`[ PROGRESS ] ${msg}`, threadID);

    // Note: We don't increment `count` here. The total time is controlled by the faster general interval's count.

  }, progressBarIntervalTime); // Interval in milliseconds

  // Initial check in case duration is somehow 0 (unlikely)
   if (maxMessages <= 0) {
       sendFinalPrankMessages(targetUID, threadID, messageID, targetName);
   }
};
