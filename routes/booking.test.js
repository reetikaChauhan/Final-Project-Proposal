const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Flights = require('../models/flights');
const Book = require('../models/booking');
const Airlines = require('../models/airlines');
const User = require('../models/user');


describe("/flights", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  
  let savedBook;
 
  const testBook = 
   [
        {
            status: "Confirmed",
            seat: "1A"
        },
        {
            status: "Confirmed",
            seat: "2A"
        }

    
]

  
  beforeEach(async () => {
    console.log("hellooooooooooo")
    savedBook = await testBook.insertMany(testBook);
    console.log("savedAirport tatssssss", savedBook)
   
   
    console.log("testAirport", testAirport)
    console.log("testAirline", testAirline)
    testflights[0].departure_airport_id = testAirport[0]._id;
    testflights[0].arrival_airport_id = testAirport[1]._id;
    testflights[1].departure_airport_id = testAirport[0]._id;
    testflights[1].arrival_airport_id = testAirport[1]._id;
    testflights[0].airline_id = testAirline[0]._id;
    testflights[1].airline_id = testAirline[0]._id;
   
    savedflights = await Flights.insertMany(testflights);
    testflights.forEach((flight, index) => {
        flight._id = savedflights[index]._id.toString();
        flight.seat_map.forEach((seat,index_seat) =>{
          console.log("seattt in test flight", seat)
          seat._id = savedflights[index].seat_map[index_seat]._id.toString();
          console.log("seattt in test flight after adding", seat)
        })
    });
    console.log("in before each", testflights)
    console.log("saved flightttttttt", savedflights)
  });
  afterEach(testUtils.clearDB);

  describe("GET /", () => {
    console.log("testflights", testflights)
    it("should return all flights", async () => {
      const res = await request(server).get("/flights");
      console.log("get all flightsaaaaa", res.body)
      expect(res.statusCode).toEqual(200);
      testflights.forEach(testfl => {
        expect(res.body).toContainEqual(
          expect.objectContaining(testfl)
        )
      })
    });
  })
  describe("GET /:id", () => {
    it("should return 404 if no matching id", async () => {
      const res = await request(server).get("/flights/id1");
      expect(res.statusCode).toEqual(404);
    });

    it.each(testflights)("should find flight # %#", async (flight) => {
      const res = await request(server).get("/flights/" + flight._id);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(flight);
    })
  });
  describe("GET /search ?arrivalcity && departurecity", () => {
    const searchterm1 = "seatec";
    const searchterm2 = "san francisco";
    it("should return one flight matching the search query", async () => {
      const res = await request(server).get("/flights/?arrival_city=" + encodeURI(searchterm1)+ "&departure_city=" + encodeURI(searchterm2));
      expect(res.statusCode).toEqual(200);
      console.log("res.body in gett by cityyyyyyyarrr", res.body)
      expect(res.body).toMatchObject(testflights);
 });
  });
  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/flights").send(flight);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/flights")
          .set("Authorization", "Bearer BAD")
          .send(flight);
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
    
        
  describe("POST / flight %#", () => {
      it("should send 403 to normal user and not store flight", async () => {
        console.log("flights....",flight)
        const res = await request(server)
          .post("/flights")
          .set("Authorization", "Bearer " + token0)
          .send(flight);
        expect(res.statusCode).toEqual(403);
        //expect(await Airlines.countDocuments()).toEqual(0);
      }); 
      it("should reject an airport with an empty body", async () => {
        const flight = {};
        const res = await request(server).post("/flights")
        .set("Authorization", "Bearer " + adminToken)
        .send(flight);
        expect(res.statusCode).toEqual(400);
      });
      
      it("should send 200 to admin user and store airport", async () => {
        const upflight = {...flight[0], 
          departure_airport_id: testAirport[0]._id,
          arrival_airport_id : testAirport[1]._id,
          airline_id:testAirline[0]._id
        }
       console.log("upflighttttttt",upflight)
        const res = await request(server)
          .post("/flights")
          .set("Authorization", "Bearer " + adminToken)
          .send(upflight);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(upflight);
        console.log("res.body in post plsssss", res.body)
        const savedflight = await Flights.findOne({ _id: res.body._id }).lean();
        console.log("saved flight in posttttt", savedflight)
        console.log("flight to mtched in post", upflight)
        expect(savedflight.departure_time).toEqual(res.body.departure_time);
      });
    });
 
  })
    
});


