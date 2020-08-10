# Substrate Telegram Token Faucet

This is a simple token faucet that can be connected to any modern substrate chain to act as a telegram faucet.

## Pre-requisites

1. A bot token , this can be obtained by chatting with BotFather on telegram. https://core.telegram.org/bots#6-botfather

2. A live substrate chain, and a wallet private key with some balances. (This will be used to distribute the tokens)

3. The types.json file for your particular chain

4. A Polkadot wallet json, extracted using polkadot-js extension. This wallet should have tokens or else the transfers will fail on token requests.

## Installation

`npm i`

## Set-up

1. Copy the .env.example file as .env
2. Set all the .env vars in this file properly. Including the path to your json key.
3. Copy over the correct `type.json` for your chain onto `src/types/types.json`
4. If you want to change the Help or Error Messages, you can open `app.js` and make these changes

## Run

`npm run start`
