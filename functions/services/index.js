const localRate = {
  senior: 8,
  adult: 12,
  child: 8
};

const nonLocalRate = {
  senior: 10,
  adult: 20,
  child: 12
};

const getTotalPrice = (children = 0, adults = 0, seniors = 0, isLocal) => {
  if (isLocal) {
    return children * localRate.child + adults * localRate.adult + seniors * localRate.senior;
  } else {
    return children * nonLocalRate.child + adults * nonLocalRate.adult + seniors * nonLocalRate.senior;
  }
};

module.exports = {
  getTotalPrice
};
