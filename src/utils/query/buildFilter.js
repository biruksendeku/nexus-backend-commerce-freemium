

// import custom package
const buildSearchQuery = require('./buildSearchQuery');


const buildFilter = (query) => {
  const { name, category, minPrice, maxPrice } = query;
  const filter = {};

  // Search by name
  if (name && name.trim() !== '') {
    Object.assign(filter, buildSearchQuery(name));
  }

  // Filter by category
  if (category && category.trim() !== '') {
    filter.category = category.trim();
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    filter.totalAmount = {};
    if (minPrice) filter.totalAmount.$gte = parseFloat(minPrice);
    if (maxPrice) filter.totalAmount.$lte = parseFloat(maxPrice);
  }

  // Only show in-stock items by default
  filter.stock = { $gt: 0 };

  return filter;
};



// export the function
module.exports = buildFilter;
