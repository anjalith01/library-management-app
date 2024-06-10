import { Route, Routes } from "react-router-dom"
import AdminDashboard from "./AdminDashboard"
import AdminHeader from "./AdminHeader"
import BookList from "./BookList"
import AddNewBook from "./AddNewBook"
import UpdateBook from "./UpdateBook"
import UserList from "./UserList"
import UpdateUser from "./UpdateUser"
import LimitOfBooks from "./LimitOfBooks"
import AdminList from "./AdminList"
import AddNewAdmin from "./AddNewAdmin"
import AddNewUser from "./AddNewUser"

const AdminPortal = () => {
    return (
        <div>
            <AdminHeader />
            <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path='/book-list' element={<BookList/>}/>
                <Route path="/book-list/add-book" exact element={<AddNewBook/>} /> 
                <Route path="/book-list/update-book/:id" exact element={<UpdateBook/>}/> 
                <Route path="/user-list" element={<UserList/>}/>
                <Route path="/user-list/add-user" element={<AddNewUser/>}/>
                <Route path="/user-list/update-user/:id" element={<UpdateUser/>}/>
                <Route path="/books-per-user" element={<LimitOfBooks/>}/>
                <Route path="/admin-list" element={<AdminList/>}/>
                <Route path='/admin-list/add-admin' element={<AddNewAdmin/>}/>
                <Route path="admin-list/update-admin/:id" element={<UpdateUser/>}/>
            </Routes>
        </div>
    )
}
export default AdminPortal