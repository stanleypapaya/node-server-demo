$.ajax = function({ url, method, body, success, fail}){
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.send(body)
    xhr.onreadystatechange = () =>{
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                success.call(undefined, xhr)
            } else if(xhr.status >= 400){
                fail.call(undefined, xhr)
            }
        }
    }
}

button.addEventListener('click' , (e)=>{
    let obj = {
        url: '/xxx',
        method: 'post',
        body: '第四部分',
        success: (xhr) => {
            let string = xhr.responseText
            let object = window.JSON.parse(string)
            console.log(object)
            console.log('请求成功')
        },
        fail: (xhr) =>{
            console.log(xhr.status)
            console.log('请求失败')
        }
    }
    $.ajax(obj)
})