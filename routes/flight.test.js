const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const Flights = require('../models/flights');
const Airports = require('../models/airports');
const Airlines = require('../models/airlines');
const User = require('../models/user');


describe("/flights", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  
  let savedflights;
  let savedAirport;
  let savedAirline;
  const testflights = 
   [
        {
            departure_time: "06:00",
            departure_date: "06-07-2024",
            arrival_date: "06-07-2024",
            arrival_time: "08:40",
            seat_map: [
              { seat_num: "1A", booked: true },
              { seat_num: "2A", booked: true },
              { seat_num: "3A", booked: false },
              { seat_num: "4A", booked: false },
              { seat_num: "5A", booked: false }
            ]
        },
        {
            departure_time: "10:00",
            departure_date: "06-07-2024",
            arrival_date: "06-07-2024",
            arrival_time: "13:40",
            seat_map: [
              { seat_num: "1A", booked: true },
              { seat_num: "2A", booked: true },
              { seat_num: "3A", booked: false },
              { seat_num: "4A", booked: false },
              { seat_num: "5A", booked: false }
            ]

        }
    
]
const testAirport = [
    {
        name: "seatec",
        code: "4530",
        location: "seatec WA",
    },
    {
        name: "San Francisco  International Airport",
        code: "4535",
        location: "San Francisco CA",
    },
]
const testAirline = [
    {
        name: "Horizon Air",
        code: "QXE",
    }   
];
const flight = [
    {
        departure_time: "06:00",
        departure_date: "06-07-2024",
        arrival_date: "06-07-2024",
        arrival_time: "08:40",
        seat_map: [
          { seat_num: "1A", booked: true },
          { seat_num: "2A", booked: true },
          { seat_num: "3A", booked: false },
          { seat_num: "4A", booked: false },
          { seat_num: "5A", booked: false }
        ]
    },
]
  
  beforeEach(async () => {
    savedAirport = await Airports.insertMany(testAirport);
    testAirport.forEach((airport, index) => {
        airport._id = savedAirport[index]._id.toString();
      });
    savedAirline = await Airlines.insertMany(testAirline);
    testAirline.forEach((airline, index) => {
        airline._id = savedAirline[index]._id.toString();
    });
   
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
          seat._id = savedflights[index].seat_map[index_seat]._id.toString();
        })
    });
  });
  afterEach(testUtils.clearDB);

  describe("GET /", () => {
    it("should return all flights", async () => {
      const res = await request(server).get("/flights");
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
        const res = await request(server)
          .post("/flights")
          .set("Authorization", "Bearer " + adminToken)
          .send(upflight);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(upflight);
        const savedflight = await Flights.findOne({ _id: res.body._id }).lean();
        expect(savedflight.departure_time).toEqual(res.body.departure_time);
      });
    });
 
  })
    
});


