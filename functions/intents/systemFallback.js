const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY
  })
);

module.exports = async (request) => {
  const { queryText } = request.body.queryResult;

  const response = await openai.createCompletion("text-davinci-002", {
    prompt: queryText,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.2,
    presence_penalty: 0
  });

  return (agent) => {
    agent.add(response);
  };
};
