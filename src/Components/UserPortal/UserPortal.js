import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Home from "./Home"
import UserAllBooksList from "./UserAllBooksList"
import UserIssuedbook from "./UserIssuedBook"
import UserHeader from "./UserHeader"


const UserPortal=()=>{
    return(
        <div>
           <UserHeader/>
         
        <Routes>
            <Route exact path="/home" element={<Home/>}/>
            <Route path="/book-list" element={<UserAllBooksList/>}/>
            <Route path="/user-book-list" element={<UserIssuedbook/>}/>
        </Routes>
   
        </div>
    )
}
export default UserPortal