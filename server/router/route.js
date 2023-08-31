import { Router } from "express";
const router = Router();
import * as controller from "../controller/appController.js";
import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail } from "../controller/mailer.js";

/** POST METHOD */
router.route("/register").post(controller.register);
router.route("/registerMail").post(registerMail); // send email
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login); // login in app

/** GET METHOD */
// router.route("/deleteAllUsers")
router.route("/alluser").get(controller.getAllUser);
router.route("/user/:username").get(controller.getUser); // user with usename
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

/** PUT METHOD */
router.route("/updateUser").put(Auth, controller.updateUser); // to update the user profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;
