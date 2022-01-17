const services = require("../services");
const utils = require("../utils");

const replyCovid19Recommendations = (
  agent,
  age,
  treatment,
  legallyAtRisk,
  covid19TestResult,
  symptoms,
  symptomsDuration
) => {

  agent.add(
    `${age}, ${treatment}, ${legallyAtRisk}, ${covid19TestResult}, ${JSON.stringify(symptoms)}, ${symptomsDuration}`
  );
};

module.exports = replyCovid19Recommendations;
