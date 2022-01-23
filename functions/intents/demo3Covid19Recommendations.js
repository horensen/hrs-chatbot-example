require("dotenv").config();

const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base("appq1WXSu5RRK5iYI");

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
    const baseExamplesPromise = new Promise(async (resolve, reject) => {
      const tableExamples = [];

      await base("Examples")
        .select({ maxRecords: 50, view: "Grid view" })
        .eachPage(
          (records, fetchNextPage) => {
            records.forEach((record) => tableExamples.push(record._rawJson.fields));
            fetchNextPage();
          },
          async (err) => {
            if (err) reject(err);
            resolve(tableExamples);
          }
        );
    });

    const baseRecommendationsPromise = new Promise(async (resolve, reject) => {
      const tableRecommendations = [];

      await base("Recommendations")
        .select({ maxRecords: 50, view: "Grid view" })
        .eachPage(
          (records, fetchNextPage) => {
            records.forEach((record) => tableRecommendations.push(record._rawJson));
            fetchNextPage();
          },
          (err) => {
            if (err) reject(err);
            resolve(tableRecommendations);
          }
        );
    });

    const promises = [baseExamplesPromise, baseRecommendationsPromise];

    return Promise.all(promises).then((values) => {
      const [examples, recommendations] = values;
      if (examples && recommendations) {
        // Reply based on parameter permutation
        replies.replyCovid19Recommendations(
          agent,
          examples,
          recommendations,
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
      }
    });
  };
};
