const contexts = require("../contexts");
const utils = require("../utils");
const replies = require("../replies");

module.exports = (request) => {
  // Slot filling parameters
  const { parameters } = request.body.queryResult;

  // Context parameters
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);
  const site = sessionContextParams.site;
  const participants = sessionContextParams.participants;
  const requestIsTicketPriceEnquiry =
    sessionContextParams &&
    sessionContextParams.currentTopic &&
    sessionContextParams.currentTopic === "ticket_price_inquiry";

  // Take values from slot filling, or otherwise from existing session context, to set in context later
  const citizenship = parameters.slot_citizenship || sessionContextParams.citizenship;

  return (agent) => {
    // Response based on parameter permutations
    if (requestIsTicketPriceEnquiry) {
      replies.replyTicketPrice(agent, citizenship, participants, site);
      // -------------------------------------------------------------------
    } else if (citizenship) {
      utils.showSuggestions(
        agent,
        `OK, noted your citizenship as ${citizenship}. How can I help?`,
        ["Ticket prices"],
        false,
        false
      );
      // -------------------------------------------------------------------
    } else {
      replies.promptCitizenship(agent, "Singaporean, Permanent Res or foreigner?");
      // -------------------------------------------------------------------
    }

    // Update conversation context
    utils.updateContextParameters(request, agent, contexts.SESSION, { citizenship, site, participants }, 5);
  };
};
