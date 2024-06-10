import { useState } from "react"
import "../../Styles/forms.css"
import { Link, useNavigate } from "react-router-dom"
import logo from '../../Assets/app-logo.jpg'
import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "./Loader"
const UserLogin = () => {
    const [formFields, setFormFields] = useState({
        email: '',
        pass: '',
    })

    const [emailErr, setEmailErr] = useState('')
    const [passErr, setPassErr] = useState('')
    const [isLoading,setIsLoading]=useState(false)
const navigate=useNavigate()
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

        return true
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const isValid = validate()
        console.log(isValid)
        console.log(formFields)
        if(isValid){
            try{
                setIsLoading(true)
                const data=await fetch("http://localhost:8000/login",{
                    method:'POST',
                    body:JSON.stringify({email:formFields.email,pass:formFields.pass}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                })
                const result= await data.json()
                console.log(result)
                if(result.msg==="user logged in successfully"){
                    if(result.user.isAdmin){
                        navigate('/admin-portal/dashboard')
                    }
                    else{
                        navigate('/user-portal/home')
                    }
                   
                   localStorage.setItem("user_mgmt",JSON.stringify(result))
                }
                else if(result.msg==="user not found"){
                    await NotificationManager.error("","User not found!",3000)
                }
                else{
                    
                }
                setIsLoading(false)
            }
            catch(e){
                console.log(e.message)
                setIsLoading(false)
            }
        }
    }

    return (
        <>
        <NotificationContainer/>
        <div style={{ display: 'flex', justifyContent: 'center' }}>

            <form onSubmit={handleSubmit}>
                <div style={{marginTop:"30px"}}>
                    <img src={logo} alt="" width="70px" height="70px" />
                </div>
               
                <div className="form-box" >
                <div style={{ color: '#007429',paddingBottom:"15px",fontWeight:700,fontSize:"20px" }}>Sign In</div>

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
                
                    <div style={{ textAlign: 'center' }}>
                        <button className="submit-button" type="submit">{
                            isLoading?<Loader/>:"Login"
                        }</button>
                    </div>
                </div>
                <div>
                    <h5 style={{ color: '#007429',fontSize:'12px',marginTop:'20px'}}>Already have an account? <Link>Sign Up</Link></h5>
                </div>
            </form>
        </div>
        </>
    )
}
export default UserLogin