const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Author } = require("../src/models");

describe("/authors", () => {
  let authors;
  before(async () => {
    await Author.sync();
  });
  describe("with no records in the database", async () => {
    beforeEach(async () => {
      await Author.destroy({ truncate: { cascade: true } });
    });

    afterEach(async () => {
      await Author.destroy({ truncate: { cascade: true } });
    });

    describe("POST /authors", () => {
      it("creates a new author in the database", async () => {
        const response = await request(app).post("/authors").send({
          author: "Grace Beverley",
        });

        const authorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.body.author).to.equal("Grace Beverley");
        expect(authorRecord.author).to.equal("Grace Beverley");

        expect(response.status).to.equal(201);
      });

      it("returns a 400 error if field is null", async () => {
        const response = await request(app).post("/authors").send({
          author: null,
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal(
          "Please ensure all fields are completed."
        );
      });
    });
  });

  describe("with records in the database", async () => {
    before(async () => {
      await Author.sync();
    });

    beforeEach(async () => {
      await Promise.all([
        Author.create({
          author: "Ryu Murakami",
        }),
        Author.create({
          author: "Grace Beverley",
        }),
        Author.create({
          author: "Ellie Kemp",
        }),
      ]);

      authors = await Author.findAll();
    });

    afterEach(async () => {
      await Author.destroy({ truncate: { cascade: true } });
    });

    describe("POST /authors", () => {
      it("returns a 409 error if a matching title and author already exists", async () => {
        const response = await request(app).post("/authors").send({
          author: "Ellie Kemp",
        });

        expect(response.status).to.equal(409);
        expect(response.body.error).to.equal(
          `The author Ellie Kemp already exists.`
        );
      });
    });

    describe("GET /authors", () => {
      it("gets all authors records", async () => {
        const response = await request(app).get("/authors").send();

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);
          expect(author.author).to.equal(expected.author);
        });
      });
    });

    describe("GET /authors/:id", () => {
      it("gets authors record by id", async () => {
        const author = authors[0];
        const response = await request(app).get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
      });

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app).get("/authors/1995");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The author could not be found.");
      });
    });

    describe("PATCH /authors/:id", () => {
      it("updates authors author by id", async () => {
        const author = authors.filter(
          (n) => n.dataValues.author === "Ryu Murakami"
        )[0].dataValues;

        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: "R Murakami" });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal("R Murakami");
      });

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app)
          .patch("/authors/2015")
          .send({ author: "JRR Tolkien" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The author could not be found.");
      });
    });

    describe("DELETE /authors/:id", () => {
      it("deletes author record by id", async () => {
        const author = authors.filter(
          (n) => n.dataValues.author === "Ellie Kemp"
        )[0].dataValues;
        const response = await request(app).delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it("returns a 404 if the author does not exist", async () => {
        const response = await request(app).delete("/authors/1885");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The author could not be found.");
      });
    });
  });
});
