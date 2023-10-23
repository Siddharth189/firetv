import React, { useState } from "react";
import { useFormik } from "formik";
import { login } from "../../utils/authSlice";
import { useDispatch } from "react-redux";

async function registerUser(credentials) {
  const response = await fetch("http://localhost:8080/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (response.ok) {
    return data.token;
  } else {
    throw new Error(data.message);
  }
}

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 15) {
    errors.name = "Must be 15 characters or less";
  }

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

const Register = () => {
  const [isHovered, setIsHovered] = useState(false);

  const subBtnStyle = {
    backgroundColor: "white",
    color: "#041243",
    border: isHovered ? "2px solid black" : "none",
    borderRadius: "10px",
  };

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const token = await registerUser(values);
        console.log("Register => ", token);
        alert("Registration successful");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    },
  });
  return (
    <div className="register">
      <form
        onSubmit={formik.handleSubmit}
        className="form"
        style={{ color: "#041243", backgroundColor: "white" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2>Register</h2>
        </div>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          className="input"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.errors.name ? <div>{formik.errors.name}</div> : null}

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

        <button
          type="submit"
          className="sub-btn"
          style={subBtnStyle}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
