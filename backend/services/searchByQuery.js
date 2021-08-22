const FIND_BY_TITLE = "FIND_BY_TITLE";
const FIND_BY_DESCRIPTION = "FIND_BY_DESCRIPTION";

const searchByQueries = async (model, findBy, req, res, populate) => {
  // Qurey object
  const queryObj = { ...req.query };

  let query;

  // Make sure it's a search by query or keyword
  if (req.query.search) {
    query =
      findBy === FIND_BY_TITLE
        ? model.find({
            title: new RegExp(`.*${queryObj.search}.*`, "gim"),
          })
        : model.find({
            // title: new RegExp(escapeRegex(req.query.search), "gi"),
            description: new RegExp(`.*${queryObj.search}.*`, "gim"),
          });
  } else {
    const excludesFields = ["page", "select", "sort", "limit"];

    excludesFields.forEach((param) => delete queryObj[param]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(in|gt|gte|lt|lte)\b/,
      (match) => `$${match}`
    );

    // Finding resources
    query = model.find(JSON.parse(queryStr));
  }

  // Sorting results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Selecting some fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 9;
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  // Join fields
  if (populate) {
    for (let index = 0; index < populate.length; index++) {
      query = query.populate(populate[index]);
    }
  }

  // Created pagination field
  let pagination = {};

  // Create next field
  if (lastIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  // Create previous field
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Executing query
  const results = await query;

  return res.status(200).json({
    success: true,
    data: {
      count: results.length,
      pagination,
      results,
    },
  });
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
  FIND_BY_TITLE,
  FIND_BY_DESCRIPTION,
  searchByQueries,
};
