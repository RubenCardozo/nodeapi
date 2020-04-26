const http = require ('http');

const server = http.createServer((req, res)=>{
    const {url, method} = req;
    //Logger
    console.log(`URL: ${url} - Method: ${method}`);
    res.writeHead(200, {'Content Type': 'text/plain'});
    res.write('Received');
    res.end();
});
server.listen(3000);