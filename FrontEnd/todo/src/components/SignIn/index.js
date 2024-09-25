import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS file

const SignIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [war, setwarning] = useState(false)
  const [prime, setPrime] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const items = { name, email, password, prime };
    const url = 'http://localhost:4000/signin'; 
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(items),
    };
  
    try {
      const response = await fetch(url, options);
  
      if (response.ok) {
        console.log('User created successfully');
        navigate('/login');
      } else if (response.status === 409) {
        console.log('User already exists');
        setwarning(true)
        setName('')
        setEmail('')
        setPassword('')
      } else {
        const errorData = await response.json();
        console.error('Something went wrong:', errorData);
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
    }
  };

  const primeChange = () => {
    setPrime(prev => !prev)
  }
  
  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
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
        <div>
            <input type='checkbox' id="checkbox" onChange={primeChange}/>
            <label htmlFor='checkbox'>Is Prime User</label>
        </div>
        <p className="redirection-para">
          Already have an account? <Link to="/login" className="login-text">Login Here</Link>
        </p>
        <button type="submit" className="signin-btn">Sign In</button>
        {war ? <p className='war-para'>* User already exists</p>: ''}
      </form>
    </div>
  );
};

export default SignIn;

