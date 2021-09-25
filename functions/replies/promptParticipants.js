const utils = require("../utils");

const promptParticipants = (agent, text) => {
  const suggestions = ["2 adults, 2 children", "2 adults, 1 child", "1 adult, 2 seniors", "2 adults", "1 adult"];
  utils.showSuggestions(agent, text, suggestions, true, true);
};

module.exports = promptParticipants;
