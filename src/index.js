const http = require("http");
const { bodyParser } = require("./lib/bodyParser");

let getTaskHandler = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
};

let createTaskHandler = async (req, res, data) => {
  try {
    await bodyParser(req);
    data.push(req.body);
    getTaskHandler(res, 200, data);
  } catch (error) {
    getTaskHandler(res, 400, { "Invalid data": error.message });
  }
};

let editTaskHandler = async (req, res, data, method) => {
  let { url } = req;
  let idQuery = url.split("?")[1];
  let idKey = idQuery.split("=")[0];
  let idValue = idQuery.split("=")[1];
  if (idKey === "id" && idValue === url.idValue) {
    switch (method) {
      case "put":
        await bodyParser(req);
        data[idValue - 1] = req.body;
        getTaskHandler(res, 200, { message: "Update successfully" });
        break;
      case "delete":
        await bodyParser(req);
        data.splice(idValue - 1, 1);
        getTaskHandler(res, 200, { message: "Deleted successfully" });
        break;

      default:
        getTaskHandler(res, 400, { message: "Invalid Query" });
        break;
    }
  }else{
    getTaskHandler(res, 400, { message: "Invalid Query" });
  }  
};

let updateTaskHandler = async (req, res, data) => {
  try {
    editTaskHandler(req, res, data, "put");
  } catch (error) {
    editTaskHandler(req, res, { "Invalid body data": error.message }, "put");
  }
};

let deleteTaskHandler = async (req, res, data) => {
  try {
    editTaskHandler(req, res, data, "delete");
  } catch (error) {
    editTaskHandler(req, res, { "Invalid body data": error.message }, "delete");
  }
};

let database = [];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  //Logger
  console.log(`URL: ${url} - Method: ${method}`);

  switch (method) {
    case "GET":
      if (url === "/") {
        getTaskHandler(res, 200, { message: "hello" });
      }
      if (url === "/tasks") {
        getTaskHandler(res, 200, database);
      }
      break;

    case "POST":
      if (url === "/tasks") {
        createTaskHandler(req, res, database);
      }
      break;

    case "PUT":
      updateTaskHandler(req, res, database);
      break;

    case "DELETE":
      deleteTaskHandler(req, res, database);
      break;

    default:
      getTaskHandler(res, 404, { message: "404 Not Found" });
  }
});
server.listen(3000);
console.log("Server on port", 3000);
