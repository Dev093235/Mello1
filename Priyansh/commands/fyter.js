// == CONFIGURATION ==
module.exports.config = {
  name: "fyter",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mohit",
  description: "Desi maa bhen wali galiyan de naam lekar",
  commandCategory: "fun",
  usages: "[naam]",
  cooldowns: 2,
};

// == IMPORTS & GALI DATA ==
const desiGaliList = [
  "{name} teri maa ka bhosda, tere baap ka loda, pure khandan ki chut me aag lagun. Tere jaisa harami kutte ke bhi naseeb me na ho. Teri behen ko road pe nanga nachwa du kya? Lene dene ka hisab rakh le, chutiyo ki factory ka tu manager hai kya? Kya chutiyapa faila rakha hai? \uD83E\uDD2C\uD83D\uDE21",

  "{name} teri maa ki chut me tractor chala du, itna tez ke Gaon bhar ki ladkiyan hil jaye. Tere baap ko bhi de diya ek jhatka, ab se tu sirf yaadon me rahega. Bsdk, tu paida hi kyu hua? \uD83D\uDE20\uD83D\uDE02",

  "{name} tere muh me gobar bhar ke teri maa ke saath suhaagraat manaun. Teri behen ki chut me Diwali ki phatake phod du. Tere baap ke lund me mirchi bhar ke lassi pilwa du. Tu duniya ka sabse bada gandu hai. \uD83D\uDCA9\uD83D\uDE1C",

  "{name} tu condom ka side effect hai. Tere jaise chutiye ko to toilet me flush kar dena chahiye tha. Teri maa ki chut me DJ baja du, full bass ke saath. Tere ghar me ghus ke sabko chodu. \uD83E\uDD14\uD83D\uDE08",

  "{name} teri maa ki chut me bazooka ghol du. Teri behen ko stadium me chudwa du. Tere baap ke gaand me supersonic missile ghoosadu. Tu zinda hi insult hai. \uD83D\uDCA5\uD83D\uDE2D",

  "{name} tere ghar ki auratein nanga dance karti hai ghoonghat hata ke. Tere jaisa harami paida hone se pehle hi mar jana chahiye. Tere baap ko khula chod du jhaad pe baandh ke. \uD83D\uDC80\uD83D\uDE1E",

  "{name} tu kutti ke jhaant ka laal hai. Teri maa ko 10 murge milke chudte hai Haridwar me. Teri behen ko WhatsApp pe resale kar diya. Tere ghar ka address Tinder pe de diya. \uD83D\uDE02\uD83D\uDD25",

  "{name} teri maa ka WhatsApp group bana ke sab ne choda. Teri behen ko live chudai ke liye stream kar diya. Tu chutiyaon ka raja hai. \uD83C\uDFC6\uD83E\uDD23",

  "{name} tere baap ka lund WhatsApp sticker bana ke viral kar diya. Teri maa ki chut me Google Map chala du. Tere jaisa harami paida hone se pehle bhagwan ko bhi sharam aaye. \uD83E\uDD2E\uD83C\uDF0A",

  "{name} teri behen ko saare DJ wale thok chuke hai. Tere baap ke lund pe thappad mar mar ke chutiya banaya. Tu asli gandu hai. \uD83D\uDC4A\uD83D\uDE2B",

  "{name} teri maa ki chut ke andar bhatake wala atma ban jaaun. Teri behen ko red light area me register karwa diya. Tu chutiya nahi, chutiyo ka brand ambassador hai. \uD83D\uDE05\uD83D\uDC4E",

  "{name} teri maa ki chut me LED lagwa ke navratra me pandal bana diya. Teri behen ke chudai ka tender nikala. Tere baap ke gaand me silencer laga diya. \uD83D\uDE97\uD83D\uDE80",

  "{name} tere jaise harami ko to live pe chudai dikhani chahiye. Teri maa ka character certificate pornstars se likhwaya hai. \uD83C\uDF1F\uD83E\uDD23",

  "{name} teri maa ki chut me jalebi banwa du. Teri behen ko TikTok trend bana du. Tere baap ka gaand viral kar du. Tu gandu hai certified. \uD83C\uDF1A\uD83D\uDC7D",

  "{name} tu gand ka dard hai society ke liye. Teri maa ne tujhe chodne ke liye paida kiya tha. Teri behen to apne fan ke sath hi chud gayi. \uD83E\uDD14\uD83C\uDF89",

  "{name} teri maa ki chut me WhatsApp forward bhar du. Tere baap ki video OnlyFans pe daal du. Tu kuch bhi nahi, bs ek chalta phirta gandu hai. \uD83C\uDFB6\uD83E\uDD20",

  "{name} teri maa ki chut me festival manau. Teri behen ke chudai pe DJ lagwa du. Tere jaise logon ko to museum me rakhna chahiye, chutiya specimen ke naam se. \uD83C\uDFA9\uD83D\uDE31",

  "{name} tu live chudai ka brand ban chuka hai. Tere baap ki gaand me jhandu balm bhar du. Teri maa ke chut ka map draw kar ke Google ko bhej du. \uD83C\uDF00\uD83E\uDD2F",

  "{name} tere ghar ki saari auratein 18+ content banati hai. Tere baap ke lund me ghanti baandh ke bajau. Teri maa ki chut me Shaktimaan ghoom gaya. \uD83E\uDD73\uD83C\uDF89",

  "{name} teri maa ki chut pe disco light lagake nightclub bana diya. Tere baap ka loda weekly offer pe chal raha hai. Teri behen ki chut me Facebook live chalu hai. \uD83D\uDCFA\uD83D\uDCF2"
];

// == HELPER FUNCTION ==
function getRandomGali(name) {
  const gali = desiGaliList[Math.floor(Math.random() * desiGaliList.length)];
  return gali.replace(/{name}/g, name);
}

// == MAIN COMMAND ==
module.exports.run = async function ({ api, event, args }) {
  const name = args.join(" ");
  if (!name) return api.sendMessage("Kiska naam lapetna hai bhai?", event.threadID);

  const reply = getRandomGali(name);
  return api.sendMessage(reply, event.threadID);
};
