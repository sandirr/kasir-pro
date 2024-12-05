const token = "@biz_pro_token";
const workbench = "@biz_pro_workbench";

export const setToken = (val) => {
  localStorage.setItem(token, val);
};

export const getToken = () => {
  const val = localStorage.getItem(token);
  return val || "";
};

export const setLocalWorkbench = (val) => {
  localStorage.setItem(workbench, JSON.stringify(val));
};

export const getLocalWorkbench = () => {
  const val = localStorage.getItem(workbench);
  return val ? JSON.parse(val) : null;
};
