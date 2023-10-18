import { User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js"; 
import { sendMail } from "../utils/sendMail.js";



export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user = await User.create({
      name,
      email,
      password,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });

    await sendMail(email, "Verify your Account", `Your OTP is ${otp}`);

    sendToken(res, user, 201, "OTP sent to your email, please verify your account"); 

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
    


export const verify = async (req, res) => {
  try {
    
    const otp = Number (req.body.otp);

    const user = await User.findById(req.user._id);

    if(user.otp !== otp || user.otp_expiry < Date.now()) {
      return res.status(400).json({success: false, message: "Invalid OTP or has been expired"});
    }

    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Account Verified");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    sendToken(res, user, 200, "Login Successful"); 

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).cookie("token", null, {
      expires: new Date(Date.now()),
    }).json({success: true, message: "Logged out Successfully"});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};