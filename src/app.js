// Telegram API client
const { Telegraf } = require("telegraf");
// substrate.js file
const Substrate = require("./substrate");
// load env vars
require("dotenv").config();

// Parse the env vars
// Amount of native tokens to send
const AMOUNT = parseFloat(process.env.AMOUNT);
// Address Type
// https://wiki.polkadot.network/docs/en/learn-accounts, generic-substrate=42, kusama=2
const ADDRESS_TYPE = parseInt(process.env.ADDRESS_TYPE);
//Limit in hours for token requests by same user
const TIME_LIMIT_HOURS = parseFloat(process.env.TIME_LIMIT_HOURS);

// Help message when user first starts or types help command
const helpMessage = `Welcome to the ${process.env.FAUCET_NAME}! 
To request for tokens send the message: 
"/request ADDRESS" 
with your correct ${process.env.TOKEN_NAME} address`;
// Error Messages
const timeLimitMessage = `Sorry please wait for ${TIME_LIMIT_HOURS} hours, between token requests from the same telegram account!`;
const invalidAddressMessage = `Invalid address! Plese use the generic substrate format with address type ${ADDRESS_TYPE}!`;

// temp storage of records so we can set a time limit for requests from same user
let records = {};
// create the bot instance
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// On user starting convo
bot.start(async (ctx) => {
  await ctx.reply(helpMessage);
});

// On user types help
bot.help(async (ctx) => {
  await ctx.reply(helpMessage);
});

// On request token command
bot.command("request", async (ctx) => {
  console.log("Got token request!");
  const resp = await Substrate.requestToken(
    ctx.message,
    records,
    AMOUNT,
    process.env.TOKEN_NAME,
    invalidAddressMessage,
    timeLimitMessage,
    ADDRESS_TYPE
  );
  await ctx.reply(resp);
});

// Run the bot
bot.launch();
