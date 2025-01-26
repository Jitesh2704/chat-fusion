import axios from "axios";

const API_URL = `${import.meta.env.VITE_REACT_APP_HOST}chat/messages/`;
import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem("user"));
const getAllMessages = async (
  page = 1,
  limit = 10,
  fields = [],
  filterFields = {},
  search = "",
  searchFields = [],
  sortField = "", // Include sortField with a default value
  sortOrder = "desc" // Include sortOrder with a default value 'desc'
) => {
  try {
    const response = await fetchData({
      API_URL,
      endpoint: "getAllMessages",
      options: {
        page,
        limit,
        fields,
        filterFields,
        search,
        searchFields,
        sortField, // Pass sortField to fetchData
        sortOrder, // Pass sortOrder to fetchData
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
};

const getMessage = (filterFields = {}, fields = []) => {
  let queryParams = "";

  if (fields.length > 0) {
    queryParams += `?fields=${fields.join(",")}`;
  }

  if (Object.keys(filterFields).length > 0) {
    const filterParam = `filterFields=${encodeURIComponent(
      JSON.stringify(filterFields)
    )}`;
    queryParams +=
      queryParams.length > 0 ? `&${filterParam}` : `?${filterParam}`;
  }
  return axios.get(API_URL + "getMessage" + queryParams);
};

const createMessage = (messageData) => {
  return axios.post(API_URL + "createMessage/", {
    ...messageData,
    created_by: user?.user_id,
  });
};

const updateMessage = (id, updatedData) => {
  return axios.put(API_URL + "updateMessage/" + id, {
    ...updatedData,
    modified_by: user?.user_id,
  });
};

const deleteMessage = (id) => {
  return axios.delete(API_URL + "deleteMessage/" + id + "/" + user?.user_id);
};

const MessageService = {
  getAllMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};

export default MessageService;
