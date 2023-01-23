import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FormEvent, memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { auth } from '../firebase';

export const Login = memo(() => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // @ts-ignore
    const email = e.target[0].value;
    // @ts-ignore
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate('/');
      toast.info('🦄 Success!');
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = error.message;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">My Chat</span>
        <span className="title">Login</span>

        <form name="registerForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />

          <button>Sign In</button>

          {error}
        </form>

        <p>
          You did not have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
});
