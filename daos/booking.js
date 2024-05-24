const Booking = require('../models/booking');
const mongoose = require('mongoose');
const Flights = require('../models/flights');
module.exports = {};



module.exports.bookflight = async(bookingobj,userId, booked_seat) => {
    const bookingresult =  await Booking.create({flight_id:bookingobj.flight_id,status:bookingobj.status,passenger_id:userId, seat:booked_seat});
    return bookingresult
}

module.exports.getBookings = async(user) => {
    let allbookings
    if(user){
         allbookings = await Booking.find({passenger_id:user }).lean(); 
         console.log("in daos user with its booking", allbookings)
    }
    else{
         allbookings = await Booking.find({ }).lean(); 
    }
   
    return allbookings;
}
module.exports.getBookingswithid = async(user,id) => {
    let allbookings
    if(user){
         allbookings = await Booking.findOne({passenger_id:user,_id:id }).lean(); 
    }
    else{
         allbookings = await Booking.findOne({ _id:id}).lean(); 
    }
   
    return allbookings;
}

module.exports.isavailable = async(fid) => {
    try {
        const flight_Id = new mongoose.Types.ObjectId(fid);
        const allseatobj = await Flights.find({
            _id:fid,
            seat_map: {
                $elemMatch: {
                    booked: false
                }
            }
        }).lean();

        
        console.log('Bookings with available seats:', allseatobj);
        return allseatobj;
    } catch (err) {
        console.error('Error finding bookings:', err);
        throw err
    } 
     
}

module.exports.getTicketofUser = async (userID, bookingId) => {
    console.log("user in ticket", userID, bookingId);
    const user_Id = new mongoose.Types.ObjectId(userID);
    const booking_Id = new mongoose.Types.ObjectId(bookingId);
    try{
        const result = await Booking.aggregate([
        {
            $match: {
                _id: booking_Id,
                passenger_id: user_Id
            }
        },
       
        {
            $lookup: {
                from: 'users',
                localField: 'passenger_id',
                foreignField: '_id',
                as: 'passenger_info',
            }
        },
        
        {
            $unwind: '$passenger_info',
        },
        {
            $lookup: {
                from: 'flights',
                localField: 'flight_id',
                foreignField: '_id',
                as: 'flight_info',
            },
        },
        {
            $unwind: '$flight_info',
        },
        {
            $lookup: {
                from: 'airports',
                localField: 'flight_info.departure_airport_id',
                foreignField: '_id',
                as: 'departure_airport',
            },

        },
        {
            $unwind: '$departure_airport',
        },
        {
            $lookup: {
                from: 'airports',
                localField: 'flight_info.arrival_airport_id',
                foreignField: '_id',
                as: 'arrival_airport',
            },

        },
       
        {
            $unwind: '$arrival_airport',
        },
        {
            $lookup: {
                from: 'airlines',
                localField: 'flight_info.airline_id',
                foreignField: '_id',
                as: 'airline_info',
            },
        },
        {
            $unwind: '$airline_info',
        },
            
        {
            $project: {
                _id: 1,
               seat:1,
               status:1,
               passenger_name:'$passenger_info.name',
               Phone:'$passenger_info.phone',
               Email:'$passenger_info.email',
               airline:'$airline_info.name',
               departure_date: '$flight_info.departure_date',
               departure_time:'$flight_info.departure_time',
               departure_airport:'$arrival_airport.name',
               arrival_date: '$flight_info.arrival_date',
               arrival_time:'$flight_info.arrival_time',
               arrival_airport:'$arrival_airport.name',
            },
        }
        
    ]);
    console.log("Match result:", result);
    return result;
}
    catch (error) {
         console.error('Error performing aggregation:', error);
        throw error
        }
};


// module.exports.getTicketofUser = async(user,id) => {
//     console.log("user in ticket",user,id)
//     try {
//         const result = await Booking.aggregate([
//             {
//                 $match: {
//                   _id: id,
//                   passenger_id: user
//                 }
//               },
//             {
//                 $lookup: {
//                     from: 'user',
//                     localField: 'passenger_id',
//                     foreignField: '_id',
//                     as: 'passenger_info',
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'flights',
//                     localField: 'flight_id',
//                     foreignField: '_id',
//                     as: 'flight_info',
//                 },
//             },
//             {
//                 $unwind: '$passenger_info',
//             },
//             {
//                 $unwind: '$flight_info',
//             },
//             {
//                 $lookup: {
//                     from: 'airports',
//                     localField: 'flight.departure_airport_id',
//                     foreignField: '_id',
//                     as: 'departure_airport',
//                 },

//             },
//             {
//                 $lookup: {
//                     from: 'airports',
//                     localField: 'flight.arrival_airport_id',
//                     foreignField: '_id',
//                     as: 'arrival_airport',
//                 },

//             },
//             {
//                 $unwind: '$departure_airport',
//             },
//             {
//                 $unwind: '$arrival_airport',
//             },
//             {
//                 $project: {
//                   _id: 1,
//                   departure_airport_name:"$departure_airport.name",
//                   status: 1
//                 }
//               },
//         ]);

//         console.log("in daos",result);
//         return result;
//     } catch (error) {
//         console.error('Error performing aggregation:', error);
//         throw error
//     }
   
    
// }



class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;