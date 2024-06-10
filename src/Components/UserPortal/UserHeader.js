import { Link, NavLink, useNavigate } from "react-router-dom"
import "../../Styles/header.css"
import logo from "../../Assets/app-logo.jpg"
const UserHeader = () => {
    const navigate = useNavigate()
    const handleLogout=()=>{
        localStorage.removeItem('user_mgmt')
        navigate('/')
    }
    return (
        <div >
            <nav className="navbar navbar-expand-lg navbar-light" style={{padding:'10px 15px',backgroundColor:'#E8EAEC'}}>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" ><img src={logo} width="40px" height="40px"></img></a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <NavLink to="/user-portal/home" className="nav-link" activeClassName="active" style={{color:'#007429'}}>
                            <span >
                                Home
                            </span>
                        </NavLink>
                        <NavLink to="/user-portal/book-list" className="nav-link" activeClassName="active" style={{color:'#007429'}}>
                            <span >All book list</span>
                        </NavLink>
                        <NavLink to="/user-portal/user-book-list" className="nav-link" activeClassName="active" style={{color:'#007429'}}>
                            <span >User book list</span>
                        </NavLink>
                    </ul>
                </div>
                <div className="form-inline">
                    <button type="button" className="logout-button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenter" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">

                        <div className="modal-body">
                            Do you really want to logout?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

                            <button type="button" data-bs-dismiss="modal"
                                className="btn btn-danger" onClick={handleLogout}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserHeader