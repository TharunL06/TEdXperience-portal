// This script defines a middleware function named fetchuser, which is responsible for extracting and verifying a user's JWT token from the request headers.
// The JWT token is used to validate whether the user is active or not. If the token is valid, the user data is extracted and added to the request object for further use.

// JWT_SECRET is the secret key used for signing and verifying JWT tokens.
const JWT_SECRET = "tedxlearning$";

// The script uses the 'jsonwebtoken' library for token operations.
var jwt = require("jsonwebtoken");

// fetchuser middleware function, these parameter should be in this order
const fetchuser = (req, res, next) => {
  // Get the user's JWT token from the request headers
  const token = req.header("auth-token");

  // If the token is not present, send a 401 Unauthorized response
  if (!token) {
    res.status(401).send({
      error: "Please authenticate using a valid token",
    });
  }

  try {
    // Verify the token using the JWT_SECRET
    const data = jwt.verify(token, JWT_SECRET);

    // Add the user data to the request object
    req.user = data.user;

    // Call the next middleware in the stack
    next();
  } catch (error) {
    // If token verification fails, send a 401 Unauthorized response
    res.status(401).send({
      error: "Please authenticate using a valid token",
    });
  }
};

// Export the fetchuser middleware for use in other modules
module.exports = fetchuser;
