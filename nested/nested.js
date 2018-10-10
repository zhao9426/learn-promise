console.log('start');
new Promise(resolve=>{
    console.log('step 1');
    setTimeout(()=>{
        resolve(100);
    },1000);
})
.then(value=>{
    return new Promise(resolve=>{
        console.log('step 1-1');
        setTimeout(()=>{
            resolve(110);
        },1000);
    })
    .then(value=>{
        console.log('step 1-2');
        return value;
    })
    .then(value=>{
       console.log('step 1-3'); 
    })
})
.then(value=>{
    console.log('step 2');
});