const contexts = require("../contexts");
const utils = require("../utils");
const replies = require("../replies");

module.exports = (request) => {
  // Slot filling parameters
  const { parameters } = request.body.queryResult;

  // Context parameters
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);
  const citizenship = sessionContextParams.citizenship;
  const participants = sessionContextParams.participants;
  const requestIsTicketPriceEnquiry =
    sessionContextParams &&
    sessionContextParams.currentTopic &&
    sessionContextParams.currentTopic === "ticket_price_enquiry";

  // Take values from slot filling, or otherwise from existing session context, to set in context later
  const site = parameters.slot_site || sessionContextParams.site;

  return (agent) => {
    // Response based on parameter permutations
    if (requestIsTicketPriceEnquiry) {
      replies.replyTicketPrice(agent, citizenship, participants, site);
      // -------------------------------------------------------------------
    } else if (site) {
      utils.showSuggestions(
        agent,
        `OK, you want to check out the ${site}. How can I help?`,
        ["Ticket prices"],
        false,
        false
      );
      // -------------------------------------------------------------------
    } else {
      replies.promptSite(agent, "Which site?");
      // -------------------------------------------------------------------
    }

    // Update conversation context
    utils.updateContextParameters(request, agent, contexts.SESSION, { citizenship, site, participants }, 5);
  };
};
