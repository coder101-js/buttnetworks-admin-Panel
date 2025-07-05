import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
const LoginPassword = () => {
  const [isDark, setIsDark] = useState(false);
  const [show, setShow] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [message, setMessage] = useState("");
  const [captchaErr, setCaptchaErr] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const captchaRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or localStorage
  const locationEmail = location.state?.email;
  const locationToken = location.state?.token;
  const storedEmail = localStorage.getItem("userEmail");
  // localStorage.removeItem('userEmail')

  const [email, setEmail] = useState(() => {
    return locationEmail || storedEmail || "";
  });

  useEffect(() => {
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.add("body");
      document.body.classList.remove("body-admin");
    }
  }, []);
  // Save the email ONLY if it came from location (i.e., new login)
  useEffect(() => {
    if (
      locationEmail &&
      locationEmail !== "null" &&
      locationEmail !== "undefined"
    ) {
      localStorage.setItem("userEmail", locationEmail);
    }
  }, [locationEmail]);

  const {
    register,
    handleSubmit,
    clearErrors,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(currentTheme === "dark");
    // Fix: Delay focus until DOM is ready
    setTimeout(() => {
      setFocus("password");
    }, 0);
  }, [setFocus]);

  useEffect(() => {
    const msg = "Enter Email first!";
    console.log(msg);
    const checkEmailAuth = async () => {
      console.log("📤 gettting email from email page:", email); // Debug here!
      console.log("📤 gettting token from email page:", locationToken); // Debug here!
      try {
        const body = {
          type: "password/token/auth",
          email,
          token: locationToken,
        };
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };
        const api = await fetch("https://api.admin.buttnetworks.com/gateway", option);
        const res = await api.json();
        const value = res;
        if (value.auth) {
          return localStorage.removeItem("userEmail");
        } else {
          navigate("/login/email", { state: { msg } });
          return localStorage.removeItem("userEmail");
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkEmailAuth();
  }, [navigate]);
  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    setIsDark(newTheme === "dark");
  };

  const onSubmit = async (data) => {
    if (!captcha) {
      return setCaptchaErr(true);
    }

    clearErrors("formError");
    const body = {
      password: data.password,
      email:locationEmail,
      id: locationToken,
      captchaToken: captchaToken,
      type: "password/auth",
    };
    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    try {
      const api = await fetch("https://api.admin.buttnetworks.com/gateway", option);
      const res = await api.json();
      const value = res;
      const { auth, msg, expire } = value;
      if (auth) {
        setEmail("");
        setErrorMessage("");
        navigate("/admin/contact"); 
      } else if (!auth && expire) {
        setErrorMessage(msg, "...");
        setEmail("");
        setTimeout(() => {
          navigate("/login/email", { state: { msg } });
        }, 1000);
      } else {
        setEmail("");
        console.log(res);
      }
      console.log("Server says:", res);
    } catch (err) {
      setEmail("");
      console.error("❌ Something went wrong", err);
      setErrorMessage("Server error. Please try again.");
    }
  };
  const handleVerify = (token) => {
    setCaptcha(true);
    setCaptchaToken(token);
  };
  const adminForgot = () => {
    setMessage("Conact the developer of this site to reset your password");
  };
  return (
    <div>
      <div>
        <p id="forgot-text">{message}</p>
      </div>
      <button onClick={toggleTheme} className="theme-toggle-btn">
        <FontAwesomeIcon
          icon={isDark ? faSun : faMoon}
          className={isDark ? "sun" : "moon"}
        />
      </button>

      <div className="container">
        <div className="contentWrapper">
          <img src={logo} alt="Security" className="logo" />
          <h3>Welcome</h3>
          <div className="userInfo">
            <i className="fa-regular fa-circle-user"></i>
            <p>{email ? email : "Loading..."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="password" className="dataLabel error-space">
            {errors.password && (
              <p className={errors.password ? "error-space" : ""}>
                {errors.password.message}
              </p>
            )}
            Password:
          </label>
          <input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
          />
          <div className="showPassWrapper">
            <input
              type="checkbox"
              id="showPass"
              onChange={(e) => setShow(e.target.checked)}
            />
            <label htmlFor="showPass">Show password</label>
          </div>
          <p className={errorMessage ? "inputErr" : "none"}>
            {errorMessage ? errorMessage : ""}
          </p>
          <div className="btnContainer">
            <button
              type="button"
              className="btn btnInverted forgot"
              onClick={adminForgot}
            >
              Forgot password
            </button>
            <button type="submit" className="btn" disabled={isSubmitting}>
              Next
            </button>
          </div>
          <div class="captcha-wrapper">
            <sub className={captchaErr ? "captchaErr" : "none"}>
              {captcha ? "" : "Solve the captcha first"}
            </sub>
            <HCaptcha
              sitekey="5372261c-a6a6-4d6c-8008-9d70cafe8f88" // Get it from hCaptcha dashboard
              theme={isDark ? "dark" : "light"}
              onVerify={handleVerify}
              ref={captchaRef}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPassword;
