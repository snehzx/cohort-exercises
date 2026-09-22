//readonly

type Book = {
  readonly name: String;
  edition: number;
};

const book: Book = {
  name: "atmoic habits",
  edition: 3,
};

console.log(book.edition);
//book.name = "bhagwatGita"; - cant do this as the property is readonly

console.log(book.name);

//partial

type Todo = {
  id: number;
  title: string;
  description: string;
  done: boolean;
};

const todo: Partial<Todo> = {
  id: 1,
  title: "ts",
  done: true,
};

console.log(todo);
//in functions partial can even passed with nothing it will still accept

function updateTodo(todo: Partial<Todo>) {
  console.log(todo);
}
updateTodo({});

//required

type User = {
  name?: string;
  password?: string;
};
//even tho it is optional it is required
const getUser = (user: Required<User>) => {
  console.log(user);
};
getUser({ name: "sneha", password: "123" });

//pick

type LivingThings = {
  kingdom: string;
  domain: string;
  isAlive: boolean;
};
type info = Pick<LivingThings, "kingdom" | "domain">;
const animal: info = {
  kingdom: "Animelia",
  domain: "Eukarya",
};

console.log(animal);

//exclude - only works on unions not objects , omit works on objects

type A = "a" | "b" | "c";

type B = Exclude<A, "b">;

// exclude map
type User3 = {
  id: number;
  name: string;
  password: string;
};
type SafeUser = {
  [K in Exclude<keyof User3, "password">]: User3[K];
};
const safeUser: SafeUser = {
  id: 2,
  name: "sneha",
};
console.log(safeUser);

//omit - simpler way of using map+exclude ,, internally uses it only

type user2 = {
  username: string;
  email: string;
  secret_password: string;
};

const getUser2: Omit<user2, "secret_password"> = {
  username: "sneha",
  email: "sneha@gmail.com",
};

console.log(getUser2);

//record:key,value pair

type RoleName = "admin" | "user" | "guest";
type Roles = Record<RoleName, number>;

const roles: Roles = {
  admin: 1,
  user: 2,
  guest: 3,
};
console.log(roles.admin);
