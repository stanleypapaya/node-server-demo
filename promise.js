$.ajax = function({ url, method, body}){
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.send(body)
        xhr.onreadystatechange = () =>{
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300){
                    resolve.call(undefined, xhr.responseText)
                } else if(xhr.status >= 400){
                    reject.call(undefined, xhr)
                }
            }
        }
    })
    
}

button.addEventListener('click' , (e)=>{
    $.ajax({
        url: '/xxx',
        method: 'post',
        body: '第四部分',
        }).then(
           (text) => {console.log(text)},
           (xhr) => {console.log(xhr)} 
        )  
})

