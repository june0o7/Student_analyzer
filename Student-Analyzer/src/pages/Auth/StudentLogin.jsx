import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Auth.module.css';
import studentData from '../icons_logos/lstudent.json';
import Lottie from 'lottie-react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from '../../Firebase_Config/firebaseConfig';// adjust path if needed
import { getDoc, doc } from "firebase/firestore";


const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, you would verify credentials against your backend
      console.log('Student login attempt:', { email, password });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const userId = userCredential.user.uid;

    // 🔐 Check Firestore "students" collection
    const studentDoc = await getDoc(doc(db, "students", userId));
      
      // For demo purposes, we'll just check if fields are filled
      if (email && password && studentDoc.exists()) {
        navigate('/student-dashboard');
      } else {
        setError('You are not registered as a student.');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authLeft}>
          <Lottie animationData={studentData} loop={true} className={styles.authAnimation} />
          <h2>Welcome Back, Student!</h2>
          <p>Track your academic progress and performance</p>
        </div>
        
        <div className={styles.authRight}>
          <h1>Student Login</h1>
          
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && <div className={styles.authError}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className={styles.authButton}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className={styles.authFooter}>
              Don't have an account? <Link to="/student-signup">Sign up</Link>
            </div>

            <div className={styles.authFooter}>
              Student Dashboard in progress.. <Link to="/student-dashboard" >Student Dashboard</Link>
            </div>

            <div className={styles.authFooter}>
              teacher Dashboard in progress.. <Link to="/teacher-dashboard" >Teacher Dashboard</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;