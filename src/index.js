const http = require ('http');
const {bodyParser} = require ('./lib/bodyParser')

let getTaskHandler=(req, res, status, data)=>{  
        res.writeHead(status, { "Content-Type": "application/json" })
        res.write(JSON.stringify(data))
        res.end();
};
let createTaskHandler= async (req, res, data)=>{ 
    try {
        await bodyParser(req);
        data.push(req.body);
        getTaskHandler(req, res, 200, data);
    } catch (error) {
        getTaskHandler(req, res, 404, {error: "Invalid data"});
    }   
};

let database= [];

const server = http.createServer((req, res)=>{
    const {url, method} = req;

    //Logger
    console.log(`URL: ${url} - Method: ${method}`);

    
    // res.writeHead(200, { "Content-Type": "application/json" });
    // res.write(JSON.stringify({ message: "Hello"}));
    // res.end();
    switch(method){
        case "GET":
            if (url === "/") {
                getTaskHandler(req, res, 200, {message:"hello"});
            }
            if (url === "/tasks") {
                getTaskHandler(req, res, 200, database);
            }
            break;

        case "POST":
            if (url === "/tasks") {
                createTaskHandler(req, res, database);
            }
            break;
    }
});
server.listen(3000);
console.log('Server on port', 3000);


