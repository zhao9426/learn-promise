/* 
使用Promise包装以前的回调函数
created by Laitou on 2018/10/10
 */
const fs=require('./FileSystem');
fs.readFile('../README.md','utf-8')
.then(content=>{
    console.log(content);
})