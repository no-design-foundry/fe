// pages/index.js
import { useState } from 'react';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate a form submission
    console.log(`Email submitted: ${email}`);
    setMessage('Thank you for subscribing!');

    // Clear the input field
    setEmail('');
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      <form name="contact" method="POST" netlify>
        <p>
            <label>Your Email: <input type="email" name="email" /></label>
        </p>
        <p>
            <button type="submit">Send</button>
        </p>
        </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailSignup;
