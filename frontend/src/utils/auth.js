export const getAdminToken = () => localStorage.getItem("adminToken");

export const getAdminHeaders = (extraHeaders = {}) => {
  const token = getAdminToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const clearAdminSession = () => {
  localStorage.removeItem("adminToken");
};
