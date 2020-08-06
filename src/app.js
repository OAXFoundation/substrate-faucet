const { Telegraf } = require("telegraf");
const UtilCrypto = require("@polkadot/util-crypto");
// load env vars
require("dotenv").config();
// Name of your faucet
const FAUCET_NAME = process.env.FAUCET_NAME;
// Amount of native tokens to send
const AMOUNT = parseFloat(process.env.AMOUNT);
// Address Type
// https://wiki.polkadot.network/docs/en/learn-accounts, generic-substrate=42, kusama=2
const ADDRESS_TYPE = process.env.ADDRESS_TYPE;
// Name of your token
const TOKEN_NAME = process.env.TOKEN_NAME;
// your telegram bot token
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
//Limit in hours for token requests by same user
const TIME_LIMIT_HOURS = parseFloat(process.env.TIME_LIMIT_HOURS);

// Help message when user first starts or types help command
const helpMessage = `Welcome to the ${FAUCET_NAME}! 
To request for tokens send the message: 
"/request ADDRESS" 
with your correct ${TOKEN_NAME} address`;
// Error Messages
const timeLimitMessage = `Sorry please wait for ${TIME_LIMIT_HOURS} hours, between token requests from the same telegram account!`;
const invalidAddressMessage = `Invalid address! Plese use the generic substrate format with address type ${ADDRESS_TYPE}!`;

// temp storage of records so we can set a time limit for requests from same user
let records = {};
// create the bot instance
const bot = new Telegraf(TELEGRAM_TOKEN);

// returns address from message if valid, or else returns undefined
function getAddressFromMessage(message) {
  const address = message.text.substring(9);
  const check = UtilCrypto.checkAddress(address, ADDRESS_TYPE);
  if (check[0]) {
    // Address match
    return address;
  } else {
    // Not a valid address
    return undefined;
  }
}

// function that sends tokens to the user
async function sendToken(address) {
  console.log(`Sending ${AMOUNT} ${TOKEN_NAME} to ${address}`);
  // TODO implement this
}

async function requestToken(message) {
  console.log("Current Records:");
  console.log(records);
  let response;
  const now = Date.now();
  //   const username = message["from"]["username"];
  const senderId = message["from"]["id"];
  // Get the senders record
  const senderRecords = records[senderId];

  address = getAddressFromMessage(message);
  if (address) {
    response = `Sending ${AMOUNT} ${TOKEN_NAME} to ${address}!`;
    // if exists
    if (senderRecords) {
      // make sure last request was long time ago
      const last = senderRecords.slice(-1)[0];
      // check if now - last > TIME_LIMIT_HOURS
      if (now - last > TIME_LIMIT_HOURS * 1000 * 60) {
        // yes limit has passed
        await sendToken(address);
        // update the records to show this
        records[senderId].push(now);
      } else {
        // this means user requested tokens already
        response = timeLimitMessage;
      }
    } else {
      // this is users first request
      // yes limit has passed
      await sendToken(address);
      // create the record
      records[senderId] = [];
      // update the records to show this
      records[senderId].push(now);
    }
  } else {
    response = invalidAddressMessage;
  }
  return response;
}

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
  const resp = await requestToken(ctx.message);
  await ctx.reply(resp);
});

// Run the bot
bot.launch();
