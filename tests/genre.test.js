const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Genre } = require("../src/models");

describe("/genres", () => {
  let genres;
  before(async () => {
    await Genre.sync();
  });
  describe("with no records in the database", async () => {
    beforeEach(async () => {
      await Genre.destroy({ truncate: { cascade: true } });
    });

    afterEach(async () => {
      await Genre.destroy({ truncate: { cascade: true } });
    });

    describe("POST /genres", () => {
      it("creates a new genre in the database", async () => {
        const response = await request(app).post("/genres").send({
          genre: "Horror",
        });

        const genreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.body.genre).to.equal("Horror");
        expect(genreRecord.genre).to.equal("Horror");

        expect(response.status).to.equal(201);
      });

      it("returns a 400 error if field is null", async () => {
        const response = await request(app).post("/genres").send({
          genre: null,
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
      await Genre.sync();
    });

    beforeEach(async () => {
      await Promise.all([
        Genre.create({
          genre: "Horror",
        }),
        Genre.create({
          genre: "Roman A Clef",
        }),
        Genre.create({
          genre: "Fantasy",
        }),
      ]);

      genres = await Genre.findAll();
    });

    afterEach(async () => {
      await Genre.destroy({ truncate: { cascade: true } });
    });

    describe("POST /genres", () => {
      it("returns a 409 error if a matching title and genre already exists", async () => {
        const response = await request(app).post("/genres").send({
          genre: "Fantasy",
        });

        expect(response.status).to.equal(409);
        expect(response.body.error).to.equal(
          `The genre Fantasy already exists.`
        );
      });
    });

    describe("GET /genres", () => {
      it("gets all genres records", async () => {
        const response = await request(app).get("/genres").send();

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);
          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe("GET /genres/:id", () => {
      it("gets genres record by id", async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app).get("/genres/1985");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });

    describe("PATCH /genres/:id", () => {
      it("updates genres genre by id", async () => {
        const genre = genres.filter((n) => n.dataValues.genre === "Horror")[0]
          .dataValues;

        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: "Psychedelic" });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal("Psychedelic");
      });

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app)
          .patch("/genres/2015")
          .send({ genre: "Adventure" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });

    describe("DELETE /genres/:id", () => {
      it("deletes genre record by id", async () => {
        const genre = genres.filter((n) => n.dataValues.genre === "Fantasy")[0]
          .dataValues;
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it("returns a 404 if the genre does not exist", async () => {
        const response = await request(app).delete("/genres/1885");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The genre could not be found.");
      });
    });
  });
});
