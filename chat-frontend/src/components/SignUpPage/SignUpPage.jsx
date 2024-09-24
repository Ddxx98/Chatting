import React, { useState } from 'react'
import axios from 'axios'
import './SignUpPage.css'
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()
    const [error, setError] = useState('hide')

    const SignUp = async (e) => {
        e.preventDefault()
        if (username === '' && password === '' && confirmPassword === '') {
            setError("show")
            return
        }
        if (password !== confirmPassword) {
            setError("show")
            return
        }

        await axios.post('http://localhost:5000/signup', { username,email, password }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res.data)
            navigate('/login')
        }).catch(err => {
            console.log(err)
            setError("show")
        })
    }

    return (
        <div className="signup-page">
            <h1>Sign Up</h1>
            <form onSubmit={SignUp} id='signup'>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={() => navigate('/login')}>Already have an account? Login</button>
        </div>
    );
}


export default SignUpPage
