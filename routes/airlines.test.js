const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Airlines = require('../models/airlines');

const User = require('../models/user');


describe("/airlines", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  
  let savedairlines;
  const testAirlines = [
    {
        name: "Horizon Air",
        code: "QXE",
    }  ,  
    {
      
        name: "Alaska Airlines",
        code: "O27"
       
    },
    {
        name: "Delta Airlines",
        code: "OO6", 
    },
    {
        name: "American Airlines",
        code: "AXO"
    }
  ];
   
  const airline = {
    name: 'Lynx Airline',
    code:'LXO'
};
  beforeEach(async () => {
    savedairlines = await Airlines.insertMany(testAirlines);
    testAirlines.forEach((airline, index) => {
        airline._id = savedairlines[index]._id.toString();
      });
  });
  afterEach(testUtils.clearDB);

  describe("GET /", () => {
    it("should return all airlines", async () => {
      const res = await request(server).get("/airlines");
      expect(res.statusCode).toEqual(200);
      testAirlines.forEach(airline => {
        expect(res.body).toContainEqual(
          expect.objectContaining(airline)
        )
      })
    });
  })
  describe("GET /:id", () => {
    it("should return 404 if no matching id", async () => {
      const res = await request(server).get("/airlines/id1");
      expect(res.statusCode).toEqual(404);
    });

    it.each(testAirlines)("should find airline # %#", async (airline) => {
      const res = await request(server).get("/airlines/" + airline._id);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(airline);
    })
  });

  describe("Before login", () => {
    describe("POST /", () => {
        const airline = {
            name: 'Lynx Airline',
            code:'LXO'
        };
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/airlines").send(airline);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/airlines")
          .set("Authorization", "Bearer BAD")
          .send(airline);
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
    
        
  describe("POST / airline %#", () => {
      it("should send 403 to normal user and not store airline", async () => {
        const res = await request(server)
          .post("/airlines")
          .set("Authorization", "Bearer " + token0)
          .send(airline);
        expect(res.statusCode).toEqual(403);
        //expect(await Airlines.countDocuments()).toEqual(0);
      });
      it("should send 200 to admin user and store item", async () => {
        const res = await request(server)
          .post("/airlines")
          .set("Authorization", "Bearer " + adminToken)
          .send(airline);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(airline);
        const savedAirline = await Airlines.findOne({ _id: res.body._id }).lean();
        expect(savedAirline).toMatchObject(airline);
      });
    });
  // describe("PUT / item %#", () => {
  // let orgairline;
  // beforeEach(async () => {
  //     const res = await request(server)
  //     .post("/airlines")
  //     .set("Authorization", "Bearer " + adminToken)
  //     .send(airline);
  //     orgairline = res.body;
  // });
  // console.log("in tests put airline",orgairline)
  // console.log("in tests put token",token0)
  // it("should send 403 to normal user and not update item", async () => {
  //     const res = await request(server)
  //     .put("/airlines/" + orgairline._id)
  //     .set("Authorization", "Bearer " + token0)
  //     .send({ ...airline, code: 'ANN' });
  //     expect(res.statusCode).toEqual(403);
  //     const newItem = await Airlines.findById(orgairline._id).lean();
  //     newItem._id = newItem._id.toString();
  //     expect(newItem).toMatchObject(orgairline);
  // });
  // it("should send 200 to admin user and update item", async () => {
  //     const res = await request(server)
  //     .put("/airlines/" + orgairline._id)
  //     .set("Authorization", "Bearer " + adminToken)
  //     .send({ ...airline, code: 'ANN' });
  //     expect(res.statusCode).toEqual(200);
  //     const newItem = await Airlines.findById(originalItem._id).lean();
  //     newItem._id = newItem._id.toString();
  //     expect(newItem).toMatchObject({
  //     ...orgairline,
  //     code:'ANN',
  //     });
  // });
  // });
    
  })
    
});


//   it("should reject an airline with an empty body", async () => {
    //     const airline = {};
    //     const res = await request(server).post("/airlines").send(airline);
    //     expect(res.statusCode).toEqual(400);
    //   });
    //   it("should reject an airline without a name", async () => {
    //     const airline = {
    //       code: "QXE"
    //   } ;
    //     const res = await request(server).post("/airlines").send(airline);
    //     expect(res.statusCode).toEqual(400);
    //   });
    //   it("should create an author", async () => {
    //     const airline = {
    //       name: 'Lynx Airline',
    //       code:'LXO'
    //     };
    //     const res = await request(server).post("/airlines").send(airline);
    //     expect(res.statusCode).toEqual(200);
    //     const { _id } = res.body;
    //     const savedAirline = await Airlines.findOne({ _id }).lean();
    //     expect(savedAirline).toMatchObject(airline);
    //   });