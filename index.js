const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res)=>{
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    let contentType = 'text/html';
    let extname = path.extname(filePath);
    switch (extname) {
        case ".js":
          contentType = "text/javascript";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".json":
          contentType = "application/json";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".jpg":
          contentType = "image/jpg";
          break;
    }
    if(contentType == "text/html" && extname == ""){
        filePath += '.html';
    }
    fs.readFile(filePath, (err, content) =>{
        if(err){
            if(err.code == 'ENOENT'){
                // Page not found
                fs.readFile(
                    path.join(__dirname,'404.html'),
                    (err,content) =>{
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        res.end(content, 'utf8');
                    }
                )
            }else{
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        }else{
            res.writeHead(200, {'Content-Type':contentType});
            res.end(content, 'utf8');
        }
    })
})

server.listen(PORT, ()=>console.log(`Server is running on ${PORT}`))