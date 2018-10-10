/* 
使用JS包装readFile
created by Laitou on 2018/10/10
 */
const fs=require('fs');
module.exports={
    readDir:function(path,options){
        return new Promise(resolve=>{
            fs.readdir(path,options,(err,files)=>{
                if(err){
                    throw err;
                }
                resolve(files);
            });
        });  
    },
    readFile:function(path,options){
        return new Promise(resovel=>{
            fs.readdir(path,options,(err,content)=>{
                if(err){
                    throw err;
                }
                resolve(content);
            });
        });
    }
}