import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import UserLogin from "../Components/Login/UserLogin"
import Registration from "../Components/Login/Registration"
import UserPortal from "../Components/UserPortal/UserPortal"
import AdminPortal from "../Components/AdminPortal/AdminPortal"
import ProtectedRoute from "./ProtectedRoute"
import ProtectedLoginRoute from "./ProtectedLoginRoute"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <ProtectedLoginRoute>
                        <UserLogin />
                    </ProtectedLoginRoute>
                } />
                <Route path="/register" element={<Registration />} />
                <Route path="/user-portal/*" element={
                    <ProtectedRoute>
                        <UserPortal />
                    </ProtectedRoute>
                } />
                <Route path="/admin-portal/*" element={
                    <ProtectedRoute>
                        <AdminPortal />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    )
}
export default AppRoutes