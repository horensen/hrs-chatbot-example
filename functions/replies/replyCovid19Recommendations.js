const DecisionTree = require("decision-tree");

const replyCovid19Recommendations = (
  agent,
  examples,
  recommendations,
  age,
  treatment,
  legallyAtRisk,
  covid19TestResult,
  symptoms,
  symptomsDuration
) => {
  let age_group = "17-64"; // default
  if (age >= 65) age_group = ">=65";
  if (age >= 17 && age <= 64) age_group = "17-64";
  if (age >= 13 && age <= 16) age_group = "13-16";
  if (age <= 12) age_group = "<=12";

  let has_chronic_disease = false; // default
  let is_under_dialysis_or_chemo = false; // default
  if (treatment === "dialysis" || treatment === "chemotherapy") {
    has_chronic_disease = true;
    is_under_dialysis_or_chemo = true;
  } else if (treatment === "other treatment") {
    has_chronic_disease = true;
  }

  let is_legally_at_risk = false; // default
  if (legallyAtRisk === "true") is_legally_at_risk = true;
  if (legallyAtRisk === "false") is_legally_at_risk = false;

  let covid19_test = "no_result_past_48_hours"; // default
  if (covid19TestResult === "positive") covid19_test = "positive";
  if (covid19TestResult === "negative") covid19_test = "negative";

  const has_breathing_difficulty = symptoms.includes("difficulty breathing");
  const has_cough = symptoms.includes("cough");
  const has_fever = symptoms.includes("fever");
  const has_taste_smell_loss = symptoms.includes("loss of taste or smell");
  const has_sore_throat = symptoms.includes("sore throat");
  const has_diarrhoea = symptoms.includes("diarrhoea");
  const has_body_ache = symptoms.includes("body ache");
  const has_runny_nose = symptoms.includes("runny nose");

  let duration = "5-7"; // default
  if (symptomsDuration.unit === "day") {
    const days = symptomsDuration.amount;
    if (days > 14) duration = ">14";
    if (days >= 8 && days <= 14) duration = "8-14";
    if (days >= 5 && days <= 7) duration = "5-7";
    if (days <= 4) duration = "0-4";
  }

  const data_point = {
    age_group,
    has_chronic_disease,
    is_under_dialysis_or_chemo,
    is_legally_at_risk,
    covid19_test,
    has_breathing_difficulty,
    has_cough,
    has_fever,
    has_taste_smell_loss,
    has_sore_throat,
    has_diarrhoea,
    has_body_ache,
    has_runny_nose,
    duration
  };


  const dt = new DecisionTree("recommendation", [
    "age_group",
    "has_chronic_disease",
    "is_under_dialysis_or_chemo",
    "is_legally_at_risk",
    "covid19_test",
    "has_breathing_difficulty",
    "has_cough",
    "has_fever",
    "has_taste_smell_loss",
    "has_sore_throat",
    "has_diarrhoea",
    "has_body_ache",
    "has_runny_nose",
    "duration"
  ]);

  dt.train(examples);

  const prediction = dt.predict(data_point);
  const recommendation_id = prediction[0];

  const recommendation = recommendations.filter(r => r.id === recommendation_id)[0];

  agent.add(recommendation.fields.description);
};

module.exports = replyCovid19Recommendations;
