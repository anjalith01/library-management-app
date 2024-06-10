import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "../Login/Loader"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"

const UpdateUser = () => {
    const params = useParams()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate=useNavigate()

    useEffect(() => {

        const getUser = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(`http://localhost:8000/user/${params.id}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                    }
                })
                const data = await res.json()
                console.log(data)
                if (res.ok && data.result) {
                    setName(data.result.name)
                    setEmail(data.result.email)
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
        getUser()
    }, [])

    const validateEmail = () => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            setNameError('Name is required')
            return false
        }
        if (!email) {
            setEmailError('Email is required')
            return false
        }
        else {
            if (!validateEmail()) {
                setEmailError('Email id is incorrect')
                return false
            }
        }
        console.log(email)
        try {
            const res = await fetch(`http://localhost:8000/update-user/${params.id}`, {
                method: 'POST',
                body: JSON.stringify({
                    _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id,
                    name: name,
                    email: email
                }),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                }
            })
            const data = await res.json()
            console.log(data)
            if (res.ok) {
                await NotificationManager.success("", data.msg, 3000)
                if(data.result.isAdmin){
                    navigate('/admin-portal/admin-list')
                }
                else{
                    navigate('/admin-portal/user-list')
                }
               
            }
            else {
                await NotificationManager.error("", data.msg, 3000)
                if(data.msg==='Please enter valid token'){
                    localStorage.removeItem('user_mgmt')
                    navigate('/')
                   }
            }
        }
        catch (e) {
            console.log(e.message)
        }
    }

    return (
        <>
            <NotificationContainer />
            {isLoading ? <Loader /> :
                <div className="container-fluid mt-5 px-4">
                    <div className="mb-3">
                        <h3 className="table-title"><span >Update user</span></h3>
                    </div>

                    <form onSubmit={handleSubmit} style={{ padding: '0 0em' }}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label className="label" htmlFor="name" >Name</label>
                                        <input type="text" style={{backgroundColor:'#EEF1F3'}} value={name} onChange={(e) => setName(e.target.value)} className="form-control" name="name" id="name" placeholder="Enter name" />
                                        <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{nameError}</div>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="label" htmlFor="email" >Email</label>
                                        <input type="email" style={{backgroundColor:'#EEF1F3'}} value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" name="email" placeholder="Enter email" />
                                        <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{emailError}</div>
                                    </div>
                                    <div className="col-md-12">
                                        <button type="submit" className="action-button">Update user</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </>
    )
}
export default UpdateUser