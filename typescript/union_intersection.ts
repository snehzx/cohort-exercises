//union

type stringOrNum = string | number;
function print(id: stringOrNum) {
  console.log(`id:${id}`);
}
print(12);
print("112");

//intersection

type Employee = {
  name: String;
  startDate: Date;
};
type Manager = {
  name: string | number;
  department: string;
};

type TeamLead = Employee & Manager;

const teamLead: TeamLead = {
  name: "sneha",
  startDate: new Date(),
  department: "cse",
};
console.log(teamLead);
