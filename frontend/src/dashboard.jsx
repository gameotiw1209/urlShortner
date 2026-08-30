import axios from 'axios'
import { useState } from 'react'

const API_URL='http://localhost:5000'

function Dashboard(){
    const [longURL,setLONGURL]=useState('')
    const [shortLink,setshortLinks]=useState([])

    const handleCreate=async(e) => {
        e.preventDefault()
        if(!longURL) return;

        try{
            const response = await axios.post(`${API_URL}/api/shortner`,{
                redirectURL:longURL
            })
            const newLink={id:response.data.id, url:`${API_URL}/${response.data.id}`}
            setshortLinks([newLink,...shortLink])
            setLONGURL("")
        }
        catch(error){
            console.log('error:',error)
        }
    }

    return(
        <div>
            <form onSubmit={handleCreate}>
                <input
                value={longURL}
                onChange={(e)=> setLONGURL(e.target.value)}
                placeholder='place your long url'
                />
                <button type='submit'>create</button>
            </form>
            <ul>
                {shortLink.map((link)=>(
                    <li key={link.id}>{link.url}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard
