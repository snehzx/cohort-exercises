//complex types (objects in js ) assign

//assign-1:-
function isLegal(users) {
  let legalUser = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].age >= 18 && users.gender == "male") {
      legalUser.push(users[i].name);
    }
  }
  return legalUser;
}
const users = [
  {
    name: "sneha",
    age: 20,
    gender: "male",
  },
  {
    name: "muso",
    age: 18,
    gender: "female",
  },
  {
    name: "harsh",
    age: 12,
    gender: "male",
  },
];
console.log(isLegal(users));

//assign-2:-
function greet(userss) {
  for (let i = 0; i < userss.length; i++) {
    console.log(`hii ${userss[i].name} you are ${userss[i].age}`);
  }
}
let userss = [
  {
    name: "sneha",
    age: 20,
  },
  {
    name: "muso",
    age: 18,
  },
];
greet(userss);

//assign-3:-
/*function greet(users) {
  for (let key in users) {
    const user = users[key];
    console.log(`hii ${user.gender} ${user.name},you are good`);
  }
}
function isLegal(users) {
  for (let key in users) {
    const user = users[key];
    if (user.age > 18) {
      console.log(`${user.name} is legal`);
    }
  }
}
let users = {
  user1: {
    name: "sneha",
    gender: "mrs",
    age: 20,
  },
  user2: {
    name: "muso",
    gender: "mr",
    age: 18,
  },
};
greet(users);
isLegal(users);*/

//asign-4:-
// We don’t write even(arr) because filter needs the function, not its result.
// filter itself calls even(element) for each array item.
/*let arr = [1, 2, 3, 4, 5, 6];
function even(element) {
  return element % 2 === 0;
}
let even_no = arr.filter(even);
console.log(even_no);*/

//asign-5:-
let uint8Arr = new Uint8Array([0, 255, 127, 128]);
uint8Arr[1] = 300;
console.log(uint8Arr);
