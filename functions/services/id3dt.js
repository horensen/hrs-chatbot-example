const DecisionTree = require("decision-tree");

const examples = [
  {
    age_group: ">=65",
    has_chronic_disease: true,
    is_under_dialysis_or_chemo: true,
    is_legally_at_risk: false,
    covid19_test: "negative",
    has_breathing_difficulty: false,
    has_cough: false,
    has_fever: false,
    has_taste_smell_loss: false,
    has_sore_throat: false,
    has_diarrhoea: false,
    has_body_ache: false,
    has_runny_nose: false,
    duration: "0-4",
    recommendation: 5
  }
];

const target = "recommendation";
const features = [
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
];

const dt = new DecisionTree(target, features);
dt.train(examples);

const prediction = dt.predict(input);
