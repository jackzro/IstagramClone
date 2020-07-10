import React, {useState,useEffect} from 'react';
import './App.css';
import Posts from './components/Posts';
import {db, auth } from './firebase'
import { Modal, Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle())
  const [posts,setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({id:doc.id,post:doc.data()})))
    })
  },[])

  useEffect(()=>{
   const unsubcribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser)
        setUser(authUser)
      }else{
        setUser(null)
      }
    })

    return () => {
      unsubcribe()
    }
  },[user, username])

  const signUp = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch(err=>alert(err.message))
  }

  const signIn = (e) => {
    e.preventDefault()
    auth
    .signInWithEmailAndPassword(email,password)
    .catch(err=>alert(err.message))
    
    setOpenSignIn(false)
  }


  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
         <div style={modalStyle} className={classes.paper}>
           <form className="app__signup">
           <center>
           <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png"
            alt=""
          />
          </center>

          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />

          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
         <div style={modalStyle} className={classes.paper}>
           <form className="app__signin">
           <center>
           <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png"
            alt=""
          />
          </center>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


     <div className="app__header">
      <img
        className="app__headerImage"
        src="https://www.instagram.com/static/images/ico/favicon-200.png/ab6eff595bb1.png"
        alt=""
      />
       {user ? (
      <Button onClick={()=> auth.signOut()}>Logout</Button>
      ): (
        <div className="app_login">
        <Button onClick={()=>{setOpenSignIn(true)}}>Sign In</Button>
        <Button onClick={()=>{setOpen(true)}}>Sign Up</Button>
        </div>
      )}
     </div>
   
    

     <h1>hello all i am fullstack</h1>

     <div className="app__posts">

        <div className="app__postLeft">
          {posts.map(post=>
            <Posts key={post.id} id={post.id} user={user} post={post.post} />
          )}
        </div>

        <div className="app__postRight">
        <InstagramEmbed
          url='https://www.instagram.com/p/CCSQmc3ge5F/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
        </div>
     
     </div>

     
     

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <h3>You need to Login to Upload!!!</h3>
      ) }
      
    </div> 
  );
}

export default App;
