const utils = require("../utils");

const promptCitizenship = (agent, text) => {
  const suggestions = ["Singaporeans", "PRs", "Foreigners"];
  utils.showSuggestions(agent, text, suggestions, true, false);
};

module.exports = promptCitizenship;
