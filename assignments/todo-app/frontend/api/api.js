import axios from "../node_modules/axios/dist/esm/axios.min.js";

const base_url = "http://localhost:3001";

export function apiHeaders() {
  return { token: localStorage.getItem("token") };
}

export async function apiSignup(username, email, password) {
  await axios.post(base_url + "/signup", { email, username, password });
}
export async function apiSignin(email, password) {
  const res = await axios.post(base_url + "/signin", { email, password });
  return res.data.token;
}

export async function apiGetTodos() {
  const res = await axios.get(base_url + "/todos", { headers: apiHeaders() });
  return res.data.userTodos;
}

export async function apiAddTodo(title, description) {
  await axios.post(
    base_url + "/todos",
    { title, description },
    { headers: apiHeaders() },
  );
}

export async function apiDeleteTodo(id) {
  await axios.delete(base_url + "/todos/" + id, { headers: apiHeaders() });
}
