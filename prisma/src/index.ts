import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const app = express();
app.listen(3000);

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    users,
  });
});

app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
    select: {
      todos: true,
    },
  });
  return res.json({
    user,
  });
});

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

async function CreateUser() {
  await prisma.user.create({
    data: {
      username: "snehsaa",
      password: "123s1a23",
      age: 20,
    },
  });
}
async function FindUser() {
  const user = await prisma.user.findFirst({
    where: {
      id: 1,
    },
    include: {
      todos: true,
    },
  });
  console.log(user);
}
//await CreateUser();
await FindUser();
