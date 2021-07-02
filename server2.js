import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
dotenv.config();
const app = express();
app.use(express.json());  // a method inbuilt in express to recognize the incoming Request Object as a JSON Object, often used when the http method are put or post
const information = [
  {
    name: "Binh",
    age: 21,
  },
  {
    name: "An",
    age: 60,
  },
];
app.get("/api1", authenticateToken, (req, res) => {
  res.json(information.filter(item => item.name === req.user.name));
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken });
})
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(" ")[1];
  if(token == null) return res.status(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // user ở đây chính là payload mà mình sử dụng để tạo JWT, thế nên có mỗi 1 props là name
    if(err) return res.status(403);
    req.user = user;
    next();
  });
}
app.listen(4000);
