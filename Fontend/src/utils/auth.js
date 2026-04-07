export const saveUser = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);
};

export const getUser = () => {
  return {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
  };
};

export const logout = () => {
  localStorage.clear();
};