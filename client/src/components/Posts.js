import React,{useState,useEffect} from 'react'
import '../styles/post.css'
import { Avatar } from '@material-ui/core';
import { db } from '../firebase';
import firebase from 'firebase'

function Posts(props) {
    const {username, imageUrl, caption} = props.post
    const [comments, setComments] = useState("")
    const [comment, setComment] = useState("")

    useEffect(()=>{
        let unsubcribe
        if(props.id){
            unsubcribe = db
                .collection('posts')
                .doc(props.id)
                .collection("comments")
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map(doc=>doc.data()))
                })
        }

        return () => {
            unsubcribe()
        }
            
    },[props.id])

    const postComment = (e) => {
        e.preventDefault()
        db.collection('posts').doc(props.id).collection("comments").add({
            comment:comment,
            username:props.user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment("")
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="Username"
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            

            <img
                className="post__image"
                src={imageUrl}
            />

            <h4 className="post__text"><strong>{username}: </strong> {caption}</h4>

            <div className="post_comments">
            {comments && comments.map((comment,i)=>
                <p key={i}>
                    <b>{comment.username}</b> {comment.comment}
                </p>
            )}
            </div>

            {props.user && (
                <form className="post__commentBox">
                <input
                className="post__input"
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e)=> setComment(e.target.value)}
                />
                <button
                className="post__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
                >
                    Post
                </button>
            </form>
            )}
            
        </div>
    )
}

export default Posts
