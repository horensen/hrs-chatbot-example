const agent = require("./agent");

const describeList = (items, conjunction) => {
  const space = " ";
  const comma = ",";

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
  identifyPeopleGroups,
  ...agent
};
