export const generateOTP =({expiredTime = 15 * 60*1000})=>{
    const otp = Math.floor(Math.random() * 90000 + 10000);
    const otpExpire = new Date(Date.now() + expiredTime);
    return {otp,otpExpire};
}