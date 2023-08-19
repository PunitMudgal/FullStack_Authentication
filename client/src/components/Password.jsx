import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import styles from "../styles/Username.module.css";
import { passwordValidate } from "../helper/validate";

function Password() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello There!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <Link className="text-red-500" to="/recovery">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password;
