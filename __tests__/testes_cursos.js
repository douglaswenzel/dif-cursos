const request = require("supertest");
const dotenv = require("dotenv");

dotenv.config();

const baseURL = process.env.BASE_URL || "http://localhost:3000/api";
let authToken;
let testCourseId;

describe("Cursos Controller", () => {
  // Login to get auth token before tests
  beforeAll(async () => {
    // Register a test user first
    const testUser = {
      nome: "Teste Admin",
      email: "admin_cursos@example.com",
      senha: "Senha123!",
      tipo: "Admin",
      ativo: true,
    };

    await request(baseURL).post("/usuarios/register").send(testUser);

    // Login to get token
    const loginResponse = await request(baseURL).post("/usuarios/login").send({
      email: testUser.email,
      senha: testUser.senha,
    });

    authToken = loginResponse.body.token;
  });

  describe("POST /cursos", () => {
    it("deve criar um novo curso com sucesso", async () => {
      const novoCurso = {
        titulo: "Curso de Testes Automatizados",
        instrutor: "Instrutor Teste",
        categoria: "Tecnologia",
        duracao_horas: 10.5,
        alunos_matriculados: 0,
        data_lancamento: new Date().toISOString().split("T")[0],
        preco: 199.99,
        modulos: ["Introdução", "Ferramentas", "Práticas", "Conclusão"],
      };

      const response = await request(baseURL)
        .post("/cursos")
        .set("Authorization", `Bearer ${authToken}`)
        .send(novoCurso)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      testCourseId = response.body.id;
    });

    it("deve retornar erro 400 para dados inválidos", async () => {
      const cursoInvalido = {
        titulo: "",
        instrutor: "",
        categoria: "",
      };

      const response = await request(baseURL)
        .post("/cursos")
        .set("Authorization", `Bearer ${authToken}`)
        .send(cursoInvalido)
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("deve retornar erro 401 sem autenticação", async () => {
      const novoCurso = {
        titulo: "Curso Sem Auth",
        instrutor: "Instrutor Teste",
        categoria: "Tecnologia",
        duracao_horas: 10,
        alunos_matriculados: 0,
        data_lancamento: new Date().toISOString(),
        preco: 199.99,
        modulos: ["Módulo 1"],
      };

      await request(baseURL).post("/cursos").send(novoCurso).expect(401);
    });
  });

  describe("GET /cursos", () => {
    it("deve listar todos os cursos", async () => {
      const response = await request(baseURL)
        .get("/cursos")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve retornar erro 401 sem autenticação", async () => {
      await request(baseURL).get("/cursos").expect(401);
    });
  });

  describe("GET /cursos/:id", () => {
    it("deve buscar um curso pelo ID", async () => {
      const response = await request(baseURL)
        .get(`/cursos/${testCourseId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("titulo");
      expect(response.body).toHaveProperty("instrutor");
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011"; // ID válido mas que não existe

      const response = await request(baseURL)
        .get(`/cursos/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Curso não encontrado");
    });

    it("deve retornar erro para ID inválido", async () => {
      const invalidId = "id-invalido";

      await request(baseURL)
        .get(`/cursos/${invalidId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(500);
    });
  });

  describe("PUT /cursos/:id", () => {
    it("deve atualizar um curso com sucesso", async () => {
      const cursoAtualizado = {
        titulo: "Curso de Testes Atualizado",
        instrutor: "Instrutor Atualizado",
        categoria: "Tecnologia",
        duracao_horas: 12,
        alunos_matriculados: 5,
        data_lancamento: new Date().toISOString().split("T")[0],
        preco: 249.99,
        modulos: ["Módulo Atualizado 1", "Módulo Atualizado 2"],
      };

      const response = await request(baseURL)
        .put(`/cursos/${testCourseId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(cursoAtualizado)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Curso atualizado com sucesso"
      );
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const cursoAtualizado = {
        titulo: "Curso Inexistente",
        instrutor: "Instrutor Teste",
        categoria: "Tecnologia",
        duracao_horas: 10,
        alunos_matriculados: 0,
        data_lancamento: new Date().toISOString().split("T")[0],
        preco: 199.99,
        modulos: ["Módulo 1"],
      };

      const response = await request(baseURL)
        .put(`/cursos/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(cursoAtualizado)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Curso não encontrado");
    });
  });

  describe("GET /cursos/search", () => {
    it("deve buscar cursos por termo", async () => {
      const response = await request(baseURL)
        .get("/cursos/search?busca=Testes")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve retornar array vazio para busca sem resultados", async () => {
      const response = await request(baseURL)
        .get("/cursos/search?busca=CursoInexistente12345")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe("GET /cursos/search/advanced", () => {
    it("deve buscar cursos com filtros avançados", async () => {
      const response = await request(baseURL)
        .get(
          "/cursos/search/advanced?minPreco=100&maxPreco=300&categoria=Tecnologia"
        )
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve validar parâmetros de filtro", async () => {
      await request(baseURL)
        .get("/cursos/search/advanced?minPreco=invalido")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe("DELETE /cursos/:id", () => {
    it("deve excluir um curso com sucesso", async () => {
      const response = await request(baseURL)
        .delete(`/cursos/${testCourseId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Curso excluído com sucesso"
      );
    });

    it("deve retornar 404 para ID inexistente", async () => {
      // Tentar excluir o curso já excluído
      const response = await request(baseURL)
        .delete(`/cursos/${testCourseId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "Curso não encontrado");
    });
  });
});
