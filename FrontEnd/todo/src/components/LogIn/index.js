import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import './index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalid,setInvalid] = useState(false)
  const [inpass, setInPass] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    const url = 'http://localhost:4000/login'
    const items = {email,password}
    const options = {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify(items)
    }

    try{
        const response = await fetch(url,options)
        if (response.ok){
            const data = await response.json()
            console.log(data.token)
            Cookies.set('jwt',data.token)
            navigate('/body')
        }else if(response.status === 401){
            setInPass(true)
            setEmail('')
            setPassword('')
            console.log('Invalid Password')
        }else if(response.status === 404){
            setInvalid(true)
            setEmail('')
            setPassword('')
        }
    }catch(e){
       console.log(`Error submiting ${e.message}`) 
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            id="name"
            placeholder="Enter your name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">Login</button>
        {invalid ? <p className='war-para'>* Invalid User</p>: ''}
        {inpass ? <p className='war-para'>* Invalid Password</p>: ""}
      </form>
    </div>
  );
};

export default Login;
