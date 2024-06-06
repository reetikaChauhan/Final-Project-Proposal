const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Airports = require('../models/airports');

const User = require('../models/user');


describe("/airports", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  
  let savedairport;
  const testAirport = [
    {
        name: "seatec",
        code: "4530",
        location: "seatec WA",
    },
    {
        name: "Spana Auburn Airport",
        code: "4535",
        location: "Auburn WA",
    },
    {
        name: "San Francisco Oakland International Airport",
        code: "4995",
        location: "San Francisco WA", 
    },
  
    {
        name: "Mineta San Jose  International Airport",
        code: "4920",
        location: "San Francisco CA", 
    },
    {
        name: "Phoenix Sky Harbor International Airport",
        code: "PSHA",
        location: "Phoenix Arizona", 
    }
]
   
  const airport = {
    name: 'ABC International Airport',
    code:'AOC',
    location: "Phoenix Arizona", 
};
  beforeEach(async () => {
    savedairport = await Airports.insertMany(testAirport);
    testAirport.forEach((airport, index) => {
        airport._id = savedairport[index]._id.toString();
      });
  });
  afterEach(testUtils.clearDB);

  describe("GET /", () => {
    it("should return all airports", async () => {
      const res = await request(server).get("/airports");
      expect(res.statusCode).toEqual(200);
      testAirport.forEach(airport => {
        expect(res.body).toContainEqual(
          expect.objectContaining(airport)
        )
      })
    });
  })
  describe("GET /:id", () => {
    it("should return 404 if no matching id", async () => {
      const res = await request(server).get("/airports/id1");
      expect(res.statusCode).toEqual(404);
    });

    it.each(testAirport)("should find airport # %#", async (airport) => {
      const res = await request(server).get("/airports/" + airport._id);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(airport);
    })
  });
  describe("GET / ?location", () => {
    it("should return one airport matching the search query", async () => {
      const searchTerm = 'Auburn'
      const res = await request(server).get("/airports/?location=" + encodeURI(searchTerm));
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject([
        testAirport.find(airp => airp.name === 'Spana Auburn Airport')
      ]);
    });
    it("should return two matching airports  by best matching location term", async () => {
      const searchTerm = 'san francisco CA'
      const res = await request(server).get("/airports/?location=" + encodeURI(searchTerm));
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject([
        testAirport.find(airp => airp.name === "Mineta San Jose  International Airport"),
        testAirport.find(airp => airp.name === "San Francisco Oakland International Airport"),
      ]);
    });
  });


  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/airports").send(airport);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/airports")
          .set("Authorization", "Bearer BAD")
          .send(airport);
        expect(res.statusCode).toEqual(401);
      });
    
    });

  
  });
  describe("After login", () => {
    const user0 = {
      email: "user0@mail.com",
      password: "123password",
      roles:"user",
      name:"user",
      phone:"12346"
    };
    const user1 = {
      email: "user1@mail.com",
      password: "456password",
      roles:"user",
      name:"user",
      phone:"12346"
    };
    let token0;
    let adminToken;
    beforeEach(async () => {
      await request(server).post("/auth/signup").send(user0);
      const res0 = await request(server).post("/auth/login").send(user0);
      token0 = res0.body.token;
      await request(server).post("/auth/signup").send(user1);
      await User.updateOne(
        { email: user1.email },
        { $push: { roles: "admin" } }
      );
      const res1 = await request(server).post("/auth/login").send(user1);
      adminToken = res1.body.token;
    });
    
        
  describe("POST / airport %#", () => {
      it("should send 403 to normal user and not store airport", async () => {
        const res = await request(server)
          .post("/airports")
          .set("Authorization", "Bearer " + token0)
          .send(airport);
        expect(res.statusCode).toEqual(403);
        //expect(await Airlines.countDocuments()).toEqual(0);
      }); 
      it("should reject an airport with an empty body", async () => {
        const airport = {};
        const res = await request(server).post("/airports")
        .set("Authorization", "Bearer " + adminToken)
        .send(airport);
        expect(res.statusCode).toEqual(400);
      });
      it("should reject an airport without a name", async () => {
            const airport = {
            code: "QXE"
        } ;
            const res = await request(server).post("/airports")
            .set("Authorization", "Bearer " + adminToken)
            .send(airport);
            expect(res.statusCode).toEqual(400);
       });
      it("should send 200 to admin user and store airport", async () => {
        const res = await request(server)
          .post("/airports")
          .set("Authorization", "Bearer " + adminToken)
          .send(airport);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(airport);
        const savedAirport = await Airports.findOne({ _id: res.body._id }).lean();
        expect(savedAirport).toMatchObject(airport);
      });

    });
  describe("PUT / airport %#", () => {
  let orgairport;
  beforeEach(async () => {
      const res = await request(server)
      .post("/airports")
      .set("Authorization", "Bearer " + adminToken)
      .send(airport);
      orgairport = res.body;
  });
 
  it("should send 403 to normal user and not update airport", async () => {
      const res = await request(server)
      .put("/airports/" + orgairport._id)
      .set("Authorization", "Bearer " + token0)
      .send({ ...airport, code: 'ANN' });
      expect(res.statusCode).toEqual(403);
      const newItem = await Airports.findById(orgairport._id).lean();
      newItem._id = newItem._id.toString();
      expect(newItem).toMatchObject(orgairport);
  });
  it("should send 200 to admin user and update airport", async () => {
      const res = await request(server)
      .put("/airports/" + orgairport._id)
      .set("Authorization", "Bearer " + adminToken)
      .send({ ...airport, code: 'ANN' });
      expect(res.statusCode).toEqual(200);
      const newItem = await Airports.findById(orgairport._id).lean();
      newItem._id = newItem._id.toString();
      expect(newItem).toMatchObject({
      ...orgairport,
      code:'ANN',
      });
  });
  });
  describe("DELETE /:id", () => {
    it("should reject a bad id", async () => {
      const res = await request(server).delete("/airports/fake").send();
      expect(res.statusCode).toEqual(400);
    });

    it("should delete the expected airport", async () => {
      const { _id } = testAirport[1];
      const res = await request(server).delete("/airports/" + _id).send({});
      expect(res.statusCode).toEqual(200);
      const storedAirport = await Airports.findOne({ _id });
      expect(storedAirport).toBeNull();
    });
  }); 
  })
    
});
