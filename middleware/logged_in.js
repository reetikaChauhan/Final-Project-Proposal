const tokenDAO = require('../daos/token');

const isLoggedIn = async (req, res, next) => {
  // Extract token from authorization header
  const token = req.headers.authorization?.split(' ')[1];
  // Check if token is missing or invalid
  if (!token || token === "BAD") {
    return res.status(401).send('Unauthorized: No token provided');
  }
  
  try {
    // Verify token and get user ID
    const user = await tokenDAO.getUserFromToken(token);
    console.log("i am in middleware", user)
    // If token is invalid or no user ID is found, send unauthorized response
    if (!user) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    console.log("in token user", user)
    // Attach user ID to request object for future use
    req.user = user;
    
    // Call next middleware or route handler
    next();
  } catch (error) {
    if (error.message === 'Invalid token' || error.message === 'Token not found') {
        return res.status(401).send('Unauthorized: Invalid token');
      }
    // Handle internal server error
    return res.status(500).send('Internal server error');
  }
};

module.exports = isLoggedIn;
