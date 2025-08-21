import jwt from "jsonwebtoken";
/** * Generates a JWT token for a user with a specified expiration time.
 * @param {Object} user - The user object containing user details.
 * @param {string} time - The expiration time for the token (e.g., "15m", "1h").
 * @returns {string} - The generated JWT token.
 */
export const generateToken =({payload,secretKey="this-is-token-for-sara7a-App",options ={expiresIn : "15m"}})=>{
 const token = jwt.sign(payload,secretKey,options);
    return token ;
};
export const verifyToken = (token, secretKey="this-is-token-for-sara7a-App") => {
    return jwt.verify(token, secretKey);
};
export const refreshToken = (user) => {
    const token = jwt.sign({ id: user._id,name:user.fullName ,email:user.email }, "this-is-token-for-sara7a-App", { expiresIn: "7d" });
    return token;
};
