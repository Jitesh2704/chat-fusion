import axios from "axios";

const API_URL = `${import.meta.env.VITE_REACT_APP_HOST}chat/chats/`;
import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem("user"));
const getAllChats = async (
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
      endpoint: "getAllChats",
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

const getChat = (filterFields = {}, fields = []) => {
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
  return axios.get(API_URL + "getChat" + queryParams);
};

const createChat = (chatData) => {
  return axios.post(API_URL + "createChat/", {
    ...chatData,
    created_by: user?.user_id,
  });
};

const updateChat = (id, updatedData) => {
  return axios.put(API_URL + "updateChat/" + id, {
    ...updatedData,
    modified_by: user?.user_id,
  });
};

const deleteChat = (id) => {
  return axios.delete(API_URL + "deleteChat/" + id + "/" + user?.user_id);
};

const ChatService = {
  getAllChats,
  getChat,
  createChat,
  updateChat,
  deleteChat,
};

export default ChatService;
