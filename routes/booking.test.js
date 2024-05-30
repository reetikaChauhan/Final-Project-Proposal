const request = require("supertest");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");
const Booking = require("../models/booking");
const Flights = require("../models/flights");
const Airports = require('../models/airports');
const Airlines = require('../models/airlines');

describe("/booking", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

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
    console.log("hellooooooooooo")
    savedAirport = await Airports.insertMany(testAirport);
    console.log("savedAirport tatssssss", savedAirport)
    testAirport.forEach((airport, index) => {
        airport._id = savedAirport[index]._id.toString();
      });
    savedAirline = await Airlines.insertMany(testAirline);
    testAirline.forEach((airline, index) => {
        airline._id = savedAirline[index]._id.toString();
    });
   
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
          seat._id = savedflights[index].seat_map[index_seat]._id.toString();
        })
    });
    console.log("in before each", testflights)
    console.log("saved flightttttttt", savedflights)
  });
  const booking = {
    flight_id: testflights[0]._id,
    status: "confirmed"
  }
  describe("Before login", () => {
    describe("POST /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).post("/bookings").send(booking);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .post("/bookings")
          .set("Authorization", "Bearer BAD")
          .send(booking);
        expect(res.statusCode).toEqual(401);
      });
    });
    describe("GET /", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).get("/bookings").send(booking);
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .get("/bookings")
          .set("Authorization", "Bearer BAD")
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
    describe("GET /:id", () => {
      it("should send 401 without a token", async () => {
        const res = await request(server).get("/bookings/123").send();
        expect(res.statusCode).toEqual(401);
      });
      it("should send 401 with a bad token", async () => {
        const res = await request(server)
          .get("/bookings/456")
          .set("Authorization", "Bearer BAD")
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
  });
  describe("after login", () => {
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
        { $push: { roles: "admin" } },
      );
      const res1 = await request(server).post("/auth/login").send(user1);
      adminToken = res1.body.token;
    });
    describe("POST /", () => {
        console.log("hello ji in psot", testflights)
      it("should send 200 to normal user and create booking", async () => {
        console.log("testflight in post booking", testflights)
        const booking = {
            flight_id: testflights[0]._id,
            status: "confirmed"
          }
        const res = await request(server)
          .post("/bookings")
          .set("Authorization", "Bearer " + token0)
          .send(booking);
        console.log("hello there in post after login booking",res.body)
        expect(res.statusCode).toEqual(200);
        const storedBooking = await Booking.findOne().lean();
        console.log("stored boooking in post:",storedBooking)
        const expectedBooking = {
            flight_id: testflights[0]._id.toString(),
            passenger_id: (await User.findOne({ email: user0.email }).lean())._id.toString(),
            seat: "3A"
          };
      
          // Convert stored booking IDs to strings for comparison
          storedBooking.flight_id = storedBooking.flight_id.toString();
          storedBooking.passenger_id = storedBooking.passenger_id.toString();
          expect(storedBooking).toMatchObject(expectedBooking);
      });
      it("should send 400 with a bad flight _id", async () => {
        const booking0 = {
            flight_id: "5f1b8d9ca0ef055e6e5a1f6b",
            status: "confirmed"
          }
        const res = await request(server)
          .post("/bookings")
          .set("Authorization", "Bearer " + adminToken)
          .send(booking0);
        expect(res.statusCode).toEqual(400);
        const storedOrder = await Booking.findOne().lean();
        expect(storedOrder).toBeNull();
      });
    });
   
    describe("GET /:id", () => {
        let Booking0Id, Booking1Id;
        
    beforeEach(async () => {
        console.log("savedflightssssssss in get by id", savedflights)
        const booking1 = {
            flight_id: savedflights[0]._id,
            status: "confirmed"
            }
            const booking2 = {
            flight_id: savedflights[1]._id,
            status: "confirmed"
            }
        console.log("token in get by id", token0)
            const res0 = await request(server)
            .post("/bookings")
            .set("Authorization", "Bearer " + token0)
            .send(booking1);
            Booking0Id = res0.body._id;
            console.log("res body for posting booking for getting id", res0.body)
            const res1 = await request(server)
            .post("/bookings")
            .set("Authorization", "Bearer " + adminToken)
            .send( booking2);
            Booking1Id = res1.body._id;
        });
        it("should send 200 to normal user with their booking ", async () => {
            console.log("in get by id bookingiddddd", Booking0Id)
            const res = await request(server)
            .get("/bookings/" + Booking0Id)
            .set("Authorization", "Bearer " + token0)
            .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject({
            flight_id: savedflights[0]._id.toString(),
            passenger_id: (await User.findOne({ email: user0.email }))._id.toString(),
            seat:"3A"
            });
        });
        it("should send 404 to normal user with someone else's booking", async () => {
            const res = await request(server)
            .get("/bookings/" + Booking1Id)
            .set("Authorization", "Bearer " + token0)
            .send();
            expect(res.statusCode).toEqual(404);
        });
        it("should send 200 to admin user with their booking", async () => {
            const res = await request(server)
            .get("/bookings/" + Booking1Id)
            .set("Authorization", "Bearer " + adminToken)
            .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject({
            flight_id: savedflights[1]._id.toString(),
            passenger_id: (await User.findOne({ email: user1.email }))._id.toString(),
            seat:"3A"
            });
        });
        it("should send 200 to admin user with someone else's booking", async () => {
            const res = await request(server)
            .get("/bookings/" + Booking0Id)
            .set("Authorization", "Bearer " + adminToken)
            .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject({
            flight_id: savedflights[0]._id.toString(),
            passenger_id: (await User.findOne({ email: user0.email }))._id.toString(),
            seat:"3A"
            });
        });
      });
    describe("GET /", () => {
        let Booking0Id, Booking1Id;
        
    beforeEach(async () => {
        console.log("savedflightssssssss in get by id", savedflights)
        const booking1 = {
            flight_id: savedflights[0]._id,
            status: "confirmed"
        }
        const booking2 = {
            flight_id: savedflights[1]._id,
            status: "confirmed"
        }
        console.log("token in get by id", token0)
            const res0 = await request(server)
            .post("/bookings")
            .set("Authorization", "Bearer " + token0)
            .send(booking1);
            Booking0Id = res0.body._id;
            console.log("res body for posting booking for getting id", res0.body)
            const res1 = await request(server)
            .post("/bookings")
            .set("Authorization", "Bearer " + adminToken)
            .send( booking2);
            Booking1Id = res1.body._id;
        });
        it("should send 200 to normal user with their booking", async () => {
            const res = await request(server)
              .get("/bookings")
              .set("Authorization", "Bearer " + token0)
              .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject([
              {
                flight_id: savedflights[0]._id.toString(),
                passenger_id: (await User.findOne({ email: user0.email }))._id.toString(),
                seat:"3A"
              },
            ]);
          });
          it("should send 200 to admin user all orders", async () => {
            const res = await request(server)
              .get("/bookings")
              .set("Authorization", "Bearer " + adminToken)
              .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject([
              {
                flight_id: savedflights[0]._id.toString(),
                passenger_id: (await User.findOne({ email: user0.email }))._id.toString(),
                seat:"3A"
              },
              {
                flight_id: savedflights[1]._id.toString(),
                passenger_id: (await User.findOne({ email: user1.email }))._id.toString(),
                seat:"3A"
              },
            ]);
          });
      })
    describe("GET /ticket/:id", () => {
        let Booking0Id, Booking1Id;
        beforeEach(async () => {
            console.log("savedflightssssssss in get by id", savedflights)
            const booking1 = {
                flight_id: savedflights[0]._id,
                status: "confirmed"
            }
            const booking2 = {
                flight_id: savedflights[1]._id,
                status: "confirmed"
            }
            console.log("token in get by id", token0)
                const res0 = await request(server)
                .post("/bookings")
                .set("Authorization", "Bearer " + token0)
                .send(booking1);
                Booking0Id = res0.body._id;
                console.log("res body for posting booking for getting id", res0.body)
                const res1 = await request(server)
                .post("/bookings")
                .set("Authorization", "Bearer " + adminToken)
                .send( booking2);
                Booking1Id = res1.body._id;
            })
            it("should send 400 for not a valid booking id", async () => {
                const res = await request(server)
                  .get("/bookings/ticket/id1")
                  .set("Authorization", "Bearer " + adminToken)
                  .send();
                expect(res.statusCode).toEqual(400);
            });
            it("should send 404 for not a valid booking id", async () => {
                const res = await request(server)
                  .get("/bookings/ticket/"+ Booking1Id)
                  .set("Authorization", "Bearer " + token0)
                  .send();
                expect(res.statusCode).toEqual(404);
            });
            it("should send 200 for not a valid booking id", async () => {
                const res = await request(server)
                  .get("/bookings/ticket/"+ Booking0Id)
                  .set("Authorization", "Bearer " + token0)
                  .send();
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject([
                    {
                      passenger_name: (await User.findOne({ email: user0.email })).name,
                      Phone:(await User.findOne({ email: user0.email })).phone
                    }
                  
                  ]);
            });   
    })
    })     
});
