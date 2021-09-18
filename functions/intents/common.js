const services = require("../services");
const utils = require("../utils");

const promptCitizenship = (agent, text) => {
  const suggestions = ["Singaporeans", "PRs", "Foreigners"];
  utils.showSuggestions(agent, text, suggestions, true, false);
};

const promptPeople = (agent, text) => {
  const suggestions = ["2 adults, 2 children", "2 adults, 1 child", "1 adult, 2 seniors", "2 adults", "1 adult"];
  utils.showSuggestions(agent, text, suggestions, true, true);
};

const promptSite = (agent, text) => {
  const suggestions = ["✅ Cloud Forest", "Flower Dome", "OCBC Skyway", "Supertree Observatory", "Floral Fantasy"];
  utils.showSuggestions(agent, text, suggestions, true, true);
};

const replyTicketPrice = (agent, citizenship, participants, site) => {
  const typeOfRates = citizenship === "Foreigner" ? "Standard" : "Local";
  const groups = utils.identifyPeopleGroups(participants);
  const peopleCount = (groups.children || 0) + (groups.adults || 0) + (groups.seniors || 0);
  const chance = Math.random();

  // Response based on parameter permutations
  if (citizenship && peopleCount > 0 && site) {
    const rates = [];
    let totalAmount = 0;

    const adultRate = typeOfRates === "Local" ? services.localRate.adult : services.nonLocalRate.adult;
    const childRate = typeOfRates === "Local" ? services.localRate.child : services.nonLocalRate.child;
    const seniorRate = typeOfRates === "Local" ? services.localRate.senior : services.nonLocalRate.senior;

    if (groups.adults > 0) {
      rates.push(`$${adultRate} per adult`);
      totalAmount += adultRate * groups.adults;
    }
    if (groups.children > 0) {
      rates.push(`$${childRate} per child`);
      totalAmount += childRate * groups.children;
    }
    if (groups.seniors > 0) {
      rates.push(`$${seniorRate} per senior`);
      totalAmount += seniorRate * groups.seniors;
    }

    utils.showCards(
      agent,
      `${typeOfRates} ${rates.length > 1 ? "rates are" : "rate is"} ${utils.describeList(
        rates,
        "and",
        "en",
        1
      )} to the ${site}. The total is $${totalAmount}.`,
      [
        {
          condition: site === "Cloud Forest",
          title: `Cloud Forest Only`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/Cloud%20Forest%20-SRV.png`,
          text: `Go on a fascinating journey of discovery`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/product/info/21823`
        },
        {
          condition: site === "Cloud Forest" || site === "Flower Dome",
          title: `Flower Dome & Cloud Forest`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/2dome-srv.png`,
          text: `Enter a world of perpetual spring and lush mountain clad`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing`
        },
        {
          condition: groups.adults > 1 || groups.children > 1 || groups.seniors > 1,
          title: `Double Treats Bundle`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/double_treats_cf_fd_bundle_srv.png`,
          text: `Admission for 2 to Flower Dome and Cloud Forest + $10 voucher`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing?search=Double+Treats+Bundle`
        }
      ]
    );
    // -------------------------------------------------------------------
  } else if (citizenship && peopleCount > 0) {
    promptSite(
      agent,
      `${typeOfRates} ticket prices for ${utils.describeList(participants, "and", "en", 1)} to which site?`
    );
    // -------------------------------------------------------------------
  } else if (citizenship && site) {
    const adultRate = typeOfRates === "Local" ? services.localRate.adult : services.nonLocalRate.adult;
    const childRate = typeOfRates === "Local" ? services.localRate.child : services.nonLocalRate.child;
    const seniorRate = typeOfRates === "Local" ? services.localRate.senior : services.nonLocalRate.senior;

    promptPeople(
      agent,
      `${typeOfRates} ticket prices for how many children, adults and seniors to the ${site}? It is ${adultRate} per adult, $${childRate} per adult and $${seniorRate} per senior.`
    );
    // -------------------------------------------------------------------
  } else if (peopleCount > 0 && site) {
    const rates = [];
    let totalAmount = 0;

    if (groups.adults > 0) {
      rates.push(`$${services.nonLocalRate.adult} per adult`);
      totalAmount += services.nonLocalRate.adult * groups.adults;
    }
    if (groups.children > 0) {
      rates.push(`$${services.nonLocalRate.child} per child`);
      totalAmount += services.nonLocalRate.child * groups.children;
    }
    if (groups.seniors > 0) {
      rates.push(`$${services.nonLocalRate.senior} per senior`);
      totalAmount += services.nonLocalRate.senior * groups.seniors;
    }

    utils.showCards(
      agent,
      `The standard ${rates.length > 1 ? "rates are" : "rate is"} ${utils.describeList(
        rates,
        "and",
        "en",
        1
      )}. The total is $${totalAmount}.`,
      [
        {
          condition: site === "Cloud Forest",
          title: `Cloud Forest Only`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/Cloud%20Forest%20-SRV.png`,
          text: `Go on a fascinating journey of discovery`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/product/info/21823`
        },
        {
          condition: site === "Cloud Forest" || site === "Flower Dome",
          title: `Flower Dome & Cloud Forest`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/2dome-srv.png`,
          text: `Enter a world of perpetual spring and lush mountain clad`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing`
        },
        {
          condition: groups.adults > 1 || groups.children > 1 || groups.seniors > 1,
          title: `Double Treats Bundle`,
          imageUrl: `https://gt-media-assets.s3-ap-southeast-1.amazonaws.com/images/gardens-by-the-bay/double_treats_cf_fd_bundle_srv.png`,
          text: `Admission for 2 to Flower Dome and Cloud Forest + $10 voucher`,
          buttonText: `Buy tickets`,
          buttonUrl: `https://ticket.gardensbythebay.com.sg/package/listing?search=Double+Treats+Bundle`
        }
      ]
    );

    utils.showSuggestions(agent, "Lower rates are available for locals.", ["I'm a Singaporean"], false, false);
    // -------------------------------------------------------------------
  } else if (citizenship) {
    if (chance >= 0.5) {
      promptSite(agent, `${typeOfRates} ticket price for which site?`);
    } else {
      promptPeople(agent, `${typeOfRates} ticket prices for how many adults, children and seniors?`);
    }
    // -------------------------------------------------------------------
  } else if (peopleCount > 0) {
    if (chance >= 0.5) {
      promptSite(agent, `${utils.describeList(participants, "and", "en", 1)} for which site?`);
    } else {
      promptCitizenship(
        agent,
        `Are there mostly Singaporeans, Permanent Residents (PRs) or foreigners among ${utils.describeList(
          participants,
          "and",
          "en",
          1
        )}?`
      );
    }
    // -------------------------------------------------------------------
  } else if (site) {
    if (chance >= 0.5) {
      promptPeople(agent, `Ticket price for how many adults, children and seniors going to the ${site}?`);
    } else {
      promptCitizenship(
        agent,
        `Ticket price for Singaporeans, Permanent Residents (PRs) or foreigners visiting the ${site}?`
      );
    }
    // -------------------------------------------------------------------
  } else {
    if (chance >= 0.6667) {
      promptSite(agent, "Ticket price for which site?");
    } else if (chance >= 0.3333) {
      promptPeople(agent, "Ticket price for how many children, adults and seniors?");
    } else {
      promptCitizenship(agent, "Ticket price for Singaporeans, Permanent Residents (PRs) or foreigners?");
    }
    // -------------------------------------------------------------------
  }
};

module.exports = {
  promptCitizenship,
  promptPeople,
  promptSite,
  replyTicketPrice
};
