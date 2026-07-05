

// sorting helper
const sortOptions = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  price_high: { totalAmount: -1 },
  price_low: { totalAmount: 1 },
  name_asc: { name: 1 },
  name_desc: { name: -1 },
};


// export the config
const buildSort = (sortBy) => {
  return sortOptions[sortBy] || sortOptions.newest; // Default to newest
};


// export the function
module.exports = buildSort;
