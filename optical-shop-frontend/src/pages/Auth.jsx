import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../components/context/AuthContext";
import { signup, login } from "../components/services/authService";

const AnimatedBackground = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
            @keyframes animateShapes {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                    border-radius: 0;
                }
                100% {
                    transform: translateY(-1000px) rotate(720deg);
                    opacity: 0;
                    border-radius: 50%;
                }
            }
        `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const shapes = Array.from({ length: 10 });
  const circleBaseStyle = {
    position: "absolute",
    display: "block",
    listStyle: "none",
    width: "20px",
    height: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    animation: "animateShapes 25s linear infinite",
    bottom: "-150px",
  };

  return (
    <div style={styles.area}>
      <ul style={styles.circles}>
        {shapes.map((_, i) => (
          <li
            key={i}
            style={{
              ...circleBaseStyle,
              left: `${Math.random() * 90}%`,
              width: `${Math.random() * 120 + 20}px`,
              height: `${Math.random() * 120 + 20}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 18 + 12}s`,
            }}
          ></li>
        ))}
      </ul>
    </div>
  );
};

const Auth = () => {
  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginAction } = useAuth();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || (authMode === "signup" && !name)) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (authMode === "login") {
        response = await login({ email, password });
        toast.success("Logged in successfully!");
      } else {
        response = await signup({ name, email, password });
        toast.success("Account created successfully!");
      }
      loginAction(response);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email to continue.");
      return;
    }
    console.log(`Sending OTP to ${email}`);
    toast.info(`An OTP has been sent to ${email}`);
    setAuthMode("verifyOtp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter a valid OTP.");
      return;
    }
    console.log(`Verifying OTP ${otp}`);
    toast.success("OTP verified successfully!");
    setAuthMode("resetPassword");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    console.log("Resetting password...");
    toast.success("Password has been reset successfully! Please login.");
    setAuthMode("login");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
  };

  const renderForm = () => {
    switch (authMode) {
      case "forgotPassword":
        return (
          <>
            <h2 style={styles.title}>Forgot Password</h2>
            <p style={styles.subtitle}>Enter your email to receive an OTP</p>
            <form onSubmit={handleForgotPassword} style={styles.form}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
            <p style={styles.toggleText}>
              Remembered your password?{" "}
              <span
                onClick={() => setAuthMode("login")}
                style={styles.toggleLink}
              >
                Login
              </span>
            </p>
          </>
        );
      case "verifyOtp":
        return (
          <>
            <h2 style={styles.title}>Verify OTP</h2>
            <p style={styles.subtitle}>
              Check your email for the One-Time Password
            </p>
            <form onSubmit={handleVerifyOtp} style={styles.form}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
            <p style={styles.toggleText}>
              Didn't receive code?{" "}
              <span
                onClick={() => setAuthMode("forgotPassword")}
                style={styles.toggleLink}
              >
                Resend
              </span>
            </p>
          </>
        );
      case "resetPassword":
        return (
          <>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Create a new strong password</p>
            <form onSubmit={handleResetPassword} style={styles.form}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        );
      default:
        const isLogin = authMode === "login";
        return (
          <>
            <h2 style={styles.title}>
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>
            <p style={styles.subtitle}>
              {isLogin ? "Login to continue" : "Sign up to get started"}
            </p>
            <form onSubmit={handleAuthSubmit} style={styles.form}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              {isLogin && (
                <p
                  style={{
                    ...styles.toggleText,
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  <span
                    onClick={() => setAuthMode("forgotPassword")}
                    style={styles.toggleLink}
                  >
                    Forgot Password?
                  </span>
                </p>
              )}

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <p style={styles.toggleText}>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                onClick={() => setAuthMode(isLogin ? "signup" : "login")}
                style={styles.toggleLink}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      <AnimatedBackground />
      <div style={styles.authCard}>{renderForm()}</div>
    </div>
  );
};

const styles = {
  area: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  circles: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  authCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(15px)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    width: "400px",
    textAlign: "center",
    zIndex: 1,
    transition: "all 0.3s ease-in-out",
  },
  title: {
    color: "#fff",
    fontSize: "2.5rem",
    marginBottom: "10px",
    fontWeight: "bold",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: "30px",
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#fff",
    color: "#667eea",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  toggleText: {
    marginTop: "20px",
    color: "rgba(255, 255, 255, 0.85)",
  },
  toggleLink: {
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Auth;
