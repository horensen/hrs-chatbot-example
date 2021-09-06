"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const intents = require("./intents");

exports.dialogflowFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({request, response});

  let intentMap = new Map();
  intentMap.set("Demo2.Gbtb.TicketPrice", intents.demo2GbtbTicketPrice(request));
  agent.handleRequest(intentMap);
});
