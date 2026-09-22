function setTimeOutPromisified(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, delay);
  });
}

setTimeOutPromisified(1000)
  .then(function () {
    console.log("1 sec has passed");
  })
  .catch(function () {
    console.log("error while printing");
  })
  .finally(function () {
    console.log("finally runs always");
  });

// callbacks are not passed in promisified version
