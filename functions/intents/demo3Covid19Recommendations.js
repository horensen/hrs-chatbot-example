const contexts = require("../contexts");
const utils = require("../utils");
const replies = require("../replies");

module.exports = (request) => {
  // Slot filling parameters
  const { parameters } = request.body.queryResult;

  // Context parameters
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);

  // Take values from slot filling or otherwise from existing session context
  const age = parameters.slot_age || sessionContextParams.age;
  const treatment = parameters.slot_treatment || sessionContextParams.treatment;
  const legallyAtRisk = parameters.slot_legally_at_risk || sessionContextParams.legally_at_risk;
  const covid19TestResult = parameters.slot_covid19_test_result || sessionContextParams.covid19_test_result;
  const symptoms = parameters.slot_symptoms || sessionContextParams.symptoms;
  const symptomsDuration = parameters.slot_symptoms_duration || sessionContextParams.symptoms_duration;

  return (agent) => {
    // Reply based on parameter permutation
    replies.replyCovid19Recommendations(
      agent,
      age,
      treatment,
      legallyAtRisk,
      covid19TestResult,
      symptoms,
      symptomsDuration
    );

    // Update conversation context
    const newContextParams = {
      currentTopic: "covid19",
      age,
      treatment,
      legallyAtRisk,
      covid19TestResult,
      symptoms,
      symptomsDuration
    };
    const lifespan = 5;
    utils.updateContextParameters(request, agent, contexts.SESSION, newContextParams, lifespan);
  };
};
