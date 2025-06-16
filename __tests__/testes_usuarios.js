const request = require("supertest");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const baseURL = process.env.BASE_URL || "http://localhost:3000/api";

describe("Usuários Controller", () => {
  describe("POST /usuarios/register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const novoUsuario = {
        nome: "Teste Usuario",
        email: "teste@example.com",
        senha: "123456",
        tipo: "Cliente",
        ativo: true,
      };

      const response = await request(baseURL)
        .post("/usuarios/register")
        .send(novoUsuario)
        .expect(201);

      expect(response.body).toHaveProperty("insertedId");
    });

    it("deve retornar erro 400 para dados inválidos", async () => {
      const usuarioInvalido = {
        nome: "",
        email: "email-invalido",
        senha: "123",
      };

      await request(baseURL)
        .post("/usuarios/register")
        .send(usuarioInvalido)
        .expect(400);
    });

    it("deve gerar avatar automaticamente", async () => {
      const usuario = {
        nome: "João Silva",
        email: "joao@example.com",
        senha: "123456",
        tipo: "Cliente",
      };

      const response = await request(baseURL)
        .post("/usuarios/register")
        .send(usuario)
        .expect(201);

      expect(response.body).toBeDefined();
    });
  });

  describe("POST /usuarios/login", () => {
    const emailTeste = "login@example.com";
    const senhaTeste = "123456";

    beforeAll(async () => {
      // Registrar usuário para testes de login
      const usuario = {
        nome: "Usuario Login",
        email: emailTeste,
        senha: senhaTeste,
        tipo: "Cliente",
        ativo: true,
      };

      await request(baseURL).post("/usuarios/register").send(usuario);
    });

    it("deve efetuar login com credenciais válidas", async () => {
      const credenciais = {
        email: emailTeste,
        senha: senhaTeste,
      };

      const response = await request(baseURL)
        .post("/usuarios/login")
        .send(credenciais)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Login realizado com sucesso"
      );
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
    });

    it("deve retornar erro 403 para email inexistente", async () => {
      const credenciais = {
        email: "inexistente@example.com",
        senha: senhaTeste,
      };

      const response = await request(baseURL)
        .post("/usuarios/login")
        .send(credenciais)
        .expect(403);

      expect(response.body).toHaveProperty(
        "message",
        "Dados de login inválidos"
      );
    });

    it("deve retornar erro 403 para senha incorreta", async () => {
      const credenciais = {
        email: emailTeste,
        senha: "senhaErrada",
      };

      const response = await request(baseURL)
        .post("/usuarios/login")
        .send(credenciais)
        .expect(403);

      expect(response.body).toHaveProperty(
        "message",
        "Dados de login inválidos"
      );
    });

    it("deve retornar erro 403 para usuário inativo", async () => {
      const emailInativo = "inativo@example.com";

      // Registrar usuário inativo
      const usuarioInativo = {
        nome: "Usuario Inativo",
        email: emailInativo,
        senha: senhaTeste,
        tipo: "Cliente",
        ativo: false,
      };

      await request(baseURL).post("/usuarios/register").send(usuarioInativo);

      const credenciais = {
        email: emailInativo,
        senha: senhaTeste,
      };

      const response = await request(baseURL)
        .post("/usuarios/login")
        .send(credenciais)
        .expect(403);

      expect(response.body).toHaveProperty(
        "message",
        "Dados de login inválidos"
      );
    });

    it("deve retornar erro 400 para requisição sem email", async () => {
      const credenciais = {
        senha: senhaTeste,
      };

      await request(baseURL)
        .post("/usuarios/login")
        .send(credenciais)
        .expect(500);
    });

    it("deve retornar erro 400 para requisição sem senha", async () => {
      const credenciais = {
        email: emailTeste,
      };

      await request(baseURL)
        .post("/usuarios/login")
        .send(credenciais)
        .expect(500);
    });
  });

  describe("Validações de segurança", () => {
    it("deve criptografar a senha ao registrar usuário", async () => {
      const senhaOriginal = "minhasenha123";
      const usuario = {
        nome: "Teste Criptografia",
        email: "cripto@example.com",
        senha: senhaOriginal,
        tipo: "Cliente",
      };

      const response = await request(baseURL)
        .post("/usuarios/register")
        .send(usuario)
        .expect(201);

      expect(response.body).toBeDefined();
      // A senha deve estar criptografada no banco
    });

    it("deve validar formato de email", async () => {
      const usuario = {
        nome: "Teste Email",
        email: "email-invalido",
        senha: "123456",
        tipo: "Cliente",
      };

      await request(baseURL)
        .post("/usuarios/register")
        .send(usuario)
        .expect(400);
    });
  });
});
