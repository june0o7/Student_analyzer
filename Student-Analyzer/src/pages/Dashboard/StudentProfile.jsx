import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiBook, FiCalendar, FiEdit2, FiArrowLeft } from 'react-icons/fi';
// --- MODIFIED: Import from the new stylesheet ---
import styles from './StudentProfile.module.css'; 
import { useState, useEffect } from 'react';
import { auth, db } from '../../Firebase_Config/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState({
    name: '',
    email: '',
    class: '',
    studentId: '',
    dateOfBirth: '',
    address: '',
    phone: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    subjects: [],
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const studentDoc = await getDoc(doc(db, "students", user.uid));
          
          if (studentDoc.exists()) {
            const data = studentDoc.data();
            setStudentProfile({
              name: data.name || '',
              email: data.email || '',
              class: data.class || '',
              studentId: data.studentId || '',
              dateOfBirth: data.dateOfBirth || '',
              address: data.address || '',
              phone: data.phone || '',
              parentName: data.parentName || '',
              parentEmail: data.parentEmail || '',
              parentPhone: data.parentPhone || '',
              subjects: data.subjects || [],
              bio: data.bio || ''
            });

            // Check if required fields are filled
            const requiredFields = ['name', 'email', 'studentId'];
            const isComplete = requiredFields.every(field => data[field]);
            setProfileComplete(isComplete);
          } else {
            console.log("No student data found");
            setProfileComplete(false);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          setProfileComplete(false);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/student-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleEditProfile = () => {
    navigate('/student-form');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // --- This wrapper ensures a consistent background and centered content ---
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContentWrapper}>
        <button className={styles.backButton} onClick={handleBack}>
          <FiArrowLeft size={20} />
        </button>

        {!profileComplete ? (
          <div className={styles.incompleteProfile}>
            <h1>Complete Your Profile</h1>
            <p>Your profile information is incomplete. Please fill in your details to continue.</p>
            <button 
              className={styles.completeProfileButton}
              onClick={handleEditProfile}
            >
              <FiEdit2 /> Fill Profile Details
            </button>
          </div>
        ) : (
          <>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                {studentProfile.name.charAt(0)}
              </div>
              <div>
                <h1>{studentProfile.name}</h1>
                <p>{studentProfile.class} • {studentProfile.studentId}</p>
              </div>
              <button 
                className={styles.editProfileButton}
                onClick={handleEditProfile}
              >
                <FiEdit2 /> Edit Profile
              </button>
            </div>

            <div className={styles.profileContent}>
              <div className={styles.profileSection}>
                <h2>Personal Information</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}><FiMail className={styles.infoIcon} /><div><h3>Email</h3><p>{studentProfile.email || 'Not provided'}</p></div></div>
                  <div className={styles.infoItem}><FiCalendar className={styles.infoIcon} /><div><h3>Date of Birth</h3><p>{studentProfile.dateOfBirth || 'Not provided'}</p></div></div>
                  <div className={styles.infoItem}><FiUser className={styles.infoIcon} /><div><h3>Address</h3><p>{studentProfile.address || 'Not provided'}</p></div></div>
                  <div className={styles.infoItem}><FiUser className={styles.infoIcon} /><div><h3>Phone</h3><p>{studentProfile.phone || 'Not provided'}</p></div></div>
                </div>
              </div>

              <div className={styles.profileSection}>
                <h2>Parent/Guardian Information</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}><FiUser className={styles.infoIcon} /><div><h3>Name</h3><p>{studentProfile.parentName || 'Not provided'}</p></div></div>
                  <div className={styles.infoItem}><FiMail className={styles.infoIcon} /><div><h3>Email</h3><p>{studentProfile.parentEmail || 'Not provided'}</p></div></div>
                  <div className={styles.infoItem}><FiUser className={styles.infoIcon} /><div><h3>Phone</h3><p>{studentProfile.parentPhone || 'Not provided'}</p></div></div>
                </div>
              </div>

              <div className={styles.profileSection}>
                <h2>Academic Information</h2>
                {studentProfile.subjects.length > 0 ? (<div className={styles.subjectsContainer}>{studentProfile.subjects.map((subject, index) => (<div key={index} className={styles.subjectBadge}>{subject}</div>))}</div>) : (<p>No subjects registered yet</p>)}
              </div>

              <div className={styles.profileSection}>
                <h2>About Me</h2>
                <p className={styles.bioText}>{studentProfile.bio || 'No bio provided'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
