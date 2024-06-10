import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "../Login/Loader"
import { NavLink, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const UserList = () => {

    const [userList, setUserList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [isAddUser, setIsAddUser] = useState(true)
    const [finedUsers, setFinedUsers] = useState([])
    const navigate=useNavigate()
    const getUser = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("http://localhost:8000/user-list", {
                method: 'POST',
                body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                }
            })
            const data = await res.json()
            console.log(data)
            if (res.ok && data.result) {
                setUserList([...data.result])
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

    const getFinedUsers = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("http://localhost:8000/get-fined-users", {
                method: 'POST',
                body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                }
            })
            const data = await res.json()
            console.log(data)
            if (res.ok && data.fined_users) {
                setFinedUsers([...data.fined_users])
            }
            else{
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

    const deleteUser = async () => {
        try {
            const res = await fetch(`http://localhost:8000/delete/${deleteId}`,
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
                getUser()
                await NotificationManager.success("", data.msg, 3000)
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
            console.log(e)
        }
    }

    useEffect(() => {
        isAddUser ? getUser() : getFinedUsers()

    }, [isAddUser])

    const deleteFinedUser=async()=>{
        try {
            const res = await fetch(`http://localhost:8000/remove-fined-user/${deleteId}`,
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
                getFinedUsers()
                await NotificationManager.success("", data.msg, 3000)
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
            console.log(e)
        }
    }

    return (
        <>
            <NotificationContainer />
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li  class="breadcrumb-item" style={{color:isAddUser?'#005BFF':'#007429',cursor:'pointer'}} onClick={() => setIsAddUser(true)}>User list</li>
                    <li  class="breadcrumb-item" style={{color:!isAddUser?'#005BFF':'#007429',cursor:'pointer'}} onClick={() => setIsAddUser(false)}>Fined users</li>
                </ol>
            </nav>
            {
                isLoading ? <Loader /> :
                    isAddUser ? <div className="container-fluid py-5">
                        <div className="float-right mb-3">
                            <NavLink to="/admin-portal/user-list/add-user">
                                <button className="action-button">+Add user</button>
                            </NavLink>
                        </div>
                        <h3><span className="table-title">User List</span></h3>
                        {userList.length != 0 ?
                            <div className="table-responsive" style={{maxHeight:'400px',overflowY:'scroll'}}>
                                <table className="table table-bordered table-hover bg-light">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="table-header" scope="col">#</th>
                                            <th className="table-header" scope="col">Name</th>
                                            <th className="table-header" scope="col">Email</th>
                                            <th className="table-header" scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map((user, index) => (
                                            <tr>
                                                <th className="table-body" scope="row" >{index + 1}</th>
                                                <td className="table-body">{user.name}</td>
                                                <td className="table-body">{user.email}</td>
                                                <td className="table-body">
                                                    <NavLink to={'/admin-portal/user-list/update-user/' + user._id}>
                                                        <button className="edit-button">Edit</button>
                                                    </NavLink>
                                                    <button className="delete-button"
                                                        data-bs-toggle="modal" data-bs-target="#deleteModal"
                                                        onClick={() => setDeleteId(user._id)}
                                                    >Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            : ''}
                    </div>
                        :
                        <div className="container-fluid py-5">
                            <h3><span className="table-title">Fined User List</span></h3>
                            {finedUsers.length != 0 ?
                                <div className="table-responsive" style={{maxHeight:'400px',overflowY:'scroll'}}>
                                    <table className="table table-bordered table-hover bg-light">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="table-header" scope="col">#</th>
                                                <th className="table-header" scope="col">Name</th>
                                                <th className="table-header" scope="col">Email</th>
                                                <th className="table-header" scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {finedUsers.map((user, index) => (
                                                <tr>
                                                    <th className="table-body" scope="row" >{index + 1}</th>
                                                    <td className="table-body">{user.name}</td>
                                                    <td className="table-body">{user.email}</td>
                                                    <td className="table-body">
                                                        <button className="delete-button"
                                                            data-bs-toggle="modal" data-bs-target="#deleteModal"
                                                        onClick={() => setDeleteId(user._id)}
                                                        >Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                : 'No user found'}
                        </div>
            }




            <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Delete Modal</h5>
                        </div>
                        <div className="modal-body">
                            Do you really want to delete this user ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" data-bs-dismiss="modal"
                                onClick={() => isAddUser?deleteUser():deleteFinedUser()}
                                className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UserList