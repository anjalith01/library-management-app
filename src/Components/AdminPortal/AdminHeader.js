import { NotificationContainer } from "react-notifications";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../Assets/app-logo.jpg'

const AdminHeader = () => {
    const navigate=useNavigate()
    const handleLogout=()=>{
        localStorage.removeItem('user_mgmt')
        navigate('/')
    }
    return (
        <>
            <NotificationContainer />
            <nav className="navbar navbar-expand-lg navbar-light" style={{padding:'10px 15px',backgroundColor:'#E8EAEC'}}>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" ><img src={logo} width="40px" height="40px"></img></a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <NavLink to="/admin-portal/dashboard" style={{color:'007429'}} className="nav-link" activeClassName="activeClassName">
                            <span >
                                Dashboard
                            </span>
                        </NavLink>
                        <NavLink to="/admin-portal/book-list" style={{color:'007429'}}  className="nav-link" activeClassName="active">
                            <span >Manage books</span>
                        </NavLink>
                        <NavLink to="/admin-portal/user-list" style={{color:'007429'}}  className="nav-link" activeClassName="active">
                            <span >Manage user</span>
                        </NavLink>
                        <NavLink to="/admin-portal/books-per-user" style={{color:'007429'}}  className="nav-link" activeClassName="active">
                            <span >Limit books per user</span>
                        </NavLink>
                        <NavLink to="/admin-portal/admin-list" style={{color:'007429'}}  className="nav-link" activeClassName="active">
                            <span >Manage admin</span>
                        </NavLink>
                    </ul>
                </div>
                <div className="form-inline">
                    <button className="logout-button"
                        data-bs-toggle="modal" data-bs-target="#exampleModalCenter"
                    >Logout</button>
                </div>
            </nav>

            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Logout Modal</h5>
                            {/* <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            Do you really want to logout
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" data-bs-dismiss="modal"
                                onClick={handleLogout}
                                className="btn btn-danger">Logout</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default AdminHeader;