import { useState } from "react"
import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "../Login/Loader"
import { useNavigate } from "react-router-dom"

const AddNewBook = () => {
    const [bookFields, setBookFields] = useState({
        title: '',
        author: '',
        category: '',
        stock: '',
        description: ''
    })
    const [titleErr, setTitleErr] = useState('')
    const [authorErr, setAuthorErr] = useState('')
    const [catergoryErr, setCategoryErr] = useState('')
    const [stockErr, setStockErr] = useState('')
    const [isLoading,setIsLoading]=useState(false)
    const navigate=useNavigate()

    const handleChange = (e) => {
        setBookFields({ ...bookFields, [e.target.name]: e.target.value })

    }
    const validate = () => {
        if (!bookFields.title) {
            setTitleErr('Title is required')
        }
        else {
            setTitleErr('')
        }
        if (!bookFields.author) {
            setAuthorErr('Author is required')
        }
        else {
            setAuthorErr('')
        }
        if (!bookFields.category) {
            setCategoryErr('Category is required')
        }
        else {
            setCategoryErr('')
        }
        if (!bookFields.stock) {
            setStockErr('Stock is required')
        }
        else {
            setStockErr('')
        }
        if (!bookFields.title || !bookFields.author || !bookFields.category || !bookFields.stock) {
            return false
        }
        return true
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const isValid = validate()
        if (isValid) {
            console.log(bookFields)
            try {
                setIsLoading(true)
                const res = await fetch("http://localhost:8000/add-new-book", {
                    method: 'POST',
                    body: JSON.stringify({ ...bookFields, _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                    }
                })
                const data = await res.json()
                console.log(data)
                if(res.ok){
                    await NotificationManager.success("", "Book created successfully!", 3000)
                    navigate('/admin-portal/book-list')
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
            }
        }
    }
    return (
        <>
            <NotificationContainer />
            <div className="container-fluid mt-5 px-4">
                <div className="mb-3">
                    <h3><span className="badge badge-info p-2">Add new book</span></h3>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '0 0em' }}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="title" >Title</label>
                                    <input type="text" value={bookFields.title} onChange={handleChange} className="form-control" name="title" id="title" placeholder="Enter title" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{titleErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="author" >Author</label>
                                    <input type="text" value={bookFields.author} onChange={handleChange} className="form-control" id="author" name="author" placeholder="Enter author" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{authorErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="category" >Category</label>
                                    <input type="text" value={bookFields.category} onChange={handleChange} className="form-control" id="category" name="category" placeholder="Enter category" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{catergoryErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="stock" >Stock</label>
                                    <input type="text" value={bookFields.stock} onChange={handleChange} className="form-control" id="stock" name="stock" placeholder="Enter stock" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{stockErr}</div>
                                </div>
                                <div className="form-group col-md-12">
                                    <label htmlFor="description" >Description</label>
                                    <textarea rows="3" value={bookFields.description} onChange={handleChange} className="form-control" id="description" name="description" placeholder="Enter description" />
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary float-right">{isLoading?<Loader/>:"Add book"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
export default AddNewBook