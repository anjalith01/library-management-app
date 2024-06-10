import { useEffect, useState } from "react"
import Loader from "../Login/Loader"
import { NotificationContainer, NotificationManager } from "react-notifications"
import { useNavigate } from "react-router-dom"
import '../../Styles/table.css'

const Home = () => {
  const [bookLimitPerUser, setBookLimitPerUser] = useState('')
  const [books, setBooks] = useState([])
  const [fine, setFine] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user_mgmt')).user
  const navigate=useNavigate()
  console.log(user)
  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('user_mgmt'))
    const getHome = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("http://localhost:8000/user-home", {
          method: 'POST',
          body: JSON.stringify(getUser),
          headers: {
            'Content-Type': 'application/json',
            authorization: 'bearer ' + getUser.token
          }
        })
        const data = await res.json()
        console.log(data)
        if (res.ok) {
          setBookLimitPerUser(data.limitOfBooksPerUser.number)
          setBooks([...data.books])
          setFine(data.user.fines)
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
    getHome()
  }, [])
  return (
    <div style={{ marginTop: 40, textAlign: 'center' }}>
      <NotificationContainer />
      <div className="container-fluid mt-5">
        <div className="row dashboard-content">
          <div className="col-md-12 mb-3">
            <div className="card bg-light mb-3" >
              <div className="card-header">
                <span style={{color:"#007429",fontWeight:700,fontSize:"26px"}}>User Info</span>
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{color:"#007429",fontSize:"16px"}}>{user.name}</h5>
                <p className="card-text" style={{color:"#007429",fontSize:"16px"}}>{user.email}</p>
              </div>
            </div>
          </div>

          {isLoading ?
            <div style={{ textAlign: 'center' }}><Loader /></div> : <>
              <div className="col-md-6">
                <ul className="list-group">
                  <li style={{backgroundColor:"#007429"}} className="list-group-item text-white">New added books</li>
                  {books.length > 0 && books.map((book, i) => {
                    return (
                      <div key={book._id}>
                        <li className="list-group-item" style={{color:"#007429"}} >{book.title}</li>

                      </div>
                    )
                  })

                  }
                </ul>
              </div>

              <div className="col-md-6">

                <div className="card text-white mb-3" style={{backgroundColor:"#007429"}} >
                  <div className="card-header"  >Bookes per user</div>
                  <div className="card-body">
                    <h5 className="card-title" >Number of books per person/user :- {bookLimitPerUser}</h5>
                    <p className="card-text" >This is the no of books user can issue at a time.</p>
                  </div>
                </div>
                <div className="card text-white mb-3" style={{backgroundColor:"#007429"}}  >
                  <div className="card-header" >Total fine</div>
                  <div className="card-body">
                    <h5 className="card-title" >Rs. {fine}</h5>

                  </div>
                </div>
              </div>
            </>}

        </div>
      </div>
    </div>
  )
}
export default Home