console.log('start');
new Promise(resolve=>{
    setTimeout(()=>{
        throw new Error('bye');
    },2000);
})
.then(value=>{
    console.log(value+'world');
})
.catch(error=>{
    console.log('Error:'+error.message);
})