import { NotificationContainer, NotificationManager } from "react-notifications"
import Loader from "../Login/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const LimitOfBooks = () => {
    const [number, setNumber] = useState(0)
    const [numberErr, setNumberErr] = useState('This field is required')
    const [isLoading, setIsLoading] = useState(false)
const navigate=useNavigate()
    useEffect(() => {
        const getLimit = async () => {
            try {
                setIsLoading(true)

                const res = await fetch("http://localhost:8000/get-limit", {
                    method: 'POST',
                    body: JSON.stringify({ _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id }),
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                    }
                })
                const data = await res.json()
                console.log(data)
                console.log(res)
                if (res.ok && data.result.length > 0) {
                    setNumber(data.result[0].number)
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
        getLimit()
    }, [])

    const handleSubmit = async (e) => {
        console.log(numberErr)
        e.preventDefault()
        try {

            const res = await fetch("http://localhost:8000/add-limit-per-user", {
                method: 'POST',
                body: JSON.stringify({
                    _id: JSON.parse(localStorage.getItem('user_mgmt')).user._id,
                    number: number
                }),
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user_mgmt')).token
                }
            })
            const data = await res.json()

            if (res.ok) {
                await NotificationManager.success("", "Limit updated successfully!", 3000)
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
            {isLoading ? <Loader /> :
                <div className="container-fluid mt-5 px-4">
                    <div className="mb-3">
                        <h3><span className="table-title">Update Limit of books per user</span></h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <form onSubmit={handleSubmit} style={{ padding: '0 0em', width: '50%' }}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="form-group col-md-10">
                                            <label htmlFor="number" className="label" >Limit </label>
                                            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} style={{backgroundColor:'#EEF1F3'}} className="form-control" number="number" id="number" placeholder="Enter number" />
                                            <div style={{ fontSize: 12, color: "red", marginTop: "5px" }}>{!number && numberErr}</div>
                                        </div>
                                        <div className="col-md-12">
                                            <button type="submit"className="action-button">Update limit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}
export default LimitOfBooks