import { useEffect, useState } from "react"
import { NotificationContainer, NotificationManager } from "react-notifications"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../Login/Loader"

const UpdateBook = () => {
    const [bookFields, setBookFields] = useState({
        title: '',
        author: '',
        category: '',
        stock: 0,
        description: ''
    })
    const [titleErr, setTitleErr] = useState('')
    const [authorErr, setAuthorErr] = useState('')
    const [catergoryErr, setCategoryErr] = useState('')
    const [stockErr, setStockErr] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate=useNavigate()
    const params = useParams()
    console.log(params)

    useEffect(() => {
        const getBook = async () => {
            try {
                const res = await fetch(`http://localhost:8000/book/${params.id}`, {
                    method: 'POST',
                    body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                    }
                })
                const data = await res.json()
                console.log(data)
                if(res.ok && data.result){
                    setBookFields({
                        title:data.result.title,
                        author:data.result.author,
                        category:data.result.category,
                        stock:data.result.stock,
                        description:data.result.description
                    })
                }
                else{
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
        getBook()
    }, [])
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
            try {
                setIsLoading(true)
                const res = await fetch(`http://localhost:8000/update-book/${params.id}`, {
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
                }
                else{
                    await NotificationManager.warning("", data.msg, 3000)
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
    }
    return (
        <>
            <NotificationContainer />
            <div className="container-fluid mt-5 px-4">
                <div className="mb-3">
                    <h3><span className="badge badge-info p-2">Update book</span></h3>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '0 0em' }}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="title" >Title</label>
                                    <input type="text" style={{backgroundColor:'#EEF1F3'}} value={bookFields.title} onChange={handleChange} className="form-control" name="title" id="title" placeholder="Enter title" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{titleErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="author" >Author</label>
                                    <input type="text" style={{backgroundColor:'#EEF1F3'}} value={bookFields.author} onChange={handleChange} className="form-control" id="author" name="author" placeholder="Enter author" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{authorErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="category" >Category</label>
                                    <input type="text" style={{backgroundColor:'#EEF1F3'}} value={bookFields.category} onChange={handleChange} className="form-control" id="category" name="category" placeholder="Enter category" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{catergoryErr}</div>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="label" htmlFor="stock" >Stock</label>
                                    <input type="text" style={{backgroundColor:'#EEF1F3'}} value={bookFields.stock} onChange={handleChange} className="form-control" id="stock" name="stock" placeholder="Enter stock" />
                                    <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{stockErr}</div>
                                </div>
                                <div className="form-group col-md-12">
                                    <label className="label" htmlFor="description" >Description</label>
                                    <textarea rows="3" style={{backgroundColor:'#EEF1F3'}} value={bookFields.description} onChange={handleChange} className="form-control" id="description" name="description" placeholder="Enter description" />
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="action-button">{isLoading?<Loader/>:'Update'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
export default UpdateBook