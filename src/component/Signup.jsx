import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from "formik";
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';



const baseUrl = "https://chat-backend-4uuv.onrender.com"
// const baseUrl = "http://localhost:3002"

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const navigate = useNavigate()
    const validationSchema = yup.object({
        username: yup.string().required("Username is required"),
        email: yup.string().email('Invalid email format').required("Email is required"),
        password: yup.string()
        .required('Password is required').matches(/[a-z]/, 'Must include lowercase')
        .matches(/[A-Z]/, 'Must include uppercase')
        .matches(/[0-9]/, 'Must include at least number').min(8, 'Must include least 8 characters').max(15, 'Password is too long')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include special character')
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
           
            try {
                const res = await axios.post(`${baseUrl}/user/signup`, values);
                console.log(res);
                setLoading(false);
                toast.success("Sign up Successful!");
                navigate('/signin');
            } catch (err) {
                console.log(err);
                setLoading(false);
            
                if (err.response) {
                    const { status, data } = err.response;
                    if (status === 409) {
                        setError(data.message || 'Duplicate user found' || 'username already in use');
                        toast.error(data.message || 'Duplicate user found' || 'username already in use');
                    } else if (status === 400) {
                        setError(data.message || 'Please fill in all fields correctly');
                        toast.error(data.message || 'Please fill in all fields correctly');
                    } else {
                        setError("An unexpected error occurred");
                        toast.error("An unexpected error occurred");
                    }
                } else {
                    setError("Server is not responding");
                    toast.error("Server is not responding");
                }
            }
            
        }
    });

    return (
        <div className="min-h-screen flex p-9 items-center justify-center bg-green-700">
            <div className="bg-white p-8 text-gray-800 rounded-lg shadow-md w-full max-w-sm">
                setTimeout(() ={
                    
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                }, 2000);
                {error && <p className="text-red-800 text-center mb-4">{error}</p>}
                <div>Already had an account? <span className='text-pink-600 font-bold'><Link to='/signin'>Signin now</Link></span></div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="h-[80px] my-3">
                        <label htmlFor="username" className="font-semibold my-1 capitalize">Username</label><br />
                        <input
                            type="text"
                            placeholder="Jane"
                            className="px-4 py-2 w-full border-2 mt-1 border-gray-800  rounded-2xl"
                            name="username"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <span className="text-red-500 my-1">{formik.errors.username}</span>
                        )}
                    </div>
                    <div className="h-[80px] my-3">
                        <label htmlFor="email" className="font-semibold my-1">Email</label><br />
                        <input
                            type="email"
                            placeholder="jane@gmail.com"
                            className="px-4 py-2 w-full border-2 mt-1 border-gray-800  rounded-2xl"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <span className="text-red-500 my-1">{formik.errors.email}</span>
                        )}
                    </div>
                    <div className="h-[80px] relative my-3">
                        <label htmlFor="password" className="font-semibold">Password</label><br />
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            autoComplete="off"
                            className="border-2 mt-1 border-gray-800 py-2 px-4 w-full rounded-2xl"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <span className="text-red-500 my-1">{formik.errors.password}</span>
                        )}
                        <span onClick={togglePasswordVisibility} className="absolute top-[42px] right-5 cursor-pointer">
                            {!passwordVisible ? <IoEyeSharp /> : <BsEyeSlashFill />}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-green-700 hover:bg-green-500 transition ease-in duration-700 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? <ClipLoader size={20} color='#ffffff' /> : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
