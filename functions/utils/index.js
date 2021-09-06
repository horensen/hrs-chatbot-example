const { Suggestion } = require("dialogflow-fulfillment");

// HANDLING TEXT OR SPEECH REPLIES

const describeList = (items, operator, language, formality) => {
  const conjunctionsMap = {
    en: {
      and: ["and", "and", "and"],
      or: ["or", "or", "or"]
    },
    zh: {
      and: ["跟", "和", "与"],
      or: ["还是", "或者", "或"]
    }
  };

  const conjunction = conjunctionsMap[language][operator][formality];
  const space = language === "en" ? " " : "";
  const comma = language === "en" ? "," : "，";

  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]}${space}${conjunction}${space}${items[1]}`;

  return items
    .slice(0, items.length - 2)
    .map((item) => `${item}${comma}${space}`)
    .join("")
    .concat(items.slice(items.length - 2, items.length).join(`${space}${conjunction}${space}`));
};

const pickAny = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

// HANDLING AGENT CONTEXT

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

// HANDLING AGENT RICH REPLIES

const showSuggestions = (agent, suggestions) => {
  suggestions.forEach((suggestion) => agent.add(new Suggestion(suggestion)));
};

// MISC

const identifyPeopleGroups = (participantTypes) => {
  let children;
  let adults;
  let seniors;

  participantTypes.forEach((participantType) => {
    if (participantType.includes("child")) children = Number(participantType.split(" ")[0]);
    if (participantType.includes("adult")) adults = Number(participantType.split(" ")[0]);
    if (participantType.includes("senior")) seniors = Number(participantType.split(" ")[0]);
  });

  return { children, adults, seniors };
};

module.exports = {
  describeList,
  pickAny,
  updateContextParameters,
  getContextParameters,
  showSuggestions,
  identifyPeopleGroups
};
