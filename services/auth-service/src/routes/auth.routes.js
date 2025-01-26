const express = require("express");
const router = express.Router();

const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

router.get("/", async (req, res) => {
  res.send("this is the Auth Home.");
});

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.get("/getAllAuthUsers", controller.findAll);

router.get("/getAuthUser", controller.findOne);

router.post("/signin", controller.signin);

router.post("/signout", controller.signout);

router.post("/updatePassword", controller.updatePassword);

router.put("/updateAuthUser/:id", controller.update);

router.post(
  "/createAuthUser",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.create
);

module.exports = router;
