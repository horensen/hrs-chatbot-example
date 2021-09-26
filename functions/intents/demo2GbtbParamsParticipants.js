const contexts = require("../contexts");
const utils = require("../utils");
const replies = require("../replies");

module.exports = (request) => {
  // Slot filling parameters
  const { parameters } = request.body.queryResult;

  // Context parameters
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);
  const citizenship = sessionContextParams.citizenship;
  const site = sessionContextParams.site;
  const requestIsTicketPriceEnquiry =
    sessionContextParams &&
    sessionContextParams.currentTopic &&
    sessionContextParams.currentTopic === "ticket_price_inquiry";

  // Take values from slot filling, or otherwise from existing session context, to set in context later
  const participants = parameters.slot_participants || sessionContextParams.participants;

  return (agent) => {
    // Response based on parameter permutations
    if (requestIsTicketPriceEnquiry) {
      replies.replyTicketPrice(agent, citizenship, participants, site);
      // -------------------------------------------------------------------
    } else if (participants) {
      utils.showSuggestions(
        agent,
        `OK, noted the participants. How can I help?`,
        ["Ticket prices"],
        false,
        false
      );
      // -------------------------------------------------------------------
    } else {
      replies.promptPeople(agent, "How many children, adults and seniors?");
      // -------------------------------------------------------------------
    }

    // Update conversation context
    utils.updateContextParameters(request, agent, contexts.SESSION, { citizenship, site, participants }, 5);
  };
};
