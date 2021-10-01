import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../components/AppStateProvider';
import DefaultLayout from '../../components/Layout/DefaultLayout';

//import styles
import './style.css';

//import icon
//import show from '../../resources/icons/Show.svg';

//import social-media icons
import google from '../../resources/icons/google.svg';
import facebook from '../../resources/icons/facebook.svg';
import linkedin from '../../resources/icons/linkedin.svg';

export default function Signup() {

    const { register, handleSubmit } = useForm(
        { reValidateMode: 'onSubmit' })

    const history = useHistory();
    const context = useContext(AppContext);

    const validatePassword = (data) => {
        if (!(/[A-Z].*/g).test(data)) {
            toast.warning("Password should contain an uppercase character");
            return false;
        }
        if (!(/[a-z].*/g).test(data)) {
            toast.warning("Password should contain a lowercase character");
            return false;
        }
        if (!(/[@#$%^&!].*/g).test(data)) {
            toast.warning("Password should contain a special character(@#$%^&!)");
            return false;
        }
        if (!(/[0-9].*/g).test(data)) {
            toast.warning("Password should contain a digit");
            return false;
        }
        // if (!(/.[8,]/).test(data)) {
        //     toast.warning("Password should be 8 characters long or more...");
        //     return false;
        // }

        //return (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&!]{8,}$/).test(data)
    };

    const registerUser = ({ email, password, confirmPassword, role }) => {

        if (!email) {
            // console.log("Error");
            return toast.error("Please provide an email");
        }
        if (!password) {
            return toast.error("Please provide a password");
        }
        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }
        if (!role) {
            return toast.error("Select your action from the dropdown");
        }

        //create a new user object and post to the provided API
        const newUser = {
            email: email,
            password: password,
            ConfirmPassword: confirmPassword,
            typeofuser: role
        };

        // console.log(newUser);
        axios.post('https://techpowtechsters-001-site1.itempurl.com/api/v1/Auth/Register',
            newUser)
            .then(result => {
                console.log(result);
                if (result.data.success) {
                    toast.success(result.data.message);
                    context.dispatch({
                        type: 'REGISTER',
                        payload: {
                            userId: result.data.data.id,
                            userEmail: result.data.data.email,
                            userRole: result.data.data.typeofuser,
                        },
                    })
                    const newEmail = {
                        toEmail: newUser.email,
                        subject: "TechPow Registration Notification",
                        body: "Dear " + newUser.email + ". Thank you for completing your registration on TechPow. Please click on the link to login and complete your application. https://techpowtechsters-001-site1.itempurl.com/Login"
                    }
                    //Calling api for email
                    axios.post('https://techpowtechsters-001-site1.itempurl.com/api/v1/Email/SendEmail',
                        newEmail)
                        .then(result => {
                            console.log(result);
                            if (result.status === 200) {
                                return true;
                            }
                            return false;
                        }
                        );
                    history.push('/EmailVerification');
                    return true;
                }
                for (let index = 0; index < result.data.errors.length; index++) {
                    toast.error(result.data.errors[index]);
                }
            })
            .catch(error => {
                console.log(error.response.data.errors);
                for (let index = 0; index < error.response.data.errors.length; index++) {
                    toast.error(error.response.data.errors[index]);
                }
            })


    };


    return (
        <DefaultLayout>
            <div className="bg-pattern">
                <div className="container signup-page">
                    <div className="form-container">
                        <h2 className="form-head">Sign up</h2>
                        <div className="sm-signup">
                            <div className="sm-signup-icon">
                                <img src={google} alt="google-icon" className="xms-icon" /><span>with Google</span>
                            </div>
                            <div className="sm-signup-icon">
                                <img src={facebook} alt="facebook-icon" className="xms-icon" /><span>with Facebook</span>
                            </div>
                            <div className="sm-signup-icon">
                                <img src={linkedin} alt="linkedin-icon" className="xms-icon" /><span>with Linkedin</span>
                            </div>
                        </div>

                        <div className="form-mid-div"><strong>OR</strong></div>

                        <div className="col-md-4">
                            <form id="form-group" onSubmit={handleSubmit(registerUser)}>
                                <div className="form-group">
                                    <label asp-for="Email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        required
                                        {...register('email', { required: true }
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label asp-for="Password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        required
                                        {...register('password', {
                                            required: true, validate: validatePassword
                                        }
                                        )}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="ConfirmPassword"
                                        className="form-control"
                                        required
                                        {...register('confirmPassword', { required: true }
                                        )}
                                    />
                                    {/* <img src={show} alt="" className="sm-icon show-icon" /> */}
                                </div>
                                <div className="drop-down">
                                    <label>Apply as:</label>
                                    <select name="role" id="role" {...register('role', { required: true })}>
                                        <option value="Donor">Donor</option>
                                        <option value="Donee">Donee</option>
                                    </select>
                                </div>
                                <div className="terms">
                                    <input type="checkbox"
                                        required
                                        name="terms-and-conditions" id="checkbox" className="signup-check"
                                        {...register('terms-and-conditions', { required: true })} />
                                    <p>By signing up, you agree to the <strong className="bold-text"><a href="/TermsOfService" className="bold-text">Terms of Service </a></strong>and <strong className="bold-text"><a href="/PrivacyPolicy" className="bold-text">Privacy Policy</a></strong>.</p>
                                </div>
                                <div className="last-flex">
                                    <button type="submit" className="btn btn-primary">Create Account</button>
                                    <p>Already have an account? <a className="green" href="/Login">Log in</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

