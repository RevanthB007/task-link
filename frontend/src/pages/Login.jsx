// Login component with both options
import { useAuth } from "../store/auth.store";
import { Link } from "react-router-dom";
export const Login = () => {
  const { signInWithGoogle,handleEmailSignIn } = useAuth();
  return (
    <div className="login-container">
      <h2>Sign In</h2>
      
      {/* Google Sign-In Button */}
      <button 
        onClick={signInWithGoogle}
        className="google-signin-btn"
      >
        Continue with Google
      </button>
      
      <div className="divider">— OR —</div>
      
      {/* Email/Password Form */}
      <form onSubmit={handleEmailSignIn}>
        <input 
          type="email" 
          placeholder="Email"
          // ... email input logic
        />
        <input 
          type="password" 
          placeholder="Password"
          // ... password input logic
        />
        <button type="submit">Sign In with Email</button>
      </form>
      
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}