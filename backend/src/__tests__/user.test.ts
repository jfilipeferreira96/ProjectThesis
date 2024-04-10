import supertest from "supertest";
import app from "../app"; 

const request = supertest(app);

describe("Testes de Login", () => {
  it("Deve retornar status 401 Não Autorizado se as credenciais forem inválidas", async () => {
    const response = await request.post("/login").send({ email: "utilizador@example.com", password: "senha_incorreta" });

    expect(response.status).toBe(401);
  });

  it("Deve retornar status 400 Pedido Inválido se a senha for inválida", async () => {
    const response = await request.post("/login").send({ email: "utilizador@example.com", password: "senha_incorreta" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Senha inválida");
  });

  it("Deve retornar status 200 OK se o login for bem-sucedido", async () => {
    const response = await request.post("/login").send({ email: "utilizador@example.com", password: "senha_correta" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});

describe("Testes de Registo", () => {
  it("Deve criar uma nova conta", async () => {
    const response = await request.post("/register").send({ nome: "Nome Utilizador", email: "novo_utilizador@example.com", password: "nova_senha", idade: 25 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Conta criada com sucesso");
  });

  it("Deve retornar status 400 Pedido Inválido se o email já estiver em uso", async () => {
    const response = await request.post("/register").send({ nome: "Nome Utilizador Existente", email: "utilizador_existente@example.com", password: "senha", idade: 30 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Email já em uso");
  });
});
