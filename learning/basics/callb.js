function callb() {
  console.log("callback");
}
setTimeout(callb, 1000);
setTimeout(callb, 2000);
setTimeout(callb, 3000);
let s = 0;
for (let i = 0; i < 20; i++) {
  s += i;
}
console.log(s);

/* js-architecture is single threaded which means it handles tasks one by one .. 
here setTimeOut is an async fxn which means these tasks are i/o driven tasks and are  handled externally and once done a callback is set
but this doenst mean js is multi-threaded or parallelism 
it just hands the tasks to web apis to do the work till then it handles other sync tasks which are cpu bound tasks
and if it handles the sync tasks it does nothing between it until the task is over because they are cpu driven

its something like this.. normals calls are in call stack ..if a async call comes it get into web apis and waits in the callback queue once sync tasks are done they get into 
call stack and then gets executed
*/
