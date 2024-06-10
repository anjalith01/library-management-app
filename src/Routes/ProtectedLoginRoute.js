import { Navigate, useLocation, useNavigate } from "react-router-dom"

const ProtectedLoginRoute = ({ children }) => {
    const user = localStorage.getItem('user_mgmt') ? JSON.parse(localStorage.getItem('user_mgmt')).user : null
    let location = useLocation();
    if (user) {
        if (user.isAdmin) {
            return <Navigate to="/admin-portal/dashboard" state={{ from: location }} replace />
        }
        else {
            return <Navigate to="/user-portal/home" state={{ from: location }} replace />

        }
    }

    return children
}
export default ProtectedLoginRoute