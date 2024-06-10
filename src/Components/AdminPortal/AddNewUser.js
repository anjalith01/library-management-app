import { useState } from "react"
import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "../Login/Loader"
import { useNavigate } from "react-router-dom"

const AddNewUser = () => {
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        pass: '',
        confirmPass: '',
    })
const navigate=useNavigate()
    const [nameErr, setNameErr] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [passErr, setPassErr] = useState('')
    const [confirmPassErr, setConfirmPassErr] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const handleChange = (e) => {
        const obj = { ...formFields, [e.target.name]: e.target.value }
        setFormFields(obj)
    }

    const validateEmail = () => {
        return String(formFields.email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

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
        if (isValid) {
            console.log(formFields)
            try {
                setIsLoading(true)
                const res = await fetch("http://localhost:8000/add-user", {
                    method: 'POST',
                    body: JSON.stringify({...formFields,isAdmin:false}),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                    }
                })
                const data = await res.json()
                console.log(data)
                if (res.ok) {
                    await NotificationManager.success("", "User registered successfully!", 3000)
                    setFormFields({
                        name: '',
                        email: '',
                        pass: '',
                        confirmPass: '',
                    })
                    navigate('/admin-portal/user-list')
                }

                else {
                    await NotificationManager.error("", data.msg, 3000)
                    if(data.msg==='Please enter valid token'){
                        localStorage.removeItem('user_mgmt')
                        navigate('/')
                       }
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
            <div className="container-fluid mt-5 px-4">
                <div className="mb-3">
                    <h3><span className="table-title">Add new user</span></h3>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '0 0em' }}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="name" >Name</label>
                                    <input style={{backgroundColor:'#EEF1F3'}} type="text" value={formFields.name} onChange={handleChange} className="form-control" name="name" id="name" placeholder="Enter name" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{nameErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="email" >Email</label>
                                    <input style={{backgroundColor:'#EEF1F3'}} type="text" value={formFields.email} onChange={handleChange} className="form-control" id="email" name="email" placeholder="Enter email" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{emailErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="password" >Password</label>
                                    <input style={{backgroundColor:'#EEF1F3'}} type="password" value={formFields.pass} onChange={handleChange} className="form-control" id="password" name="pass" placeholder="Enter password" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{passErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="conf_password" >Confirm password</label>
                                    <input style={{backgroundColor:'#EEF1F3'}} type="password" value={formFields.confirmPass} onChange={handleChange} className="form-control" id="conf_password" name="confirmPass" placeholder="Enter conf_password" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{confirmPassErr}</div>
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="action-button">{isLoading?<Loader/>:"Add user"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
export default AddNewUser