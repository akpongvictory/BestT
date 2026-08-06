import { useForm } from "react-hook-form";
import { registerUser } from "../services/auth";

export default function Register() {

    const {
        register,
        handleSubmit
    } = useForm();

    async function onSubmit(data:any){

        try{

            await registerUser(data);

            alert("Registration successful");

        }catch(err){

            alert("Registration failed");

        }

    }

    return (

        <div>

            <h1>Create Account</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <input
                    placeholder="Name"
                    {...register("name")}
                />

                <input
                    placeholder="Email"
                    {...register("email")}
                />

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />

                <button>Create Account</button>

            </form>

        </div>

    );

}