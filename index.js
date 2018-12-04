var http = require('http')
var fs = require('fs')
var url = require('url')
var md5 = require('md5')

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
    let cookie = request.headers.cookie //sign_in_email=154892616@qq.com;age=1;bithday=...;
    if(cookie){
      let cookies = cookie.split(';')//['sign_in_email=154892616@qq.com','age=1']
      let hash = {}
      for(let i = 0; i< cookies.length; i++){
        let parts = cookies[i].split('=')//parts = ['sign_in_email','154892616@qq.com']
        let key = parts[0]
        let value = parts[1]
        hash[key] = value  
      }
      let email = hash['sign_in_email']
      var users = fs.readFileSync('./database/users', 'utf8')
        users = JSON.parse(users)
        let foundUser 
        for(let i = 0; i < users.length; i++){
          let user = users[i]
          if(user['email'] === email){
            foundUser = users[i]
            break
          }
        }
        if(foundUser){
          string = string.replace('__password__', foundUser.password)
        } else {
          string = string.replace('__password__', 不知道)
        }
    }
    string = string.replace('&&&amount&&&', amount)
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')  
    response.end(string)   
  }else if(path === '/sign_in' && method === 'GET'){
    var string = fs.readFileSync('./sign_in.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_in' && method === 'POST'){
    readBody(request).then((body)=>{
      let strings = body.split('&')//['email=1','password=2','password_confirmation=2']
      let hash = {}
      strings.forEach((string) => {
        //string == 'email = 1'
        let parts = string.split('=') // ['email', '1']
        let key = parts[0]
        let value = parts[1]
        hash[key] = decodeURIComponent(value)
      }) 
      let {email, password} = hash
      var users = fs.readFileSync('./database/users', 'utf8')
      try{
        users = JSON.parse(users)
      }catch(errors){
        users = []
      }
      let found 
      for(let i = 0; i < users.length; i++){
        let user = users[i]
        if(user['email'] === email && user['password'] === password){
          found = true
          break
        }
      }
      if(found){
        response.setHeader('Set-Cookie', `sign_in_email=${email}`)
        response.statusCode = 200
      }else {
        response.statusCode = 401
      }
      response.end()
    })
  }else if(path === '/sign_up' && method === 'GET'){
    var string = fs.readFileSync('./sign_up.html', 'utf8')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/sign_up' && method === 'POST'){
    readBody(request).then((body)=>{
      let strings = body.split('&')//['email=1','password=2','password_confirmation=2']
      let hash = {}
      strings.forEach((string) => {
        //string == 'email = 1'
        let parts = string.split('=') // ['email', '1']
        let key = parts[0]
        let value = parts[1]
        hash[key] = decodeURIComponent(value)
      }) 
      let {email, password, password_confirmation} = hash
      if(email.indexOf('@') === -1){
        response.statusCode = 400
        response.setHeader('Content-Type', 'application/json;charset=utf-8')
        response.write(`{
          "errors": {
            "email": "invalid"
          }
        }`)
      } else if(password !== password_confirmation){
        response.statusCode = 400
        response.write('password not match')
      }
      else{
      var users = fs.readFileSync('./database/users', 'utf8')
      try{
        users = JSON.parse(users)
      }catch(errors){
        users = []
      }
      let inUse = false
      for(let i = 0; i < users.length; i++){
        let user = users[i]
        if(user['email'] === email){
          inUse = true
          break
        }
      }
      if(inUse){
        response.statusCode = 400
        response.write('email in use')
      } else {
        users.push({'email': email, 'password': password})
        usersString = JSON.stringify(users)
        fs.writeFileSync('./database/users', usersString)
        response.statusCode = 200
      }
    }
      response.end()
    })
  }else if(path === '/style.css'){   
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.end(string)
  }else if(path === '/main.js'){  
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    let fileMd5 = md5(string)
    response.setHeader('ETag', fileMd5)
    if(request.header['if-none-match']=== fileMd5){
      //没有响应体
      response.statusCode = 304
    }else{
      response.write(string)
    }
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
