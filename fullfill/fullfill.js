console.log('start');
let promise=new Promise(resolve=>{
    setTimeout(()=>{
        console.log('the promise fullfill');
        resolve('hello world');
    },1000);
})
    setTimeout(()=>{
        promise.then(value=>{
            console.log(value);
        })
    },3000);
