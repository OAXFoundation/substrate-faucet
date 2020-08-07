// this is for verifying address
const UtilCrypto = require("@polkadot/util-crypto");

module.exports = {
  // returns address from message if valid, or else returns undefined
  getAddressFromMessage: function (message, addressType) {
    const address = message.text.substring(9);
    const check = UtilCrypto.checkAddress(address, addressType);
    if (check[0]) {
      // Address match
      return address;
    } else {
      // Not a valid address
      return undefined;
    }
  },

  // function that sends tokens to the user
  sendToken: async function (amount, address, tokenName) {
    console.log(`Sending ${amount} ${tokenName} to ${address}`);
    // TODO implement this
  },

  // function that telgram bot calls
  requestToken: async function (
    message,
    records,
    amount,
    token_name,
    invalidAddressMessage,
    timeLimitMessage,
    addressType,
    timeLimitHours
  ) {
    console.log("Current Records:");
    console.log(records);
    let response;
    const now = Date.now();
    //   const username = message["from"]["username"];
    const senderId = message["from"]["id"];
    // Get the senders record
    const senderRecords = records[senderId];

    address = this.getAddressFromMessage(message, addressType);
    if (address) {
      response = `Sending ${amount} ${token_name} to ${address}!`;
      // if exists
      if (senderRecords) {
        // make sure last request was long time ago
        const last = senderRecords.slice(-1)[0];
        // check if now - last > timeLimitHours
        if (now - last > timeLimitHours * 1000 * 60) {
          // yes limit has passed
          await this.sendToken(amount, address, token_name);
          // update the records to show this
          records[senderId].push(now);
        } else {
          // this means user requested tokens already
          response = timeLimitMessage;
        }
      } else {
        // this is users first request
        // yes limit has passed
        await this.sendToken(amount, address, token_name);
        // create the record
        records[senderId] = [];
        // update the records to show this
        records[senderId].push(now);
      }
    } else {
      response = invalidAddressMessage;
    }
    return response;
  },
};
