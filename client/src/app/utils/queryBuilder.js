// import axios from "axios";

// const fetchData = ({
//   API_URL,
//   endpoint,
//   page = 1,
//   limit = 10,
//   fields = [],
//   filterFields = {},
//   search = "",
//   searchFields = [],
//   sortField = "",
//   sortOrder = "desc",
// }) => {
//   const queryParams = new URLSearchParams({ page, limit });

//   if (fields.length > 0) queryParams.append("fields", fields.join(","));
//   if (Object.keys(filterFields).length > 0)
//     queryParams.append("filterFields", JSON.stringify(filterFields));
//   if (search) queryParams.append("search", search);
//   if (searchFields.length > 0)
//     queryParams.append("searchFields", JSON.stringify(searchFields));
//   if (sortField) {
//     queryParams.append("sortField", sortField);
//     queryParams.append("sortOrder", sortOrder);
//   }

//   return axios.get(`${API_URL}${endpoint}?${queryParams.toString()}`);
// };

// export default fetchData;

import axios from "axios";

/**
 * Builds a query string and performs a GET request to the specified endpoint.
 *
 * @param {string} API_URL - The base URL of the API.
 * @param {string} endpoint - The API endpoint to which the request is made.
 * @param {Object} options - An object containing various parameters for the request.
 * @param {number} [options.page=1] - The page number for pagination.
 * @param {number} [options.limit=10] - The limit of items per page for pagination.
 * @param {Array} [options.fields=[]] - The fields to be returned in the response.
 * @param {Object} [options.filterFields={}] - The fields used for filtering the results.
 * @param {string} [options.sortField=''] - The field by which to sort the results.
 * @param {string} [options.sortOrder='desc'] - The order of sorting, can be 'asc' or 'desc'.
 * @param {string} [options.search=""] - The search keyword.
 * @param {Array} [options.searchFields=[]] - The fields against which the search should be performed.
 * @returns {Promise} - The promise object representing the result of the HTTP GET request.
 */
const fetchData = ({
  API_URL,
  endpoint,
  options: {
    page = 1,
    limit = 10,
    fields = [],
    filterFields = {},
    search = "",
    searchFields = [],
    sortField = "",
    sortOrder = "desc",
  } = {},
}) => {
  let queryParams = `?page=${page}&limit=${limit}`;

  if (fields.length > 0) {
    queryParams += `&fields=${fields.join(",")}`;
  }

  if (Object.keys(filterFields).length > 0) {
    queryParams += `&filterFields=${encodeURIComponent(
      JSON.stringify(filterFields)
    )}`;
  }

  if (sortField) {
    queryParams += `&sortField=${sortField}&sortOrder=${sortOrder}`;
  }

  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  if (searchFields.length > 0) {
    queryParams += `&searchFields=${encodeURIComponent(
      JSON.stringify(searchFields)
    )}`;
  }

  return axios.get(`${API_URL}${endpoint}${queryParams}`);
};

export default fetchData;
