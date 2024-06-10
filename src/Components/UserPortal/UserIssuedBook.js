import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "../Login/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const UserIssuedbook = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [renewBookId, setRenewBookId] = useState('')
  const [returnBookId, setReturnBookId] = useState('')
  const navigate=useNavigate()
  const user = localStorage.getItem('book_mgmt') ? JSON.parse(localStorage.getItem('book_mgmt')).user : ''

  const getUserIssuedBook = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:8000/get-issued-book", {
        method: 'POST',
        body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
        }
      })
      const data = await res.json()
      console.log(data)
      if (res.ok && data.books) {
        setBooks([...data.books])
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
    getUserIssuedBook()
  }, [])

  const returnBook = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:8000/return-book/" + returnBookId, {
        method: 'POST',
        body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
        }
      })
      const data = await res.json()
      console.log(data)
      if (res.ok) {
        getUserIssuedBook()
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
    catch (e) {
      console.log(e.message)
      setIsLoading(false)
    }
  }
  const renewBook = async (book_id) => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:8000/renew-book/" + renewBookId, {
        method: 'POST',
        body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
        }
      })
      const data = await res.json()
      console.log(data)
      if (res.ok) {
        getUserIssuedBook()
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
    catch (e) {
      console.log(e.message)
      setIsLoading(false)
    }
  }

  return (
    <>
      <NotificationContainer />
      {isLoading ? <Loader /> :
        <div className="container-fluid py-5">
          <h3><span className="table-title" >Issued book List</span></h3>
          {user.violationFlag ?
            <div class="alert alert-danger mt-3" role="alert">
              You have made violation of roule. You shoud return book or renew it before a week. Pay the fine of {user.fines} Rs to library and continue reading.
            </div> : ''}
          {books.length != 0 ?
            <div className="table-responsive">
              <table className="table table-bordered table-hover bg-light">
                <thead className="bg-light">
                  <tr>
                    <th className="table-header"scope="col">#</th>
                    <th className="table-header"scope="col">Title</th>
                    <th className="table-header"scope="col">Author</th>
                    {/* <th scope="col">Quantity</th> */}
                    <th className="table-header"scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book._id}>
                      <th className="table-body" scope="row" >{index + 1}</th>
                      <td className="table-body">{book.book_info.title}</td>
                      <td className="table-body">{book.book_info.author}</td>
                      {/* <td >{book.book_info.stock}</td> */}
                      <td className="table-body">
                        {user.violationFlag ? '' :
                          <>
                            <button className="edit-button"
                              data-bs-toggle="modal" data-bs-target="#deleteModal1"
                              onClick={() => setRenewBookId(book.book_info.id)}
                            >{book.book_info.isRenewed ? 'Renewed' : 'Renew'}</button>
                            <button className="delete-button"
                              data-bs-toggle="modal" data-bs-target="#deleteModal"
                              onClick={() => setReturnBookId(book.book_info.id)}
                            >Return</button>

                          </>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            :
            <div className="card text-center mt-3">
              <div className="card-body">
                No book issued.
              </div>
            </div>
          }
        </div>
      }
      <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Book issue Modal</h5>
              {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button> */}
            </div>
            <div className="modal-body">
              Do you really want to return this book ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" data-bs-dismiss="modal"
                onClick={() => returnBook()}
                className="btn btn-danger">Return</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteModal1" tabIndex="-1" role="dialog"
        aria-labelledby="deleteModal1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Book renew Modal</h5>
              {/* <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close"> 
                        <span aria-hidden="true">&times;</span>
                        </button>*/}
            </div>
            <div className="modal-body">
              Do you really want to renew this book ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" data-bs-dismiss="modal"
                onClick={() => renewBook()}
                className="btn btn-danger">Renew</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
export default UserIssuedbook