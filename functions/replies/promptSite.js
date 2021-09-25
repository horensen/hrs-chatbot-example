const utils = require("../utils");

const promptSite = (agent, text) => {
  const suggestions = ["✅ Cloud Forest", "Flower Dome", "OCBC Skyway", "Supertree Observatory", "Floral Fantasy"];
  utils.showSuggestions(agent, text, suggestions, true, true);
};

module.exports = promptSite;
