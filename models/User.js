import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  firstName: String,
  lastName: String,

  dob: Date,

  avatar: String,

  isVerified: {
    type: Boolean,
    default: false
  },

  isProfileComplete: {
    type: Boolean,
    default: false
  },

  otp: String,

  otpExpires: Date,



}, { timestamps: true })

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model("User", userSchema);