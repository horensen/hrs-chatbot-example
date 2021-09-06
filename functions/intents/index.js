const contexts = require("../contexts");
const utils = require("../utils");

const demo2GbtbTicketPrice = (request) => {
  // Get parameters from slot filling
  const { parameters } = request.body.queryResult;

  // Get parameters from context
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);

  // Take values from slot filling, or otherwise from existing session context, to set in context later
  const citizenship = parameters.citizenship || sessionContextParams.citizenship;
  const site = parameters.site || sessionContextParams.site;
  const peopleGroups = utils.identifyPeopleGroups(parameters.participants);
  const children = peopleGroups.children === 0 ? 0 : peopleGroups.children || sessionContextParams.children;
  const adults = peopleGroups.adults === 0 ? 0 : peopleGroups.adults || sessionContextParams.adults;
  const seniors = peopleGroups.seniors === 0 ? 0 : peopleGroups.seniors || sessionContextParams.seniors;
  const numberOfPeople = children || 0 + adults || 0 + seniors || 0;

  const intentHandler = (agent) => {
    if (citizenship && numberOfPeople > 0 && site) {
      agent.add("Unhandled");
    } else if (citizenship && numberOfPeople > 0) {
      agent.add("Unhandled");
    } else if (citizenship && site) {
      agent.add("Unhandled");
    } else if (numberOfPeople > 0 && site) {
      agent.add("Unhandled");
    } else if (citizenship) {
      agent.add("Unhandled");
    } else if (numberOfPeople > 0) {
      agent.add(`${utils.describeList(parameters.participants, "and", "en", 1)} for which site?`);
      utils.showSuggestions(agent, [
        "✅ Cloud Forest",
        "Flower Dome",
        "OCBC Skyway",
        "Supertree Observatory",
        "Floral Fantasy"
      ]);
    } else if (site) {
      agent.add("Unhandled");
    }

    utils.updateContextParameters(request, agent, contexts.SESSION, {
      currentTopic: "ticket_enquiry",
      citizenship,
      children,
      adults,
      seniors,
      site
    });
  };

  return intentHandler;
};

module.exports = {
  demo2GbtbTicketPrice
};
