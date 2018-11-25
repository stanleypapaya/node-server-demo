button.addEventListener('click' , (e)=>{
  let xhr = new XMLHttpRequest()
  xhr.open('post', '/xxx')
  xhr.setRequestHeader('Content-Type', 'x-www-form-urlencoded')
  xhr.send('第四部分')
  xhr.onreadystatechange = () =>{
    if(xhr.readyState === 4){
      console.log(xhr.status)
      console.log(xhr.statusText)
      if(xhr.status >= 200 && xhr.status < 300){
        let string = xhr.responseText
        let object = window.JSON.parse(string)
        console.log('请求成功')
        console.log(xhr.getAllResponseHeaders())
        console.log(string)
        console.log(object)
      } else if(xhr.status >= 400){
        console.log('请求失败')
      }
    }
  }
})