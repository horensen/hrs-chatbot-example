const { Configuration, OpenAIApi } = require("openai");

const openaiConfig = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(openaiConfig);

module.exports = (request) => {
  const { queryText } = request.body.queryResult;

  return (agent) => {
    const engine = "text-davinci-002";

    return openai
      .createCompletion(engine, {
        prompt: queryText,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0
      })
      .then((response) => {
        const answer = response.data.choices[0].text;
        agent.add(answer);
      })
      .catch((error) => {
        console.error(error);
        agent.add("I don't know.");
      });
  };
};
