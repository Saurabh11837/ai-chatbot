export const generateOTP = () => {
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generating OTP...", otp);
    return otp;
}