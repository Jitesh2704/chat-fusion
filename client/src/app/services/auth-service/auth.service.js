import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_HOST + "auth/";
const user = JSON.parse(localStorage.getItem("user"));
import fetchData from "../../utils/queryBuilder";

const register = async ({ fname, lname, username, email, password }) => {
  try {
    const res = await axios.post(API_URL + "signup", {
      fname,
      lname,
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.error("An error occurred during the registration process:", error);
    throw error; // or return some error data
  }
};

const login = async ({ username, password }) => {
  try {
    const response = await axios.post(API_URL + "signin", {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("An error occurred during the login process:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    const res = await axios.post(API_URL + "signout");
    return res.data;
  } catch (error) {
    console.log("An Error occured during the Signout process:", error);
    throw error;
  }
};

const updatePassword = async ({ email, old_password, new_password }) => {
  const res = await axios.post(API_URL + "updatePassword", {
    email,
    old_password,
    new_password,
  });
  return res.data;
};

const getAllAuthUsers = async (
  page = 1,
  limit = 10,
  fields = [],
  filterFields = {},
  search = "",
  searchFields = [],
  sortField = "", 
  sortOrder = "desc" 
) => {
  try {
    const response = await fetchData({
      API_URL,
      endpoint: "getAllAuthUsers",
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
    return response;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
};

const getAuthUser = (filterFields = {}, fields = []) => {
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

  return axios.get(API_URL + "getAuthUser" + queryParams);
};

const createAuthUser = (authUserData) => {
  return axios.post(API_URL + "createAuthUser", {
    ...authUserData,
    created_by: user?.user_id,
  });
};

const updateAuthUser = (id, updatedData) => {
  return axios.put(API_URL + "updateAuthUser/" + id, {
    ...updatedData,
    modified_by: user?.user_id,
  });
};

const AuthService = {
  register,
  login,
  logout,
  getAuthUser,
  updatePassword,
  getAllAuthUsers,
  createAuthUser,
  updateAuthUser,
};

export default AuthService;
