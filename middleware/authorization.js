const isAdmin = async (req, res, next) => {
    try {
        if (req.user.roles.includes('admin')) {
            next(); // Call next() to pass control to the next middleware or route handler
        } else {
            res.sendStatus(403); // Send Forbidden status if user is not an admin
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = isAdmin;