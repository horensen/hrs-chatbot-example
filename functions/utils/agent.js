const { Card, Payload } = require("dialogflow-fulfillment");

// CONTEXT

const updateContextParameters = (request, agent, contextName, newParams, lifespan = 5) => {
  const currentParams = getContextParameters(request, contextName);

  if (Object.keys(currentParams).length === 0) {
    // if currentParams is {}
    agent.context.set({ name: contextName, lifespan, parameters: newParams });
  } else {
    agent.context.set({ name: contextName, lifespan, parameters: { ...currentParams, ...newParams } });
  }
};

const getContextParameters = (request, contextName) => {
  const { outputContexts } = request.body.queryResult;

  const filteredOutputContexts = outputContexts.filter((outputContext) =>
    outputContext.name.includes(contextName.toLowerCase())
  );

  const firstMatchingContextHasParameters =
    filteredOutputContexts && filteredOutputContexts[0] && filteredOutputContexts[0].parameters;

  if (firstMatchingContextHasParameters) {
    return filteredOutputContexts[0].parameters;
  }

  return {};
};

// RICH REPLIES
// For demo purpose, custom payloads are fixed for Telegram bots

const showSuggestions = (agent, text, suggestions, isEphemeral, randomise) => {
  if (randomise === true) {
    // Fisher-Yates algorithm
    for (let i = suggestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = suggestions[i];
      suggestions[i] = suggestions[j];
      suggestions[j] = temp;
    }
  }

  const reply_markup = isEphemeral
    ? {
        keyboard: suggestions.map((suggestion) => [{ text: suggestion, callback_data: suggestion }]),
        resize_keyboard: true
      }
    : {
        inline_keyboard: suggestions.map((suggestion) => [{ text: suggestion, callback_data: suggestion }]),
        resize_keyboard: true
      };

  const payload = {
    telegram: {
      text,
      reply_markup
    }
  };

  agent.add(new Payload("TELEGRAM", payload, { rawPayload: true, sendAsMessage: true }));
};

const showCards = (agent, text, cards) => {
  agent.add(text);

  cards.forEach(card => {
    if (card.condition === true) agent.add(new Card(card));
  })
}

module.exports = {
  updateContextParameters,
  getContextParameters,
  showSuggestions,
  showCards
};
