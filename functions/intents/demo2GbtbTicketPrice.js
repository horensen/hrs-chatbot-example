const { Card } = require("dialogflow-fulfillment");

const contexts = require("../contexts");
const services = require("../services");
const utils = require("../utils");

module.exports = (request) => {
  // Get parameters from slot filling
  const { parameters } = request.body.queryResult;

  // Get parameters from context
  const sessionContextParams = utils.getContextParameters(request, contexts.SESSION);

  // Take values from slot filling, or otherwise from existing session context, to set in context later
  const citizenship = parameters.citizenship || sessionContextParams.citizenship;
  const typeOfRates = citizenship === "Foreigner" ? "Standard" : "Local";
  const site = parameters.site || sessionContextParams.site;
  const peopleGroups = utils.identifyPeopleGroups(parameters.participants);
  const children = peopleGroups.children === 0 ? 0 : peopleGroups.children || sessionContextParams.children;
  const adults = peopleGroups.adults === 0 ? 0 : peopleGroups.adults || sessionContextParams.adults;
  const seniors = peopleGroups.seniors === 0 ? 0 : peopleGroups.seniors || sessionContextParams.seniors;
  const numberOfPeople = children || 0 + adults || 0 + seniors || 0;

  const chance = Math.random();

  const promptSite = (agent, text) =>
    utils.showSuggestions(
      agent,
      text,
      ["✅ Cloud Forest", "Flower Dome", "OCBC Skyway", "Supertree Observatory", "Floral Fantasy"],
      true,
      true
    );

  const promptPeople = (agent, text) =>
    utils.showSuggestions(
      agent,
      text,
      ["2 adults, 2 children", "2 adults, 1 child", "1 adult, 2 seniors", "2 adults", "1 adult"],
      true,
      true
    );

  const promptCitizenship = (agent, text) =>
    utils.showSuggestions(agent, text, ["Singaporeans", "PRs", "Foreigners"], true, false);

  const intentHandler = (agent) => {
    if (citizenship && numberOfPeople > 0 && site) {
      const rates = [];
      let totalAmount = 0;

      const adultRate = typeOfRates === "Local" ? services.localRate.adult : services.nonLocalRate.adult;
      const childRate = typeOfRates === "Local" ? services.localRate.child : services.nonLocalRate.child;
      const seniorRate = typeOfRates === "Local" ? services.localRate.senior : services.nonLocalRate.senior;

      if (adults > 0) {
        rates.push(`$${adultRate} per adult`);
        totalAmount += adultRate * adults;
      }
      if (children > 0) {
        rates.push(`$${childRate} per child`);
        totalAmount += childRate * children;
      }
      if (seniors > 0) {
        rates.push(`$${seniorRate} per senior`);
        totalAmount += seniorRate * seniors;
      }

      const text = `${typeOfRates} ${rates.length > 1 ? "rates are" : "rate is"} ${utils.describeList(
        rates,
        "and",
        "en",
        1
      )} to the ${site}. The total is $${totalAmount}.`;

      const cards = [
        {
          condition: true,
          title: `Cloud Forest Only`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/Cloud%20Forest%20-SRV.png`,
          text: `Go on a fascinating journey of discovery`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/product/info/21823`
        },
        {
          condition: true,
          title: `Flower Dome & Cloud Forest`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/2dome-srv.png`,
          text: `Enter a world of perpetual spring and lush mountain clad`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing`
        },
        {
          condition: adults > 1 || children > 1 || seniors > 1,
          title: `Double Treats Bundle`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/double_treats_cf_fd_bundle_srv.png`,
          text: `Admission for 2 to Flower Dome and Cloud Forest + $10 voucher`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing?search=Double+Treats+Bundle`
        }
      ];

      utils.showCards(agent, text, cards);

      // -------------------------------------------------------------------
    } else if (citizenship && numberOfPeople > 0) {
      const text = `${typeOfRates} ticket prices for ${utils.describeList(
        parameters.participants,
        "and",
        "en",
        1
      )} to which site?`;
      promptSite(agent, text);

      // -------------------------------------------------------------------
    } else if (citizenship && site) {
      const adultRate = typeOfRates === "Local" ? services.localRate.adult : services.nonLocalRate.adult;
      const childRate = typeOfRates === "Local" ? services.localRate.child : services.nonLocalRate.child;
      const seniorRate = typeOfRates === "Local" ? services.localRate.senior : services.nonLocalRate.senior;

      const text = `${typeOfRates} ticket prices for how many adults, children and seniors to the ${site}?
        It is ${adultRate} per adult, $${childRate} per adult and $${seniorRate} per senior.`;
      promptPeople(agent, text);

      // -------------------------------------------------------------------
    } else if (numberOfPeople > 0 && site) {
      const rates = [];
      let totalAmount = 0;

      if (adults > 0) {
        rates.push(`$${services.nonLocalRate.adult} per adult`);
        totalAmount += services.nonLocalRate.adult * adults;
      }
      if (children > 0) {
        rates.push(`$${services.nonLocalRate.child} per child`);
        totalAmount += services.nonLocalRate.child * children;
      }
      if (seniors > 0) {
        rates.push(`$${services.nonLocalRate.senior} per senior`);
        totalAmount += services.nonLocalRate.senior * seniors;
      }

      const cards = [
        {
          condition: true,
          title: `Cloud Forest Only`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/Cloud%20Forest%20-SRV.png`,
          text: `Go on a fascinating journey of discovery`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/product/info/21823`
        },
        {
          condition: true,
          title: `Flower Dome & Cloud Forest`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/2dome-srv.png`,
          text: `Enter a world of perpetual spring and lush mountain clad`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing`
        },
        {
          condition: adults > 1 || children > 1 || seniors > 1,
          title: `Double Treats Bundle`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/double_treats_cf_fd_bundle_srv.png`,
          text: `Admission for 2 to Flower Dome and Cloud Forest + $10 voucher`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing?search=Double+Treats+Bundle`
        }
      ];

      utils.showCards(
        agent,
        `The standard ${rates.length > 1 ? "rates are" : "rate is"} ${utils.describeList(
          rates,
          "and",
          "en",
          1
        )}. The total is $${totalAmount}.`,
        cards
      );

      utils.showSuggestions(
        agent,
        "Lower rates are available for local citizens.",
        ["I'm a Singaporean"],
        false,
        false
      );

      // -------------------------------------------------------------------
    } else if (citizenship) {
      if (chance >= 0.5) {
        const text = `${typeOfRates} ticket price for which site?`;
        promptSite(agent, text);
      } else {
        const text = `${typeOfRates} ticket prices for how many adults, children and seniors?`;
        promptPeople(agent, text);
      }

      // -------------------------------------------------------------------
    } else if (numberOfPeople > 0) {
      if (chance >= 0.5) {
        const text = `${utils.describeList(parameters.participants, "and", "en", 1)} for which site?`;
        promptSite(agent, text);
      } else {
        const text = `Are there mostly Singaporeans, Permanent Residents (PRs) or foreigners among ${utils.describeList(
          parameters.participants,
          "and",
          "en",
          1
        )}?`;
        promptCitizenship(agent, text);
      }

      // -------------------------------------------------------------------
    } else if (site) {
      if (chance >= 0.5) {
        const text = `Ticket price for how many adults, children and seniors will be going to the ${site}?`;
        promptPeople(agent, text);
      } else {
        const text = `Ticket price for Singaporeans, Permanent Residents (PRs) or foreigners visiting the ${site}?`;
        promptCitizenship(agent, text);
      }

      // -------------------------------------------------------------------
    } else {
      if (chance >= 0.6667) {
        promptSite(agent, "Ticket price for which site?");
      } else if (chance >= 0.3333) {
        promptPeople(agent, "Ticket price for how many adults, children and seniors?");
      } else {
        promptCitizenship(agent, "Ticket price for Singaporeans, Permanent Residents (PRs) or foreigners?");
      }

      // -------------------------------------------------------------------
    }

    utils.updateContextParameters(request, agent, contexts.SESSION, {
      currentTopic: "ticket_enquiry",
      citizenship,
      children,
      adults,
      seniors,
      site
    });
  };

  return intentHandler;
};
