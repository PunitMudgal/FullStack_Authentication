import { Router } from "express";
const router = Router();
import * as controller from "../controller/appController.js";

/** POST METHOD */
router.route("/register").post(controller.register);
// router.route("/registerMail").post(); // send email
// router.route("/authenticate").post(req, (res) => res.end()); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login); // login in app

/** GET METHOD */
router.route("/alluser").get(controller.getAllUser);
router.route("/user/:username").get(controller.getUser); // user with usename
router.route("/generateOTP").get(controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

/** PUT METHOD */
router.route("/updateUser").put(controller.updateUser); // to update the user profile
router.route("/resetPassword").put(controller.resetPassword); // use to reset password

export default router;
