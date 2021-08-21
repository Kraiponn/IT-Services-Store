const filterResults = (model, populate) => async (req, res, next) => {
  let query;

  // Query Object
  const qryObj = { ...req.query };

  // Excludes Field
  const excludesField = ["select", "page", "sort", "limit"];

  // Remove some field
  excludesField.forEach((param) => delete qryObj[param]);

  // Create Query String
  const qryStr = JSON.stringify(qryObj);

  // Filter => lt,lte,gt,gte or in
  qryStr = qryStr.replace(/\b(lt|lte|gt|gte|in)\b/g, (match) => `$${match}`);

  // Finding resources
  query = model.find(JSON.parse(qryStr));

  // Filter some field
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort documents by desc or asc
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query.sort("-createdAt");
  }

  // Create pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const startInex = (page - 1) * limit;
  const endIndex = page * limit;

  // Count all documents for this collection
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Pupulate foreign field
  if (populate || populate.length > 0) {
    for (let index = 0; index < populate.length; index++) {
      query = query.populate(populate[index]);
    }
  }

  // Pagination
  let pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Executing query
  const results = await query;

  res.filterResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = filterResults;
