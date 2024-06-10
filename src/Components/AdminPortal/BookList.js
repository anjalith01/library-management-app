import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import Loader from '../Login/Loader'
import { NotificationContainer, NotificationManager } from "react-notifications"
import '../../Styles/header.css'
import '../../Styles/table.css'
const BookList = () => {
    const [bookList,setBookList]=useState([])
    const [isLoading,setIsLoading]=useState(false)
    const [deleteId,setDeleteId]=useState('')
    const navigate=useNavigate()
    const getBookList = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("http://localhost:8000/book-list", {
                method:'POST',
                body:JSON.stringify({id:JSON.parse(localStorage.getItem('user_mgmt')).user._id}),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                }
            })
            const data = await res.json()
            console.log(data)
            if(res.ok && data.result){
                setBookList([...data.result])
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
    useEffect(() => {
        
        getBookList()
    }, [])

    const deleteBook=async()=>{
        try{
            setIsLoading(true)
            const res = await fetch(`http://localhost:8000/delete-book/${deleteId}`, {
                method:'POST',
                body:JSON.stringify({_id:JSON.parse(localStorage.getItem('user_mgmt')).user._id}),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                }
            })
            const data = await res.json()
            console.log(data)
            if(res.ok){
                getBookList()
                await NotificationManager.success("", data.msg, 3000)
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
        catch(e){
            console.log(e.message)
            setIsLoading(false)
        }
    }
    return (
        <>
        <NotificationContainer/>
        <div>
            <div className="container-fluid" style={{paddingTop:30}}>
                <div className="float-right mb-1">
                    <NavLink to="/admin-portal/book-list/add-book">
                        <button className="action-button">+Add book</button>
                    </NavLink>
                </div>
                <h3><span className="badge badge-info p-2">Book List</span></h3>
            </div>

            {!isLoading?<div className="table-responsive" style={{maxHeight:'400px',overflowY:'scroll'}}>
                <table className="table table-bordered table-hover bg-light" >
                    <thead className="bg-light">
                        <tr>
                            <th className="table-header" scope="col">#</th>
                            <th className="table-header" scope="col">Title</th>
                            <th className="table-header" scope="col">Author</th>
                            <th className="table-header" scope="col">Quantity</th>
                            <th className="table-header" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {bookList.length>0 && bookList.map((book, index) => (
                        <tr key={book._id}>
                            <th  className="table-body" scope="row" >{index+1}</th>
                            <td className="table-body">{book.title}</td>
                            <td className="table-body">{book.author}</td>
                            <td className="table-body">{book.stock}</td>
                            <td className="table-body">
                                <NavLink to={`/admin-portal/book-list/update-book/${book._id}`}>
                                    <button className="edit-button">Edit</button>
                                </NavLink>
                                <button className="delete-button"
                                   data-bs-toggle="modal" data-bs-target="#deleteModal"
                                  onClick={()=>setDeleteId(book._id)}
                                >Delete</button>
                            </td>
                        </tr>
                         ))}
                    </tbody>
                </table>
            </div>
:
<div style={{textAlign:'center'}}>
<Loader/>
</div>}
<div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Delete Modal</h5>
                        {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close"> 
                        <span aria-hidden="true">&times;</span>
                        </button>*/}
                    </div>
                    <div className="modal-body">
                        Do you really want to delete this book ?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" data-bs-dismiss="modal" onClick={deleteBook}
                        className="btn btn-danger">Delete</button>
                    </div>
                    </div>
                </div>
                </div>
        </div>
        </>
    )
}
export default BookList