const mongoose = require("mongoose");
const db = require("../models");

exports.paginateAndFilter = async (model, req) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";
    const fetchAll = limit === -1;
    const sortField = req.query.sortField || "cdate_time";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const filter = { is_deleted: false };
    const filterFields = req.query.filterFields
      ? JSON.parse(req.query.filterFields)
      : {};
    const search = req.query.search || "";
    let searchFields = req.query.searchFields
      ? JSON.parse(req.query.searchFields)
      : [];
    const metadataOnly = req.query.metadataOnly === "true";

    // Flatten searchFields if it's an array of arrays
    if (
      Array.isArray(searchFields) &&
      searchFields.length > 0 &&
      Array.isArray(searchFields[0])
    ) {
      searchFields = searchFields.flat();
    }

    // Apply filter fields to the query
    Object.keys(filterFields).forEach((key) => {
      const value = filterFields[key];
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        "$in" in value
      ) {
        // Ensure that '$in' is properly structured for arrays
        if (Array.isArray(value["$in"])) {
          filter[key] = { $in: value["$in"] };
        } else {
          filter[key] = value; // Fallback to the original value if not array
        }
      } else {
        filter[key] = value;
      }
    });

    // Add search functionality to the filter
    if (search && searchFields.length > 0) {
      filter["$or"] = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    // Fetch total items count
    const totalItems = await model.countDocuments(filter);
    const totalPages = fetchAll ? 1 : Math.ceil(totalItems / limit);

    // Return only metadata if requested
    if (metadataOnly) {
      return { totalPages, totalItems };
    }

    let query = model.find(filter, fields).sort({ [sortField]: sortOrder });

    // Apply pagination if not fetching all records
    if (!fetchAll) {
      query = query.skip((page - 1) * limit).limit(limit);
    }

    // Fetch results
    const results = await query;

    // Return the results and pagination details
    return { data: results, totalPages, totalItems };
  } catch (error) {
    throw new Error(error.message || "Error occurred while retrieving data.");
  }
};

// const mongoose = require('mongoose');

// exports.paginateAndFilter = async (model, req) => {
//   try {
//     // Pagination parameters
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const fields = req.query.fields ? req.query.fields.split(",").join(" ") : "";

//     // Sorting parameters
//     const sortField = req.query.sortField || 'cdate_time'; // Default sort field
//     const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // Default sort order

//     // Base filter - assuming all schemas have an is_deleted flag
//     const filter = { is_deleted: false };
//     const filterFields = req.query.filterFields ? JSON.parse(req.query.filterFields) : {};

//     // Dynamically add filterFields to the filter
//     Object.keys(filterFields).forEach(key => {
//       const value = filterFields[key];
//       if (model.schema.path(key) instanceof mongoose.Schema.Types.Array &&
//           typeof value === 'object' && value !== null && !Array.isArray(value)) {
//         Object.keys(value).forEach(subKey => {
//           filter[`${key}.${subKey}`] = { $in: Array.isArray(value[subKey]) ? value[subKey] : [value[subKey]] };
//         });
//       } else {
//         filter[key] = value;
//       }
//     });

//     let query = model.find(filter, fields);

//     // Apply dynamic sorting based on the provided field and order
//     const sort = {};
//     sort[sortField] = sortOrder;
//     query = query.sort(sort);

//     const results = await query
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return results;
//   } catch (error) {
//     throw new Error(error.message || "Error occurred while retrieving data.");
//   }
// };
