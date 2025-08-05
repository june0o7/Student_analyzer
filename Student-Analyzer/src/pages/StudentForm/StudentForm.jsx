import { useState, useEffect } from 'react';
import { FiSave, FiArrowLeft, FiUpload, FiCalendar, FiUser, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import styles from './Form.module.css';
import { auth, db, storage } from '../../Firebase_Config/firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const StudentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    classGrade: '',
    subjects: [],
    medicalConditions: '',
    allergies: '',
    previousSchool: '',
    interests: '',
    photoURL: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Load existing data if available
        try {
          const studentDoc = await getDoc(doc(db, "students", user.uid));
          if (studentDoc.exists()) {
            const data = studentDoc.data();
            setFormData(prev => ({
              ...prev,
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              studentId: data.studentId || '',
              dateOfBirth: data.dateOfBirth || '',
              gender: data.gender || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              zipCode: data.zipCode || '',
              parentName: data.parentName || '',
              parentEmail: data.parentEmail || '',
              parentPhone: data.parentPhone || '',
              emergencyContact: data.emergencyContact || '',
              emergencyPhone: data.emergencyPhone || '',
              classGrade: data.classGrade || '',
              subjects: data.subjects || [],
              medicalConditions: data.medicalConditions || '',
              allergies: data.allergies || '',
              previousSchool: data.previousSchool || '',
              interests: data.interests || '',
              photoURL: data.photoURL || ''
            }));
          }
        } catch (error) {
          console.error("Error loading student data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/student-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => {
        const newSubjects = checked 
          ? [...prev.subjects, value]
          : prev.subjects.filter(subject => subject !== value);
        return { ...prev, subjects: newSubjects };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    try {
      setLoading(true);
      
      // Upload photo if selected
      let photoURL = formData.photoURL;
      if (selectedFile) {
        const storageRef = ref(storage, `student-photos/${userId}/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Prepare data for Firestore
      const studentData = {
        ...formData,
        photoURL,
        name: `${formData.firstName} ${formData.lastName}`,
        updatedAt: new Date(),
        role: "student"
      };

      // Save to Firestore
      await setDoc(doc(db, "students", userId), studentData, { merge: true });
      
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving student data:", error);
      alert("There was an error saving your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const subjectOptions = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Art',
    'Music',
    'Physical Education'
  ];

  if (loading) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <h2>Profile Updated Successfully!</h2>
        <p>Your student profile has been saved.</p>
        <button 
          className={styles.primaryButton}
          onClick={() => navigate('/student-profile')}
        >
          View Your Profile
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h1>Student Profile Form</h1>
        <p>Please fill out all required fields to complete your profile</p>
      </div>

      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
        <div className={styles.progressSteps}>
          <span className={currentStep >= 1 ? styles.activeStep : ''}>1</span>
          <span className={currentStep >= 2 ? styles.activeStep : ''}>2</span>
          <span className={currentStep >= 3 ? styles.activeStep : ''}>3</span>
          <span className={currentStep >= 4 ? styles.activeStep : ''}>4</span>
        </div>
        <div className={styles.progressLabels}>
          <span>Personal Info</span>
          <span>Contact Details</span>
          <span>Academic Info</span>
          <span>Review & Submit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className={styles.formStep}>
            <h2>Personal Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dateOfBirth">Date of Birth <span className={styles.required}>*</span></label>
                <div className={styles.inputWithIcon}>
                  <FiCalendar className={styles.inputIcon} />
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Upload Photo</label>
                <div className={styles.fileUpload}>
                  <label htmlFor="photoUpload" className={styles.uploadButton}>
                    <FiUpload /> {selectedFile ? selectedFile.name : formData.photoURL ? 'Change Photo' : 'Choose File'}
                  </label>
                  <input
                    type="file"
                    id="photoUpload"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
                {formData.photoURL && !selectedFile && (
                  <div className={styles.currentPhoto}>
                    <small>Current photo is saved</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className={styles.formStep}>
            <h2>Contact Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address <span className={styles.required}>*</span></label>
                <div className={styles.inputWithIcon}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <div className={styles.inputWithIcon}>
                  <FiPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zipCode">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h3>Parent/Guardian Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="parentName">Parent/Guardian Name</label>
                <div className={styles.inputWithIcon}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="parentEmail">Parent Email</label>
                <div className={styles.inputWithIcon}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    id="parentEmail"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="parentPhone">Parent Phone</label>
                <div className={styles.inputWithIcon}>
                  <FiPhone className={styles.inputIcon} />
                  <input
                    type="tel"
                    id="parentPhone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <h3>Emergency Contact (Other than Parent)</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContact">Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="emergencyPhone">Emergency Phone</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Academic Information */}
        {currentStep === 3 && (
          <div className={styles.formStep}>
            <h2>Academic Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="classGrade">Class/Grade <span className={styles.required}>*</span></label>
                <select
                  id="classGrade"
                  name="classGrade"
                  value={formData.classGrade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class/Grade</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Subjects Interested In</label>
                <div className={styles.checkboxGroup}>
                  {subjectOptions.map((subject, index) => (
                    <div key={index} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        id={`subject-${index}`}
                        name="subjects"
                        value={subject}
                        checked={formData.subjects.includes(subject)}
                        onChange={handleChange}
                      />
                      <label htmlFor={`subject-${index}`}>{subject}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="previousSchool">Previous School (if applicable)</label>
                <input
                  type="text"
                  id="previousSchool"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="interests">Extracurricular Interests</label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Sports, arts, clubs, etc."
                ></textarea>
              </div>
            </div>

            <h3>Medical Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="medicalConditions">Medical Conditions</label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any medical conditions we should be aware of"
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any allergies (food, medication, etc.)"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {currentStep === 4 && (
          <div className={styles.formStep}>
            <h2>Review Your Information</h2>
            <div className={styles.reviewSection}>
              <h3>Personal Information</h3>
              <div className={styles.reviewGrid}>
                <div>
                  <label>Full Name</label>
                  <p>{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <label>Student ID</label>
                  <p>{formData.studentId || 'Not provided'}</p>
                </div>
                <div>
                  <label>Date of Birth</label>
                  <p>{formData.dateOfBirth || 'Not provided'}</p>
                </div>
                <div>
                  <label>Gender</label>
                  <p>{formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3>Contact Information</h3>
              <div className={styles.reviewGrid}>
                <div>
                  <label>Email</label>
                  <p>{formData.email}</p>
                </div>
                <div>
                  <label>Phone</label>
                  <p>{formData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label>Address</label>
                  <p>
                    {formData.address && `${formData.address}, `}
                    {formData.city && `${formData.city}, `}
                    {formData.state && `${formData.state} `}
                    {formData.zipCode}
                  </p>
                </div>
              </div>

              <div className={styles.reviewGrid}>
                <div>
                  <label>Parent/Guardian</label>
                  <p>{formData.parentName || 'Not provided'}</p>
                </div>
                <div>
                  <label>Parent Email</label>
                  <p>{formData.parentEmail || 'Not provided'}</p>
                </div>
                <div>
                  <label>Parent Phone</label>
                  <p>{formData.parentPhone || 'Not provided'}</p>
                </div>
                <div>
                  <label>Emergency Contact</label>
                  <p>
                    {formData.emergencyContact || 'Not provided'}
                    {formData.emergencyContact && formData.emergencyPhone && ` (${formData.emergencyPhone})`}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3>Academic Information</h3>
              <div className={styles.reviewGrid}>
                <div>
                  <label>Class/Grade</label>
                  <p>{formData.classGrade ? `Grade ${formData.classGrade}` : 'Not provided'}</p>
                </div>
                <div>
                  <label>Subjects</label>
                  <p>{formData.subjects.length > 0 ? formData.subjects.join(', ') : 'None selected'}</p>
                </div>
                <div>
                  <label>Previous School</label>
                  <p>{formData.previousSchool || 'Not provided'}</p>
                </div>
                <div>
                  <label>Interests</label>
                  <p>{formData.interests || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className={styles.reviewSection}>
              <h3>Medical Information</h3>
              <div className={styles.reviewGrid}>
                <div>
                  <label>Medical Conditions</label>
                  <p>{formData.medicalConditions || 'None reported'}</p>
                </div>
                <div>
                  <label>Allergies</label>
                  <p>{formData.allergies || 'None reported'}</p>
                </div>
              </div>
            </div>

            <div className={styles.consentSection}>
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="consent"
                  required
                />
                <label htmlFor="consent">
                  I certify that the information provided is accurate to the best of my knowledge.
                  <span className={styles.required}>*</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formActions}>
          {currentStep > 1 && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={prevStep}
            >
              <FiArrowLeft /> Back
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={nextStep}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : (<><FiSave /> Save Profile</>)}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;