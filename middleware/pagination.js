/**
 * paginatedResults - this is a function for the search results (shelved, priority MVP)
 * it will display the model param in pages but with limit
 * limit is the number of records to display at any time
 */
const paginatedResults = async (model) => {
  return async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    if (page === undefined || page === null) {
      page = 1;
    }

    if (limit > 20 || limit === undefined || limit === null) {
      limit = 20;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

module.exports = paginatedResults;
