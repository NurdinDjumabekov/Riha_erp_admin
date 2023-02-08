import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../../api"
import styles from './post.module.css'

export default function Post()
{
    const [comments, setComments] = useState([])
    const { postId } = useParams()

    useEffect(() =>
    {
        API.get(`posts/${postId}/comments`).then(
                resp => setComments(resp.data)
            )
    }, [])
    
    return (
        <div className={styles.post}>
            <Link to='/'><h2>На Главную</h2></Link>
            <div>Пост по номеру: {postId} </div>
            <h3>Comments: </h3>
            <ul>
                {comments.map(com => <li key={com.id}>{com.body}</li>)}
            </ul>
        </div>
    )
}
