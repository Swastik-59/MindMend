import jwt from "jsonwebtoken";

export const generateTokens = (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "none",
    secure: true,
  });
  return token;
};
