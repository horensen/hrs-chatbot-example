const contexts = require("../contexts");
const utils = require("../utils");
const replies = require("../replies");

module.exports = (request) => {
  // Slot filling parameters
  const { parameters } = request.body.queryResult;

  // Context parameters
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);

  // Take values from slot filling or otherwise from existing session context
  const citizenship = parameters.slot_citizenship || sessionContextParams.citizenship;
  const site = parameters.slot_site || sessionContextParams.site;
  const participants = parameters.slot_participants || sessionContextParams.participants;

  return (agent) => {
    // Reply based on parameter permutation
    replies.replyTicketPrice(agent, citizenship, participants, site);

    // Update conversation context
    utils.updateContextParameters(
      request,
      agent,
      contexts.SESSION,
      { currentTopic: "ticket_price_enquiry", citizenship, site, participants },
      5
    );
  };
};
