module.exports = (request) => {
  const { queryText } = request.body.queryResult;

  return (agent) => {
    agent.add(`Evaluated query: ${queryText}`);
  };
};
