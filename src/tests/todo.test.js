const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const Todo = require("../models/todoModel");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Todo.deleteMany();
});

afterAll(async () => {
  await Todo.deleteMany();
  await mongoose.connection.close();
});

describe("Todo API", () => {
  let todoId;

  test("Should create a new todo", async () => {
    const res = await request(app).post("/api/todos").send({ title: "Test Todo" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Todo");
    todoId = res.body._id;
  });

  test("Should fetch all todos", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test("Should update a todo", async () => {
    const res = await request(app).put(`/api/todos/${todoId}`).send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  test("Should delete a todo", async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`);
    expect(res.statusCode).toBe(200);
  });

  test("Should return 400 for missing title", async () => {
    const res = await request(app).post("/api/todos").send({});
    expect(res.statusCode).toBe(400);
  });
});
