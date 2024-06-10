import { useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "../Login/Loader";

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user_mgmt')).user
    const [count, setCount] = useState({
        bookCount: '',
        userCount: '',
        adminCount: '',
        limitOfBookPerUser: ''
    })
    const [isLoading,setIsLoading]=useState(false)
    const navigate=useNavigate()
    const getDashboardCount = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`http://localhost:8000/dashboard-count`,
                {
                    method: "POST",
                    body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                    }
                }
            )
            const data = await res.json()
            console.log(data)
            if (res.ok) {
                setCount({ ...count, bookCount: data.bookCount, userCount: data.userCount, adminCount: data.adminCount, limitOfBookPerUser: data.limitOfBookPerUser })
            }
            else{
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
    useEffect(() => {
        getDashboardCount()
    }, [])
    return (
        <div>
            <NotificationContainer/>
            <div className="container-fluid mt-5">
                <div className="row dashboard-content">
                    <div className="col-md-12 mb-3">
                        <div className="card bg-light mb-3" >
                            <div className="card-header">
                                <span style={{color:"#007429",fontWeight:700,fontSize:"26px"}}>Welocome!</span>
                                {/* <button className="btn btn-info my-2 my-sm-0 float-right"
                data-toggle="modal" data-target="#exampleModalCenter"
                >Change password</button> */}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title" style={{color:"#007429",fontSize:"16px"}} >{user.name}</h5>
                                <p className="card-text" style={{color:"#007429",fontSize:"16px"}}>{user.email}</p>
                            </div>
                        </div>
                    </div>
                    {isLoading?<div style={{ textAlign: 'center' }}><Loader /></div> :<>
                    <div className="col-md-6">

                        <div className="card text-white mb-3" style={{backgroundColor:'#007429'}} >
                            <div className="card-header">Books</div>
                            <div className="card-body">
                                <h5 className="card-title">No of book's :- {count.bookCount}</h5>
                                <p className="card-text" >This is the best place where you can find rare books.</p>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6">

                        <div className="card text-white mb-3" style={{backgroundColor:'#007429'}}>
                            <div className="card-header">User</div>
                            <div className="card-body">
                                <h5 className="card-title">No of user's :- {count.userCount}</h5>
                                <p className="card-text" >This place offers the best user experience.</p>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6">

                        <div className="card text-white mb-3" style={{backgroundColor:'#007429'}}>
                            <div className="card-header" >Bookes per user</div>
                            <div className="card-body">
                                <h5 className="card-title" >Number of books per person/user :- {count.limitOfBookPerUser}</h5>
                                <NavLink to="/admin-portal/books-per-user" style={{ color: "white" }}>
                                    <span >Click here to update !!</span>
                                </NavLink>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-6">

                        <div className="card text-white mb-3" style={{backgroundColor:'#007429'}}>
                            <div className="card-header" >Admin</div>
                            <div className="card-body">
                                <h5 className="card-title" >No of admin's :- {count.adminCount}</h5>
                                <p className="card-text" >This place offers the best ways to manage the system.</p>
                            </div>
                        </div>

                    </div>
                    </>}
                </div>
            </div>
        </div>
    )
}
export default AdminDashboard;