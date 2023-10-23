import React from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../utils/authSlice";
import { Link } from "react-router-dom";

async function loginUser(credentials) {
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

const validate = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Password length must me atleast 8";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

const Login = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const token = await loginUser(values);
        console.log("Login => ", JSON.stringify(token));
        console.log("Login message => ", token.message);
        console.log("Login user => ", token.user);
        if (token.user !== undefined) dispatch(login(JSON.stringify(token)));
        else alert(token.message);
      } catch (error) {
        alert(error);
      }
    },
  });
  return (
    <div className="login">
      {token !== null ? (
        <div
          className="loading form"
          style={{
            backgroundColor: "#041243",
            color: "white",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <span className="check" style={{ fontSize: "3em" }}>
            &#10003;
          </span>
          <p>You have logged in</p>
        </div>
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className="form"
          style={{ backgroundColor: "#041243", color: "white" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2>Login</h2>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@gmail.com"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.errors.email ? <div>{formik.errors.email}</div> : null}

          <input
            id="password"
            name="password"
            placeholder="password"
            type="text"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.errors.password ? <div>{formik.errors.password}</div> : null}

          <div className="flex-row" style={{ marginTop: "20px" }}>
            <Link href={"/auth"} style={{ fontSize: "0.8em" }}>
              Forgot password?
            </Link>
            <button type="submit" className="sub-btn">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
