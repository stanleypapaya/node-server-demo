var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method


  if(path === '/'){  // 如果用户请求的是 / 路径
    var amount = fs.readFileSync('./db', 'utf8')
    var string = fs.readFileSync('./index.html', 'utf8')  
    string = string.replace('&&&amount&&&', amount)
    response.setHeader('Content-Type', 'text/html;charset=utf-8')  
    response.end(string)   
  }else if(path === '/sign_up' && method === 'GET'){
    var string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === 'POST'){
    readBody(request).then((body)=>{
      let strings = body.split('&')
      let hash = {}
      strings.forEach((string) => {
        //string == 'email = 1'
        let parts = string.split('=') // ['email', '1']
        let key = parts[0]
        let value = parts[1]
        hash[key] = value
      }) 
      let {email, password, password_confirmation} = hash
      if(email.indexOf('@') === -1){
        response.statusCode = 400
        response.write('please enter your email with "@" again')
      } else if(password !== password_confirmation){
        response.statusCode = 400
        response.write('password not match')
      }
      else{response.statusCode = 200}
      response.end()
    })
  }else if(path === '/style.css'){   
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.end(string)
  }else if(path === '/main.js'){  
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.end(string)
  }else if(path === '/jq.js'){  
    var string = fs.readFileSync('./jq.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.end(string)
  }else if(path === '/promise.js'){  
    var string = fs.readFileSync('./promise.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.end(string)
  }else if(path === '/pay' && method.toUpperCase() === 'POST'){
    var amount = fs.readFileSync('./db', 'utf-8')
    var newAmount = amount - 1
    fs.writeFileSync('./db', newAmount)
    response.write('success')
    response.end()
  }else if(path === '/xxx'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.write(`{
      "note":{
        "to": "小谷",
        "from": "方方",
        "heading": "打招呼",
        "content": "hi"
      }
    }`)
    response.end()
  }else{  
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8') 
    response.write('找不到对应的路径，你需要自行修改 index.js')
    response.end()
  }


  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

function readBody(request){
  return new Promise((resolve,reject) =>{
    let body = []
    request.on('data', (chunk) => {
      body.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(body).toString()
      // at this point, `body` has the entire request body stored in it as a string
      resolve(body)
    })
  })
}

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)
