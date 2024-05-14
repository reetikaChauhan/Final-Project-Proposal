A description of the scenario my project is operating in:
- The project name is Airline Ticketing system. 
- The technical stack :
    Postman as frontend.
    Backend Express and Mongodb
- It will consist of following features:
    Authentication : ( as microservice) 
    authorization: ( admin and user)
    Admin manages adding airports, ailines, flights.
    User books flight
    Managing seats of the flight booking.
-  The technical components of my project will be, including: the routes, the data models as follows:
 Models:
- Airports: (_id, name(String) , code((String)), location((String)))
- Airlines: (_id, name(String), code(String))
- Flights : (_id , departureairportid(referencetoairport), arrivalairportId(referencetoairport), departuretime(String), arrivaltime(string),airline_id(refrencetoailine), price(String),seatmap[ String](Bonus feature))
- The below  values together should be unique and indexed as on the same time one airline cannot be on different locations[ departureairportid(referencetoairport), arrivalairportId(referencetoairport),departuretime(String), arrivaltime(string),airline_id(refrencetoailine)]
- Bonus feature: Each flight will have a seat map initilized with zero to all seat key- value pairs. Each flight would be booked based on the available seats on that flight. When booked it will change to one.
- The seat-map logic may change while implementing. 
- passenger: (_id, name(String), email(String),password, phone-number(String)) [When sign up get all the values]
Bookings: (_id, passenger_id, flight_id, status, seat_confirmed)

 Routes
- Login
  - Signup: `POST /auth/signup`
  - Login: `POST /auth/login`
  - Change Password `PUT /auth/password`
- Airport (requires authentication)
  - Create: `POST /airport` - restricted to users with the "admin" role
  - Get all airport: `GET /airport` - open to all users
  - Get specific airport: `GET /airport/:id` - open to all users
- Airlines (requires authentication)
  - Create: `POST /airport` - restricted to users with the "admin" role
  - Get all airline: `GET /airline` - open to all users
  - Get specific airline: `GET /airline/:id` - open to all users
  Text search with airport city name
- Flights (requires authentication)
  - Create: `POST /flight` - restricted to users with the "admin" role
  - Get all flights: `GET /flights` - open to all users
  - Get specific flight: `GET /flights/:id` - open to all users 
    getting specific flight with respect to date of departure /arrival sent in body - Text search
-  Booking (requires authentication)
    - Create: `POST /booking` - open to all users 
    sending flightid, passenger_id, status, seatconfirmed
    - Get all bookings: `GET /bookings` - restricted to users with the "admin" role
    - Get ' GET /bookings/:id - open to all users , if user has booked that flight other wise not allow if admin allow all the bookings for that flight
    - Get ' GET/ bookings/? flightid - open to all users , if user has booked that flight other wise not allow or if admin allow all the bookings for that flight
- ticket(requires authentication) (GET/bookings/ticket)
  allow user to view his or her ticket aggregation on flight and bookings

Meeting Requirements :
- Authentication and Authorization
- The project as 4 set of CRUD routes(airport, airline, flights, booking) (not counting authentication)
- Indexes for performance and uniqueness when reasonable. In flights the set of values should be unique and indexed.
- Aggregation and text search in getting airports, user retrieving a ticket route, searching a flight.
- No external data provider till now.
- Interact with my API using postman.

My project is completely my own idea and logic. Not following any already made project. The logic of seat map, ticket retrievals are figured out without implementation so may change while implementing. 
I will learn:
- how to architect a model schema for properly handling and retrieving data in an optimized manner.
- Learn and Build microservices. I think this will make my project little unique. I Will also  present that part of project in supplemental project topics. 
- Practice aggregations , lookups and text search by implementing those concepts and learning when there is a need to implement aggregations.

The project task breakdown:
Week 1 (May 14 - May 21) : Authentication as microservice, Authorization,(5 days) building models, Routes, tests for authentication(2 days).
Week 2(May 21 - may 28): Daos functions for the routes, CRUD operations, aggregation , text search and lookup(user retrieving a ticket route, searching a flight )
Week 3 (May 28 - june 4) Build  detailed unit tests for all routes (airline, airport,flight, booking)

A description of what problem my project seeks to solve: It help the user to search and book airline tickets.