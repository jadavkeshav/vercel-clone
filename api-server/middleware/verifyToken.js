const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

   
}

module.exports = verifyToken;