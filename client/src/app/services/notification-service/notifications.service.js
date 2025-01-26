import axios from "axios";

const API_URL = `${import.meta.env.VITE_REACT_APP_HOST}notification/notifications/`;
import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem('user'))
const getAllNotifications = async (
  page = 1,
  limit = 10,
  fields = [],
  filterFields = {},
  search = "",
  searchFields = [],
  sortField = '',  // Include sortField with a default value
  sortOrder = 'desc',  // Include sortOrder with a default value 'desc'
) => {
  try {
    const response = await fetchData({
      API_URL,
      endpoint: 'getAllNotifications',
      options: {
        page,
        limit,
        fields,
        filterFields,
        search,
        searchFields,
        sortField,  // Pass sortField to fetchData
        sortOrder,  // Pass sortOrder to fetchData
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

const getNotification = (filterFields = {}, fields = []) => {
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
  return axios.get(API_URL + "getNotification" + queryParams);
};

const createNotification = (notificationData) => {
  return axios.post(API_URL + "createNotification/", {...notificationData, created_by: user?.user_id} );
};

const updateNotification = (id, updatedData) => {
  return axios.put(API_URL + "updateNotification/" + id, {...updatedData, modified_by: user?.user_id});
};

const deleteNotification = (id) => {
  return axios.delete(API_URL + "deleteNotification/" + id + "/"+ user?.user_id);
};

const NotificationService = {
  getAllNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
};

export default NotificationService;
