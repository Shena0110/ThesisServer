import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
    
        if (!token) {
            return res.status(401).json({ success: false, message: "Login first" });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        req.user = await User.findById(decoded._id);
        
        next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }
        res.status(500).json({ success: false, message: error.message });
    }    
};
