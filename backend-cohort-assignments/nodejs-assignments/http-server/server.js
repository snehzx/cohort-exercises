// start creating server here
import http from "http";
import { URL } from "url";

let id = 1;
let todos = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(`http://localhost:3000${url}`);
  const pathName = parsedUrl.pathname;
  const Id = parsedUrl.searchParams.get("id");

  if (method === "POST" && pathName === "/create/todo") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));

    req.on("end", () => {
      const { title, description } = JSON.parse(body);
      const data = {
        id: id,
        title,
        description,
      };
      id++;

      todos.push(data);
      res.writeHead(200, "posted", { "content-type": "application/json" });
      res.end(JSON.stringify(todos));
    });
  } else if (method === "GET" && pathName === "/todos") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (method === "GET" && pathName === "/todo" && Id) {
    const todo = todos.find((t) => t.id === Number(Id));
    if (!todo) {
      return res
        .writeHead(404)
        .end(JSON.stringify({ error: "Todo not found" }));
    }
    return res.writeHead(200).end(JSON.stringify(todo));
  } else if (method === "DELETE" && pathName === "/todo" && Id) {
    const todo = todos.find((t) => t.id === Number(Id));
    if (!todo) {
      return res
        .writeHead(404)
        .end(JSON.stringify({ error: "Todo not found" }));
    }
    todos = todos.filter((t) => t.id !== Number(Id));

    res.writeHead(200).end();
  } else if (method === "GET" && pathName === "/") {
    res.writeHead(200);
    res.end("Hello World");
  } else {
    res.writeHead(404).end();
  }
});
server.listen(3000, () => console.log("server has started"));
