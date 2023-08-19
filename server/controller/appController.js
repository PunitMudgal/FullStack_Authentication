/** POST /register */
export async function register(req, res) {
  res.json("register route");
}

/** POST /login */
export async function login(req, res) {
  res.json("login route");
}

/** GET /user/example123 */
export async function getUser(req, res) {
  res.json("getUser route");
}

/** PUT /updateUser */
export async function updateUser(req, res) {
  res.json("updateUser route");
}

/** GET /generateOTP */
export async function generateOTP(req, res) {
  res.json("generateOTP route");
}

/** GET /verifyOTP */
export async function verifyOTP(req, res) {
  res.json("verifyOTP route");
}

// successfullt refirect user when OTP is valid
/** GET /createResetSession */
export async function createResetSession(req, res) {
  res.json("createResetSession route");
}

/** PUT /resetPassword */
export async function resetPassword(req, res) {
  res.json("resetPassword route");
}
