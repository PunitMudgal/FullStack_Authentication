import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIL;
// axios.defaults.baseURL = "http://localhost:8080";

/** MAKE API REQUEST */

/** TO GET USERNAME FROM TOKEN */
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("cannot find token");
  let decode = jwt_decode(token);
  return decode;
}

/** AUTHENTICATE */
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "username doesn't exist!" };
  }
}

/** GET USER DETAILS */
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "password doesn't match!" };
  }
}

/** REGISTER USER  */
export async function registerUser(userData) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, userData);

    let { username, email } = userData;

    // send email
    if (status === 201) {
      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text: msg,
      });
    }
    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/**LOGIN  */
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });
      return Promise.resolve({ data });
    }
  } catch (err) {
    return Promise.reject({ error: "Password doesn't match!" });
  }
}

/** UPDATE USER PROFILE */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/api/updateUser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't update profile!" });
  }
}

/** GENERATE OTP */
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });

    // send mail with otp
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your password recovery otp is ${code}. Verify and recover your password`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** VERIFY OTP */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

/** RESET PASSWORD */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
