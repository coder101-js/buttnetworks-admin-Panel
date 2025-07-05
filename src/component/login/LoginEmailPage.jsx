import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
const LoginEmailPage = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const inputRef = useRef();
  const userEmail = useRef(null);
  const emailExist = useRef(false);
  const isBlocked = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, isLoading] = useState(false);
  const locationErrMsg = location.state?.msg;
  const {
    register,
    handleSubmit,
    clearErrors,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    setIsDark(newTheme === "dark");
  };
  useEffect(() => {
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.add("body");
      document.body.classList.remove("body-admin");
    }
  }, []);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    clearErrors("formError");

    if (!data || !data.email) return;
    const { email } = data;
    userEmail.current = email;
    const body = {
      email: JSON.stringify({ email: email }),
      type: "email",
    };
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    try {
      isLoading(true);
      const api = await fetch("https://api.admin.buttnetworks.com/gateway", option);
      const res = await api.json();
      const value = res;
      const { login, token } = value;
      const { email } = login;

      const { block, exist } = email;
      emailExist.current = exist;
      isBlocked.current = block;

      if (!exist) {
        return setErrorMessage("Email was not found!");
      } else if (block) {
        return setErrorMessage("Email is blocked.");
      } else {
        setErrorMessage("");
        const { current: email } = userEmail;
        navigate("/login/password", { state: { email, token } });
        userEmail.current = "";
      }
    } catch (err) {
      console.error("🔥 Error during login:", err);
      setErrorMessage(
        "We’re having trouble processing your request. Please try again shortly"
      );
    } finally {
      isLoading(false);
    }
  };

  // 🔁 First render only stuff
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");
    setFocus("email");
  }, []);

  return (
    <>
      <div className={loading ? "loading" : "hide"}></div>
      <p className={locationErrMsg ? "emailErr" : "none"}>{locationErrMsg}</p>
      <div>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          <FontAwesomeIcon
            icon={isDark ? faSun : faMoon}
            className={isDark ? "sun" : "moon"}
          />
        </button>
        <div className="container">
          <div className="contentWrapper">
            <img src={logo} alt="Security" className="logo" />
            <h3>Sign in</h3>
            <p>Use Your Account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="dataLabel">
              {errors.email && <p>{errors.email.message}</p>}
              Email:
            </label>
            <input
              type="Email"
              placeholder="Email"
              name="email"
              ref={inputRef}
              {...register("email", {
                required: { value: true, message: "Email is required" },
              })}
            />
            <p className="inputErr">{errorMessage}</p>
            <div className="btnContainer">
              <button type="submit" className="btn" disabled={isSubmitting}>
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginEmailPage;
