import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiCalendar, FiAward, FiBarChart2, FiClock, FiBell, FiUser, FiUsers, FiTrendingUp } from 'react-icons/fi';
import styles from './Sdashboard.module.css';
import PerformanceChart from '../Dashboard/performanceChart';
import { auth, db } from '../../Firebase_Config/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: '',
    class: '',
    email: '',
    studentId: '',
    attendance: 0,
    gpa: 0,
    recentGrades: [],
    upcomingAssignments: [],
    announcements: [],
    leaderboard: [],
    friends: []
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          // Fetch student data from Firestore
          const studentDoc = await getDoc(doc(db, "students", user.uid));
          
          if (studentDoc.exists()) {
            const data = studentDoc.data();
            setStudentData(prev => ({
              ...prev,
              name: data.name || '',
              email: data.email || '',
              studentId: data.studentId || '',
              // Set default values for other fields
              class: '10A', // You might want to store this in Firestore too
              attendance: 92,
              gpa: 3.7,
              recentGrades: [
                { subject: 'Mathematics', grade: 'A', progress: 85 },
                { subject: 'Science', grade: 'B+', progress: 78 },
                { subject: 'English', grade: 'A-', progress: 82 },
                { subject: 'History', grade: 'B', progress: 75 }
              ],
              upcomingAssignments: [
                { subject: 'Mathematics', task: 'Algebra Homework', due: 'Tomorrow' },
                { subject: 'Science', task: 'Lab Report', due: 'In 2 days' },
                { subject: 'English', task: 'Essay Draft', due: 'In 3 days' }
              ],
              announcements: [
                { title: 'School Holiday', date: 'May 15', content: 'No classes next Monday' },
                { title: 'Science Fair', date: 'May 20', content: 'Register by Friday' }
              ],
              leaderboard: [
                { rank: 1, name: 'Sarah Chen', gpa: 4.0, progress: 95 },
                { rank: 2, name: 'James Wilson', gpa: 3.9, progress: 92 },
                { rank: 3, name: data.name || 'You', gpa: 3.7, progress: 89 },
                { rank: 4, name: 'Maria Garcia', gpa: 3.5, progress: 85 },
                { rank: 5, name: 'David Kim', gpa: 3.4, progress: 82 }
              ],
              friends: [
                { name: 'James Wilson', status: 'online', progress: 92 },
                { name: 'Maria Garcia', status: 'offline', progress: 85 },
                { name: 'David Kim', status: 'online', progress: 82 }
              ]
            }));
          } else {
            console.log("No student data found");
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        navigate('/student-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleProfileClick = () => {
    navigate('/student-profile');
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Student Dashboard</h1>
          <p>Welcome back, {studentData.name}!</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.notificationIcon}>
            <FiBell size={20} />
            {notifications > 0 && <span className={styles.notificationBadge}>{notifications}</span>}
          </div>
          <div className={styles.profile} onClick={handleProfileClick}>
            <div className={styles.profileInitial}>{studentData.name.charAt(0)}</div>
            <span>{studentData.class}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav>
            <button 
              className={`${styles.navButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FiBarChart2 /> Overview
            </button>
            <button 
              className={`${styles.navButton} ${activeTab === 'classes' ? styles.active : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              <FiBook /> Classes
            </button>
            <button 
              className={`${styles.navButton} ${activeTab === 'schedule' ? styles.active : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <FiCalendar /> Schedule
            </button>
            <button 
              className={`${styles.navButton} ${activeTab === 'performance' ? styles.active : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              <FiAward /> Performance
            </button>
            <button 
              className={`${styles.navButton} ${activeTab === 'leaderboard' ? styles.active : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <FiTrendingUp /> Leaderboard
            </button>
            <button 
              className={`${styles.navButton} ${activeTab === 'friends' ? styles.active : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              <FiUsers /> Friends
            </button>
          </nav>
        </aside>

        {/* Dashboard Content */}
        <div className={styles.contentArea}>
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats */}
              <div className={styles.quickStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4361ee, #4cc9f0)' }}>
                    <FiUser color="white" />
                  </div>
                  <div>
                    <h3>Attendance</h3>
                    <p>{studentData.attendance}%</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4CAF50, #8BC34A)' }}>
                    <FiAward color="white" />
                  </div>
                  <div>
                    <h3>GPA</h3>
                    <p>{studentData.gpa}</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #FF9800, #FFC107)' }}>
                    <FiClock color="white" />
                  </div>
                  <div>
                    <h3>Upcoming</h3>
                    <p>{studentData.upcomingAssignments.length} tasks</p>
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div className={styles.chartContainer}>
                <h2>Performance Overview</h2>
                <PerformanceChart data={studentData.recentGrades} />
              </div>

              {/* Recent Grades */}
              <div className={styles.gradesContainer}>
                <h2>Recent Grades</h2>
                <div className={styles.gradesGrid}>
                  {studentData.recentGrades.map((grade, index) => (
                    <div key={index} className={styles.gradeCard}>
                      <h3>{grade.subject}</h3>
                      <div className={styles.gradeBadge}>{grade.grade}</div>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ 
                            width: `${grade.progress}%`,
                            background: `linear-gradient(90deg, #4361ee, #4cc9f0)`
                          }}
                        ></div>
                      </div>
                      <p>{grade.progress}% mastery</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Assignments */}
              <div className={styles.assignmentsContainer}>
                <h2>Upcoming Assignments</h2>
                <div className={styles.assignmentsList}>
                  {studentData.upcomingAssignments.map((assignment, index) => (
                    <div key={index} className={styles.assignmentCard}>
                      <div className={styles.assignmentSubject}>{assignment.subject}</div>
                      <div className={styles.assignmentDetails}>
                        <h3>{assignment.task}</h3>
                        <p>Due: {assignment.due}</p>
                      </div>
                      <button className={styles.assignmentButton}>View Details</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'leaderboard' && (
            <div className={styles.tabContent}>
              <h2>Class Leaderboard</h2>
              <div className={styles.leaderboardContainer}>
                <div className={styles.leaderboardHeader}>
                  <span>Rank</span>
                  <span>Name</span>
                  <span>GPA</span>
                  <span>Progress</span>
                </div>
                {studentData.leaderboard.map((student, index) => (
                  <div 
                    key={index} 
                    className={`${styles.leaderboardRow} ${student.name === studentData.name ? styles.currentUser : ''}`}
                  >
                    <span>{student.rank}</span>
                    <span>{student.name}</span>
                    <span>{student.gpa}</span>
                    <div className={styles.progressContainer}>
                      <div 
                        className={styles.progressBar} 
                        style={{ width: `${student.progress}%`, background: `linear-gradient(90deg, #4361ee, #4cc9f0)` }}
                      ></div>
                      <span>{student.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className={styles.tabContent}>
              <h2>Your Friends</h2>
              <div className={styles.friendsContainer}>
                {studentData.friends.map((friend, index) => (
                  <div key={index} className={styles.friendCard}>
                    <div className={styles.friendInfo}>
                      <div className={styles.friendAvatar}>
                        <div className={`${styles.statusIndicator} ${styles[friend.status]}`}></div>
                        {friend.name.charAt(0)}
                      </div>
                      <div>
                        <h3>{friend.name}</h3>
                        <p>{friend.status === 'online' ? 'Online' : 'Offline'}</p>
                      </div>
                    </div>
                    <div className={styles.friendProgress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ 
                            width: `${friend.progress}%`,
                            background: `linear-gradient(90deg, #4CAF50, #8BC34A)`
                          }}
                        ></div>
                      </div>
                      <span>{friend.progress}%</span>
                    </div>
                    <button className={styles.messageButton}>Message</button>
                  </div>
                ))}
                <button className={styles.addFriendButton}>
                  <FiUser /> Add New Friend
                </button>
              </div>
            </div>
          )}

          {/* Other tabs content remains the same */}
          {activeTab === 'classes' && (
            <div className={styles.tabContent}>
              <h2>Your Classes</h2>
              <p>Class content would go here</p>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className={styles.tabContent}>
              <h2>Class Schedule</h2>
              <p>Schedule content would go here</p>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className={styles.tabContent}>
              <h2>Detailed Performance</h2>
              <p>Performance analytics would go here</p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className={styles.rightSidebar}>
          <div className={styles.announcements}>
            <h2>Announcements</h2>
            {studentData.announcements.map((announcement, index) => (
              <div key={index} className={styles.announcementCard}>
                <div className={styles.announcementHeader}>
                  <h3>{announcement.title}</h3>
                  <span>{announcement.date}</span>
                </div>
                <p>{announcement.content}</p>
              </div>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <h2>Quick Links</h2>
            <button className={styles.quickLink}>View Report Card</button>
            <button className={styles.quickLink}>School Calendar</button>
            <button className={styles.quickLink}>Resources</button>
            <button className={styles.quickLink}>Contact Teachers</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;