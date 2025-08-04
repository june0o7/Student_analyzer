import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiBook, FiCalendar, FiEdit2, FiArrowLeft } from 'react-icons/fi';
import styles from '../Dashboard/Sdashboard.module.css';
import { useState } from 'react';
import Lottie from 'lottie-react';


const StudentProfile = () => {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@school.edu',
    class: '10A',
    studentId: 'STU2023001',
    dateOfBirth: '2005-08-15',
    address: '123 Main St, Anytown',
    phone: '(555) 123-4567',
    parentName: 'Sarah Johnson',
    parentEmail: 'sarah.johnson@email.com',
    parentPhone: '(555) 987-6543',
    subjects: ['Mathematics', 'Science', 'English', 'History'],
    bio: 'Passionate about science and technology. Looking forward to learning new things this semester!'
  });

  const handleEditProfile = () => {
    navigate('/student-form');
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className={styles.profileContainer}>
      <button className={styles.backButton} onClick={handleBack}>
        <FiArrowLeft size={20} />
      </button>

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
            <div className={styles.infoItem}>
              <FiMail className={styles.infoIcon} />
              <div>
                <h3>Email</h3>
                <p>{studentProfile.email}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiCalendar className={styles.infoIcon} />
              <div>
                <h3>Date of Birth</h3>
                <p>{studentProfile.dateOfBirth}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiUser className={styles.infoIcon} />
              <div>
                <h3>Address</h3>
                <p>{studentProfile.address}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiUser className={styles.infoIcon} />
              <div>
                <h3>Phone</h3>
                <p>{studentProfile.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h2>Parent/Guardian Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <FiUser className={styles.infoIcon} />
              <div>
                <h3>Name</h3>
                <p>{studentProfile.parentName}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiMail className={styles.infoIcon} />
              <div>
                <h3>Email</h3>
                <p>{studentProfile.parentEmail}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiUser className={styles.infoIcon} />
              <div>
                <h3>Phone</h3>
                <p>{studentProfile.parentPhone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h2>Academic Information</h2>
          <div className={styles.subjectsContainer}>
            {studentProfile.subjects.map((subject, index) => (
              <div key={index} className={styles.subjectBadge}>
                {subject}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.profileSection}>
          <h2>About Me</h2>
          <p className={styles.bioText}>{studentProfile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;