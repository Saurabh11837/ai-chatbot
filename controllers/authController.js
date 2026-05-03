import User from "../models/User.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPEmail } from "../services/emailService.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
// Signup
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already registered" });
    }
    console.log("Creating user with email:", email);
    console.log("Password: ", password);
    // Generate OTP for the user
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otp = generateOTP();
    console.log("Generated OTP in controller:", otp);

    // Send OTP to user's email
    const mailVerification=await sendOTPEmail(email, otp);
    // --> if condition tab hi run karega jab emailService.js ke file se return{ success:true }; krego
    // if(mailVerification.success){
    //     console.log("OTP email sent successfully to", email);
    // }
    // Create a new user with OTP
    const user = await User.create({
      email,
      password,
      otp,
      otpExpires: Date.now() + 15 * 60 * 1000, // OTP expires after 15 minutes
    });

    console.log("User created:", user);
    
    return res.status(200).json({
      success: true,
      message: "OTP sent",
      oto: otp, // Remove this in production, only for testing
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
      error: error.message,
    });
  }
};

// Verify OTP
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Validate OTP
//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Check if OTP has expired
//     if (user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     // Update user as verified
//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       nextStep: "complete-profile", // Prompt to complete profile
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong, please try again later.",
//     });
//   }
// };
// Verify OTP
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });
//     console.log("User found for OTP verification:", user);
//     console.log("User found for OTP verification:", user.id, user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found for otp verification" });
//     }
//     if (user.otpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }
//     let token;
//     if (user.otp == otp) {
//       console.log("OTP verified successfully for user:", email);
//       // Generate token here and send it in the response
//       // Mark user verified
//       user.isVerified = true;
//       user.otp = null;
//       user.otpExpires = null;

//       await user.save();
//       token=generateToken(user._id);
//       // res.cookie("token", token).status(200).json({
//       //           success:true,
//       //           token,
                
//       //           message:"OTP Verified successfully"
//       //       })
//     }else{
//       return res.status(400).json({ message: "Invalid OTP" });

//     }
//     // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded token in OTP verification:", decoded);
//     return res.status(200).json({
//       success: true,
//       token,
//       nextStep: "complete-profile",
//       user: {
//         id: user._id,
//         email: user.email,
//         isVerified: user.isVerified,
//       }
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };

// Verify otp some update
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    // ✅ Generate token
    const token = generateToken(user._id);

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      nextStep: "complete-profile",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Complete Profile
export const completeProfile = async (req, res) => {
  try {
    const {email, password, firstName, lastName, dob } = req.body;
    console.log(req.body);
    console.log(firstName, lastName, dob)
    // Find the user by ID (assuming user is authenticated and their ID is in req.user)
    console.log("User ID from token in completeProfile:", req.user.id);
    const id=req.user.id || req.user._id; // Adjust based on how the token is structured
    console.log("Extracted User ID for profile completion:", id);
    const user = await User.findById(id);
    console.log("User found for profile completion:--", user);
    if (!user) {
      return res.status(404).json({ message: "User not found for profile completion" });
    }
    console.log("User found for profile completion:", user);
    // Update the user's profile with the provided data
    user.firstName = firstName;
    user.lastName = lastName;
    user.dob = dob;
    user.isProfileComplete = true;

    await user.save();
    const userUpdate = await User.findById(id);
    console.log("Updated user profile:--", userUpdate);
    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
      error: error.message,
    });
  }
};

// Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the password matches
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Wrong password" });
//     }

//     // Generate token for the user
//     const token = generateToken(user._id);
//     console.log("Generated token and Login user successfully:", token);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token in login:", decoded);
    
//     return res.status(200).json({
//       success: true,
//       token,
//       user: {
//         id:user._id,
//         email: user.email, // Send minimal user data for security reasons
//         name: user.name,
//         isVerified: user.isVerified,
//         isProfileComplete: user.isProfileComplete,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong, please try again later.",
//     });
//   }
// };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or mismatch password" });
    }
    console.log("User found for login:", user);
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // cookie (recommended)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        token:token,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        isProfileComplete: user.isProfileComplete,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



// for chat auto verification chat route call or not
export const userCheck = async (req,res)=>{
  try{
    const userId = req.user?.id;
    console.log("User Id:",userId)
    if(!userId){
      return res.status(404).json({
        success:false,
        message:"User id not found"
      })
    }
    const user=await User.findById(userId)
    console.log("User Info : ",user)
    return res.status(200).json({
      success : true,
      user: userId,
      userInfo: user
    })
  }catch(err){
    return res.status(500).json({
      success:false,
      Error: err.message
    })
  }
  
}

// Logout
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // expire immediately
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};




// 🔥 FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forget password email : ",email)
    const user = await User.findOne({ email });
    console.log("Forget password email : ",user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP(); // 6 digit code

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Todo forget password update user password in db.
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // validations
    if (!email ||  !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    

    // ✅ Update password
    user.password = newPassword; // hash middleware chalega (assuming)
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


