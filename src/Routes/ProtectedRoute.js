import { Navigate, useLocation, useNavigate } from "react-router-dom"

const ProtectedRoute=({children})=>{
    const user=localStorage.getItem('user_mgmt')?JSON.parse(localStorage.getItem('user_mgmt')).user:null
    let location = useLocation();
    if(!user){
            return <Navigate to="/" state={{ from: location}} replace />
        }
    
   return children
}
export default ProtectedRoute