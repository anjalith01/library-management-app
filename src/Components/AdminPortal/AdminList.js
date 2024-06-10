import { useEffect, useState } from "react"
import { NotificationContainer, NotificationManager } from "react-notifications"
import { NavLink, useNavigate } from "react-router-dom"
import Loader from "../Login/Loader"

const AdminList = () => {
    const [adminList, setAdminList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const navigate=useNavigate()
    const getAdminList = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("http://localhost:8000/admin-list", {
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
                setAdminList([...data.result])
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
                getAdminList()
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
        getAdminList()
    }, [])
    return (
        <>
            <NotificationContainer />
            {isLoading ? <Loader /> :
                <div className="container-fluid py-5">
                    <div className="float-right mb-3">
                        <NavLink to="/admin-portal/admin-list/add-admin">
                            <button className="action-button">+Add admin</button>
                        </NavLink>
                    </div>
                    <h3><span className="table-title">Admin List</span></h3>
                    {adminList.length != 0 ?
                        <div className="table-responsive"  style={{maxHeight:'400px',overflowY:'scroll'}}>
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
                                    {adminList.map((admin, index) => (
                                        <tr key={admin._id}>
                                            <th className="table-body" scope="row" >{index + 1}</th>
                                            <td className="table-body" >{admin.name}</td>
                                            <td className="table-body" >{admin.email}</td>
                                            <td className="table-body" >
                                                <NavLink to={'/admin-portal/admin-list/update-admin/' + admin._id}>
                                                    <button className="edit-button">Edit</button>
                                                </NavLink>
                                                <button className="delete-button"
                                                    data-bs-toggle="modal" data-bs-target="#deleteModal"
                                                    onClick={() => setDeleteId(admin._id)}
                                                >Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        : ''}
                </div>
            }
            <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Delete Modal</h5>
                        </div>
                        <div className="modal-body">
                            Do you really want to delete thi admin ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" data-bs-dismiss="modal"
                                onClick={() => deleteUser()}
                                className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AdminList