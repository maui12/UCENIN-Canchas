const request = require("supertest");
const app = require("../index"); // asegúrate de exportar `app` desde tu index.js
const sequelize = require("../models");
const Usuario = require("../models/usuario");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe("Auth API", () => {
  test("Registrar usuario", async () => {
    const res = await request(app).post("/api/usuarios/registro").send({
      nombre: "Test User",
      correo: "test@user.com",
      contraseña: "123456"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  test("Login usuario", async () => {
    const res = await request(app).post("/api/usuarios/login").send({
      correo: "test@user.com",
      contraseña: "123456"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
