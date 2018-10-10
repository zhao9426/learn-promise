console.log('start');
new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject('bye');
    },2000);
})
.then(value=>{
    console.log(value+'world');
},value=>{
    console.log('Error:',value);
});
