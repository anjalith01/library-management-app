import { useState } from "react"
import "../../Styles/forms.css"
import { Link, json } from "react-router-dom"
import logo from '../../Assets/app-logo.jpg'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Loader from "./Loader";
const Registration = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        pass: '',
        confirmPass: '',
    })

    const [nameErr, setNameErr] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [passErr, setPassErr] = useState('')
    const [confirmPassErr, setConfirmPassErr] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validateEmail = () => {
        return String(formFields.email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    const handleChange = (e) => {
        const obj = { ...formFields, [e.target.name]: e.target.value }
        setFormFields(obj)
    }

    const validate = () => {
        console.log(formFields.pass < 6)
        if (!formFields.name) {
            setNameErr("Name is required")
            return false
        }
        else {
            setNameErr('')
        }
        if (!formFields.email) {
            setEmailErr("Email is required")
            return false
        }
        else {
            setEmailErr('')
        }
        if (!validateEmail()) {
            setEmailErr("Invalid email address")
            return false
        }
        else {
            setEmailErr('')
        }
        if (!formFields.pass) {
            setPassErr("Password is required")
            return false
        }
        else {
            setPassErr('')
        }

        if (formFields.pass.length < 6) {
            console.log('bbbbb')
            setPassErr("Password length must be greater than 5")
            return false
        }
        else {
            setPassErr('')
        }

        if (formFields.confirmPass != formFields.pass) {
            setConfirmPassErr("Password and confirm password must be same")
            return false
        }
        else {
            setConfirmPassErr('')
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const isValid = validate()
        console.log(isValid)
        console.log(formFields)
        if (isValid) {
            try {
                setIsLoading(true)
                const data = await fetch("http://localhost:8000/register", {
                    method: 'POST',
                    body: JSON.stringify({...formFields,isAdmin:false}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const result = await data.json()
                console.log(result)
                if (result.msg === "User registered successfully") {
                    await NotificationManager.success("", "User registered successfully!", 3000)
                }
                else if (result.message === "user found with this mail Id") {
                    await NotificationManager.warning("", "Email Id is already exists!", 3000)
                }
                else {

                }
                setIsLoading(false)
            }
            catch (e) {
                console.log(e.message)
                setIsLoading(false)
            }
        }

    }

    return (
        <>
            <NotificationContainer />

            <div style={{ display: 'flex', justifyContent: 'center' }}>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginTop: "30px" }}>
                        <img src={logo} alt="" width="70px" height="70px" />
                    </div>
                   
                    <div className="form-box" >
                    <div style={{ color: '#007429', paddingBottom: "15px", fontWeight: 700, fontSize: "20px" }}>Sign Up</div>

                        <div className="form-group">
                            <div className="label">Name</div>
                            <input className="input-field" value={formFields.name} name="name" onChange={(e) => handleChange(e)} />
                            <div className="error-field">{nameErr}</div>
                        </div>
                        <div className="form-group">
                            <div className="label">Email</div>
                            <input className="input-field" value={formFields.email} name="email" onChange={(e) => handleChange(e)} />
                            <div className="error-field">{emailErr}</div>
                        </div>
                        <div className="form-group">
                            <div className="label">Password</div>
                            <input className="input-field" type="password" value={formFields.pass} name="pass" onChange={(e) => handleChange(e)} />
                            <div className="error-field">{passErr}</div>
                        </div>
                        <div className="form-group">
                            <div className="label">Confirm Password</div>
                            <input className="input-field" type="password" value={formFields.confirmPass} name="confirmPass" onChange={(e) => handleChange(e)} />
                            <div className="error-field">{confirmPassErr}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button className="submit-button" type="submit">{
                                isLoading ? <Loader /> : "Register"
                            }</button>
                        </div>
                    </div>
                    <div>
                        <h5 style={{ color: '#4C4C4C', fontSize: '12px',marginTop:'10px' }}>Already have an account? <Link to={'/'}>Sign In</Link></h5>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Registration