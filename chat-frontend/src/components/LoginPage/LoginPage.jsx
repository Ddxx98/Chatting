import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('hide')
    const Navigate = useNavigate()

    const Login = async(e) => {
      e.preventDefault()
        if (email === '' && password === '') {
            setError("show")
            return
        }
        await axios.post('http://localhost:5000/login', {email, password},{headers:{
            "Content-Type":"application/json"
        }}).then(res => {
            console.log(res.data)
            const token = res.data.Token
            const userData = res.data.Name
            localStorage.setItem('token',token)
            localStorage.setItem('Name',userData)
            Navigate('/users')
        }).catch(err => {
            console.log(err)
            setError("show")
        })
        
    }
    return (
      <div className="login-page">
        <h1>Login</h1>
        <form onSubmit={Login} id='login'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

export default LoginPage
