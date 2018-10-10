# promise是什么
1. promise对象用作异步计算
2. 一个promise实例代表一个值，这个值可能现在不存在，或者未来也不存在
3. 按照用途来解释 1.它主要用于一部计算 2.可以将异步操作队列化，按照期望的顺序执行，返回复合预期的结果 3.可以在对象之间传递或操作promise，帮助我们处理队列
# promise产生原因
1. js包含大量异步操作 
javascript为检查表单而生 
创造它的首要目标是操作DOM 
所以，JavaScript的操作大多是异步的。
2. 异步操作的常见语法
事件监听与响应：
document.getElementById('start').addEventListener('click',start,false);
function start(){
    //响应事件，进行相应的操作
}
//jquery用'.on()'也是事件监听
$('#start').on('click',start);
回调：
//比较常见的有ajax
$.ajax('http://baidu.com',{
    success:function(res){
        //这里就是回调函数了
    }
})；
//或者在页面加载完毕后回调
$(function(){
    //这里也是回调函数
})
3. 浏览器中的JavaScript
异步操作以事件为主
回调主要出现在Ajax和File API
4. 有了Node.js之后
对异步的依赖加剧了
无诸塞高并发，是node.js的招牌
异步操作是其保障
大量操作依赖回调函数
# 异步回调的问题
1. 稍有不慎，就会踏入“回调地狱”
a(function (resultsFormA){
    b(resultsFormA,function(resultsFormB){
        c(resultsFormB),function(resultsFormC){
            d(resultsFormC),function(resultsFormD){
                e(resultsFormD),function(resultsFormE){
                    f(resultsFormE),function(resultsFormF){
                        console.log(resultsFormF);
                    }
                }
            }
        }
    })
});
2. 回调的四个问题
嵌入层次很深，难以维护
无法正常使用return和throw
无法正常检索堆栈信息
在多个回调之间难以建立联系
# promise 简介
1. promise 详解
new Promise(
    <!-- 执行executor -->
    function(resolve,reject){
        //一段耗时很长的异步操作
        resolve();//数据处理完成
        reject();//数据处理出错
    }
)
.then(function A(){
    //成功，下一步
}，function B(){
    //失败，相应处理
});
promise 是一个代理对象，它和原先要进行的操作并无关系。
它通过引入一个回调，避免更多的回调
promise有三个状态：
pending[待定]初始化状态
fulfilled[实现]操作成功
rejacted[被否决]操作失败

promise状态发生改变，就会触发.then()里的响应函数处理后续步骤
promise状态一经改变，不会再变
# 引出.then()
.then()接受两个函数作为参数，分别代表fulfilled和rejected
.then()返回一个新的promise实例，所以他可以链式调用
当前面的promise状态改变时，.then()根据其最终状态，选择特定的状态响应函数执行
状态响应函数可以返回新的promise，或其他值
如果返回新的promise，那么下一级.then()会在新的promise状态改变之后执行
如果返回其他任何值，则会立刻执行下一级.then()
#then的嵌套
1. .then()里有.then()的情况
因为.then()返回的还是promise实例
会等里面的.then()执行，在执行外面的。
对于我们来说，此时最好将其展开，会更好读
#错误处理
1. promise会自动捕获内部异常，并交给rejected响应函数处理
2. 处理错误的两种方法
reject('错误信息').then(null, message=>{})
throw new Error('错误信息').catch(message=>{})
推荐使用第二种，更加清晰好读，并且可以捕获前面的错误
# 错误和then连用
1. 强烈建议在所有队列最后加上.catch()，以避免漏掉错误处理造成意想不到的问题
doSomething()
.doAnotherThing()
.doMoreThing()
.catch(err=>{
    console.log(err);
});
# promise.all
1.promise.all()批量执行
promise.all([p1,p2,p3...])用于将多个promise实例，包装成一个新的promise实例
返回的实例就是普通的promise
他接受一个数组作为参数
数组里可以是promise对象，也可以是别的值，只会promise会等状态改变
当所有子promise都完成，该promise完成，返回值是全部值的数组
有任何一个失败，该promise失败，返回值时第一个失败的子promise的结果
#实现队列
1. let promise=doSomething();
promise=promise.then(doSomethingElse);
promise=promise.then(doSomethingElse2);
promise=promise.then(doSomethingElse3);
2. 使用.forEach()
function queue(things){
    let promise=Promise.resolve();
    things.forEach(thing=>{
        promise=promise.then(()=>{
              return new Promise(resolve=>{
            doThing(thing,()=>{
                resolve();
            });
        });
      });
    });
    return promise;
}
queue(['lots','of','things'....]);
3. 使用reduce()
function queue(things){
    return things.reduce((promise,thing)=>{
        return promise.then(()=>{
            return new Promise(resolve=>{
                doThing(thing,()=>{
                    resolve();
                })
            })
        })
    },Promise.resolve());
}

queue(['lots','of','things'....]);
4. 两个常见的错误
错误1
things.forEach(thing=>{
    promise.then(()=>{
        return new Promise(resolve=>{
            doThing(thing,()=>{
                resolve();
            });
        });
    });
});
没有把.then()产生的新Promise实例赋给promise，没有生成队列
错误2
function queue(things){
    return things.reduce((promise,thing)=>{
        let step=new Promise(resolve=>{
            doThing(thing,()=>{
                resolve();
            });
        });
        return promise.then(step);
    },Promise.resolve());
}
Promise实例创建之后，会立刻运行执行器代码，所以这个也无法达成队列的效果
#Promise.resolve()
1. 返回一个fulfilled的Promise实例，或原始Promise实例
参数为空，返回一个状态为fulfilled的Promise实例
参数是一个跟Promise无关的值，同上，不过fulfilled响应函数会得到这个参数
参数为Promise实例，则返回该实例，不做任何修改
参数为thenable，立刻执行它的.then()
# Promise.reject()
1. 返回一个rejected的Promise实例
Promise.reject()不认thenabnle
其他与Promise.resolve类似
#Promise.race()
1. 类似Promise.all()，区别在于他有任意一个完成就算完成
2. 常见用法：
把异步操作和定时器放在一起
如果定时器先触发，就认为超时，告知用户
#把回调包装成Promise
1. 把回调包装成Promise最为常见。他有两个显而易见的好处：
可读性好
返回结果可以加入任何Promise队列
#异步函数
1. async/await Es2017新增运算符，新的语言元素
赋予JavaScript以顺序手法编写异步脚本的能力
既保留异步运算的无阻塞特性，还继续使用同步写法
还能正常使用return/try/catch
2. 为什么要学promise
async/await仍然需要Promise



