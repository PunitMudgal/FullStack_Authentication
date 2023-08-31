import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await userModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "can't find user!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "authentication error" });
  }
}

/** POST /register */
// {
//   "username": "punitmudgal_",
//   "email": "ssmudgal01@gmail.com",
//   "password": "TONYSTARKINTHEHEAVEN",
//   "profile": ""
// }
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    const checkUsername = await userModel.findOne({ username });
    // check if username already exists in db
    if (checkUsername) {
      res.status(400).send({ err: "username already exist" });
      throw new Error("Username already in use");
    }

    // checks if email already exists in db
    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
      res.status(400).send({ err: "email already exist" });
      throw new Error("email already used");
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = new userModel({
      username,
      password: hashPass,
      profile: profile || "",
      email,
    });
    user
      .save()
      .then(res.status(201).send({ msg: "user registerd successfully" }))
      .catch((error) =>
        res.stauts(500).send({ err: "unable to save the user" })
      );
  } catch (error) {
    return res.status(500).send({ err: "unable to create the user" });
  }
}

/** POST /login */
export async function login(req, res) {
  const { username, email, password } = req.body;
  try {
    const findUser = (await username)
      ? userModel.findOne({ username })
      : userModel.findOne({ email });
    findUser
      .then((user) => {
        bcrypt.compare(password, user.password).then((passwordCheck) => {
          if (!passwordCheck)
            return res.status(400).send({ error: "Wrong password" });

          //create jwt token
          const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            ENV.JWT_SECRET,
            { expiresIn: "24h" }
          );

          return res.status(200).send({
            msg: "login successfull.",
            username: user.username,
            token,
          });
        });
      })
      .catch((error) => {
        return res.status(404).send({ error: "username or Email not found!" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET /user/:example123 */
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return req.status(501).send({ err: "Envalid username!" });

    const findUser = await userModel.findOne({ username });
    if (findUser) {
      /** remove password from user */
      // mongoose return unnecessary data with object so convert it into json
      const { password, ...rest } = Object.assign({}, findUser.toJSON());
      return res.status(201).send(rest);
    } else {
      return res.status(404).send({ error: "couldn't find the user" });
    }
  } catch (error) {
    return res.status(404).send({ error: "cannot find the user data" });
  }
}
//! get all users
export async function getAllUser(req, res) {
  const AllUsers = await userModel.find();
  res.status(200).json(AllUsers);
}
// !------
/** PUT /updateUser */
export async function updateUser(req, res) {
  try {
    // const id = req.query.id;
    const { userId } = req.user;
    if (userId) {
      const body = req.body;

      // update the data
      const updatedInfo = await userModel.updateOne({ _id: userId }, body);
      if (updatedInfo)
        return res.status(201).send({ msg: "Record Updated!", updatedInfo });
      else {
        return res
          .status(401)
          .send({ error: "couldn't update the user info!" });
      }
    } else {
      return res.status(401).send({ error: "user not found..!" });
    }
  } catch (err) {
    return res.status(501).send({ err });
  }
}

/** GET /generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(4, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET /verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

// successfullt refirect user when OTP is valid
/** GET /createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(400).send({ error: "session expired!" });
}

/** PUT /resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "session expired!" });
    else {
      const { username, password } = req.body;

      try {
        userModel
          .findOne({ username })
          .then((user) => {
            bcrypt
              .hash(password, 10)
              .then((hashedPassword) => {
                userModel
                  .updateOne(
                    { username: user.username },
                    { password: hashedPassword }
                  )
                  .then((data) => {
                    req.app.locals.resetSession = false; // reset session
                    return res.status(201).send({ msg: "record updated!" });
                  })
                  .catch((err) => {
                    return res
                      .status(500)
                      .send({ err: "couldn't update the user details!" });
                  });
              })
              .catch((err) => {
                return res
                  .status(500)
                  .send({ err: "enable to hashed password!" });
              });
          })
          .catch((err) => {
            return res.status(500).send({ err: "user not found!" });
          });
      } catch (error) {
        return res.status(500).send({ error });
      }
    }
  } catch (error) {
    return res.stauts(501).send({ error });
  }
}
