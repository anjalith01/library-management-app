import { useEffect, useState } from "react"
import Loader from "../Login/Loader"
import { NotificationContainer, NotificationManager } from "react-notifications"
import { useNavigate } from "react-router-dom"

const UserAllBooksList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [bookList, setBookList] = useState([])
  const [bookId, setBookId] = useState('')
  const navigate=useNavigate()
  const getAllBooks = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:8000/book-list", {
        method: 'POST',
        body: JSON.stringify({ id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
        }
      })
      const data = await res.json()
      console.log(data)
      if (res.ok && data.result) {
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
    getAllBooks()
  }, [])

  const issueBook = async () => {
    try {
      const res = await fetch("http://localhost:8000/issue-book/" + bookId, {
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
      console.log(e.message)
    }
  }

  return (
    <>
      <NotificationContainer />
      <div>
        <div className="container-fluid py-5">
          <h3><span className="table-title">Book List</span></h3>

          {isLoading ? <Loader />
            :
            <div className="table-responsive" style={{maxHeight:'400px',overflowY:'scroll'}}>
              <table className="table table-bordered table-hover bg-light">
                <thead className="bg-light">
                  <tr>
                    <th className="table-header" scope="col">#</th>
                    <th className="table-header" scope="col">Title</th>
                    <th className="table-header" scope="col">Author</th>
                    <th className="table-header" scope="col">Quantity</th>
                    <th className="table-header" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookList.length > 0 && bookList.map((book, index) => {
                    return (

                      <tr >
                        <th scope="row"className="table-body"  >{index + 1}</th>
                        <td className="table-body" >{book.title}</td>
                        <td className="table-body">{book.author}</td>
                        <td className="table-body">{book.stock}</td>
                        <td className="table-body">
                          <button type="button" className="edit-button"
                            onClick={() => setBookId(book._id)}
                            data-bs-toggle="modal" data-bs-target="#deleteModal">
                            Issue
                          </button>
                        </td>
                      </tr>
                    )
                  })
                  }
                </tbody>
              </table>
            </div>
          }

          <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">Book issue Modal</h5>

                </div>
                <div className="modal-body">
                  Do you really want to issue this book ?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                  <button type="button" data-bs-dismiss="modal" onClick={() => issueBook()}
                    className="btn btn-danger">Issue</button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}
export default UserAllBooksList