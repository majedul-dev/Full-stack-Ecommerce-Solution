const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        // Enhanced token extraction
        let token = req.cookies?.token || 
                   (req.headers?.authorization?.startsWith("Bearer ") ? 
                    req.headers.authorization.split(" ")[1] : null);

        // Validate token presence and format
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
            return res.status(401).json({
                message: "Invalid token format",
                error: true,
                success: false,
            });
        }

        // Verify token with enhanced error handling
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                
                // Specific error handling
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: "Session expired. Please login again.",
                        error: true,
                        success: false,
                    });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({
                        message: "Invalid token. Please login again.",
                        error: true,
                        success: false,
                        details: err.message // Include specific error detail
                    });
                }
                
                // Generic error fallback
                return res.status(401).json({
                    message: "Authentication failed",
                    error: true,
                    success: false,
                });
            }

            // Additional payload validation
            if (!decoded?._id) {
                return res.status(401).json({
                    message: "Invalid token payload",
                    error: true,
                    success: false,
                });
            }

            req.userId = decoded._id;
            next();
        });

    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({
            message: "Internal server error during authentication",
            error: true,
            success: false,
        });
    }
}

module.exports = authToken;