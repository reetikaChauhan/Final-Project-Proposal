const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');
const isLoggedIn = require('../middleware/logged_in')

const bcrypt = require('bcrypt');

// router.post('/signup', async (req, res, next) => {
//   try {
//     console.log("in airline req.body", req.body)
//     const response = await axios.post(`${AUTH_SERVICE_URL}/signup`, req.body);
//     res.status(response.status).send(response.data);
//   }  catch (error) {
//     console.error('Error during signup:', error.message);
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     } else if (error.request) {
//       console.error('No response received:', error.request);
//     } else {
//       console.error('Request setup error:', error.message);
//     }
//     res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
//   }
// });

// router.post('/login', async (req, res, next) => {
//   try {
//     console.log("in airline ticket login",req.body)
//     const response = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
//     res.status(response.status).send(response.data);
//   } catch (error) {
//         console.error('Error during login:', error.message);
//         if (error.response) {
//           console.error('Status:', error.response.status);
//           console.error('Data:', error.response.data);
//         } else if (error.request) {
//           console.error('No response received:', error.request);
//         } else {
//           console.error('Request setup error:', error.message);
//         }
//         res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
//       }
//});

// router.put('/password', isAuthenticated, async (req, res, next) => {
//     try {
//       const response = await axios.put(`${AUTH_SERVICE_URL}/password`, req.body, {
//         headers: {
//           Authorization: req.headers.authorization,
//         },
//       });
//       res.status(response.status).send(response.data);
//     } catch (error) {
//       console.error('Error during password change:', error.message);
//       res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
//     }
//   });

router.post("/login", async (req, res, next) => {
    const userobj = req.body;
    if (!userobj.email || !userobj.password || JSON.stringify(userobj) === '{}') {
        res.status(400).send('email and password is required');
    } else {
        try {
            const userrecord = await userDAO.getUser(userobj.email);
            if (!userrecord) {
                res.status(401).send('User not found');
            } else {
                const passwordmatch = await bcrypt.compare(userobj.password, userrecord.password);
                if (!passwordmatch) {
                    res.status(401).send('Password does not match');
                } else {
                    const tokenrecord = await tokenDAO.makeTokenForUserId(userrecord._id);
                    return res.status(200).json({ token: tokenrecord });
                }
            }
        } catch (error) {
            if (error instanceof userDAO.BadDataError) {
                // Handle specific error types
                return res.status(409).send(error.message); // 409 for duplicate key error
            } else {
                // Handle other errors
                next(error);
            }
            next(error);
        }
    }
});


// // Create
router.post("/signup", async (req, res, next) => {
    const userobj = req.body;
  if (!userobj.email || !userobj.password || JSON.stringify(userobj) === '{}' ) {
    return res.status(400).send('email and password is required');
  } 
    try {
        const saveduser = await userDAO.create(userobj);
        console.log("saveduser in dao", saveduser)
        return res.status(200).json(saveduser);
        
    } catch(error) {
        if (error instanceof userDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            next(error);
        }
    }
});


//PUT /password
router.put("/password",isLoggedIn, async (req, res, next) => {
    const userpassword = req.body;
    if(!userpassword.password){
        return res.status(400).send('password is required');
    }
    const userId = req.user._id
    try {
        const passwordupdated = await userDAO.updateUserPassword(userId,userpassword.password)
        return res.status(200).json(passwordupdated);
    } catch(e) {
        next(e)
    }

});


  module.exports = router;