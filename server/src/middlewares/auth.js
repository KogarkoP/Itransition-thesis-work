import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({
      message: "Authorization problems",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({
        message: "Authorization problems",
      });
    }

    req.user = decoded;

    next();
  });
};

export default auth;
