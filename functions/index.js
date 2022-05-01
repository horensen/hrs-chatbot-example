"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");

const intents = require("./intents");

exports.dialogflowFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  const intentMap = new Map();
  intentMap.set("Demo2.Gbtb.Params.Citizenship", intents.demo2GbtbParamsCitizenship(request));
  intentMap.set("Demo2.Gbtb.Params.Participants", intents.demo2GbtbParamsParticipants(request));
  intentMap.set("Demo2.Gbtb.Params.Site", intents.demo2GbtbParamsSite(request));
  intentMap.set("Demo2.Gbtb.TicketPrice", intents.demo2GbtbTicketPrice(request));
  intentMap.set("Demo3.Covid19.Recommendations", intents.demo3Covid19Recommendations(request));
  intentMap.set("Demo5.QueryForCode", intents.demo5QueryForCode(request));
  agent.handleRequest(intentMap);
});
