import { useForm } from "react-hook-form";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
async function onSubmit(data: any) {
  try {
    const response = await loginUser(data);

    // Save authentication information
    login(response.token, response.data);

    // Optional: also save token in localStorage
    localStorage.setItem("bestt_token", response.token);

    alert("Logged in");

    navigate("/dashboard");
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    console.error("RESPONSE:", error.response);
    
    alert(
      error.response?.data?.message ||
      error.message ||
      "Login failed"
    );
  }
}
  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Email"
          {...register("email")}
        />

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}