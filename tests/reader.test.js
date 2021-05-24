const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const { Reader } = require("../src/models");

describe("/readers", () => {
  let readers;
  before(async () => {
    await Reader.sync();
  });
  describe("with no records in the database", async () => {
    beforeEach(async () => {
      await Reader.destroy({ truncate: { cascade: true } });
    });

    afterEach(async () => {
      await Reader.destroy({ truncate: { cascade: true } });
    });

    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const response = await request(app).post("/readers").send({
          name: "Emmett Brown",
          email: "outatime@aol.com",
          password: "55555",
        });
        const readerRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.body.name).to.equal("Emmett Brown");
        expect(readerRecord.name).to.equal("Emmett Brown");
        expect(readerRecord.email).to.equal("outatime@aol.com");
        expect(readerRecord.password).to.equal("55555");

        expect(response.status).to.equal(201);
      });

      it("validates the password length", async () => {
        const response = await request(app).post("/readers").send({
          name: "Emmett Brown",
          email: "outatime@aol.com",
          password: "abc",
        });

        expect(response.status).to.equal(400);
      });

      it("all fields required", async () => {
        const response = await request(app).post("/readers").send({
          name: "Emmett Brown",
          email: "outatime@aol.com",
        });

        expect(response.status).to.equal(400);
      });

      it("removes the password from the response", async () => {
        const response = await request(app).post("/readers").send({
          name: "Emmett Brown",
          email: "outatime@aol.com",
          password: "1885195519852015",
        });

        expect(response.body.password).to.equal(undefined);
      });
    });
  });

  describe("with records in the database", async () => {
    before(async () => {
      await Reader.sync();
    });

    beforeEach(async () => {
      await Promise.all([
        Reader.create({
          name: "Emmett Brown",
          email: "outatime@aol.com",
          password: "1885195519852015",
        }),
        Reader.create({
          name: "Marty McFly",
          email: "marty.mcfly@hill.valley.edu",
          password: "jUmpP@nAMa",
        }),
        Reader.create({
          name: "Biff Tannen",
          email: "tannen69@msn.org",
          password: "password123",
        }),
      ]);

      readers = await Reader.findAll();
    });

    afterEach(async () => {
      await Reader.destroy({ truncate: { cascade: true } });
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const response = await request(app).get("/readers").send();

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
        });

        it("removes the password from the response", async () => {
          const response = await request(app).get("/readers").send();
          response.body.forEach((reader) => {
            expect(reader.password).to.equal(undefined);
          });
        });
      });
    });

    describe("GET /readers/:id", () => {
      it("gets readers record by id", async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).get("/readers/1985");

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });

      it("removes the password from the response", async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);
        expect(response.body.password).to.equal(undefined);
      });
    });

    describe("PATCH /readers/:id", () => {
      it("updates readers email by id", async () => {
        const reader = readers.filter(
          (n) => n.dataValues.name === "Biff Tannen"
        )[0].dataValues;

        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "tannen69@msn.com" });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal("tannen69@msn.com");
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app)
          .patch("/readers/2015")
          .send({ email: "some_new_email@gmail.com" });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });

    describe("DELETE /readers/:id", () => {
      it("deletes reader record by id", async () => {
        const reader = readers.filter(
          (n) => n.dataValues.name === "Biff Tannen"
        )[0].dataValues;
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const response = await request(app).delete("/readers/1885");
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal("The reader could not be found.");
      });
    });
  });
});
