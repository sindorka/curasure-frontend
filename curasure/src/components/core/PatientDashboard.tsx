import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientDashboard.css";
import defaultDoctorImage from "../../assets/default.png";
import Calendar from "react-calendar";   // ✅ Correct import
import "react-calendar/dist/Calendar.css";
import defaultPatientImage from "../../assets/default.png";
import ViewCovidArticles from "./ViewCovidArticles";
import InsuranceTab from "./InsuranceTab"; // import this



type Value = Date | Date[] | null;


function PatientDashboard() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('profile');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patient, setPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileDoctor, setProfileDoctor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");    // 🔍 For name/specialization search
  const [filterCovidCare, setFilterCovidCare] = useState(false);
  const [profileFeedbacks, setProfileFeedbacks] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [doctorFeedbacks, setDoctorFeedbacks] = useState<any[]>([]);
  const [doctorRatings, setDoctorRatings] = useState<Map<string, string>>(new Map());
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCovidModal, setShowCovidModal] = useState(false);
  const [tempCovidForm, setTempCovidForm] = useState({
    fever: false,
    cough: false,
    breathingDifficulty: false,
    contactWithCovidPatient: false,
    needCovidTest: false,
  });
  
  const [feedbackForm, setFeedbackForm] = useState({
  rating: 0,
  comment: "",
});
const [showEditProfileModal, setShowEditProfileModal] = useState(false);

const [editForm, setEditForm] = useState({
    contact: "",
    address: "",
    age: 0,
    gender: "",
    testedPositive: false,
    symptoms: '' as string,                   // ✅ store symptoms as a comma separated string
    medicalConditions: '' as string,
    testDate: null as Date | string | null, 
    insuranceCompany: "",
    insuranceStatus: "",
    profilePicture: "",
});


  const [covidForm, setCovidForm] = useState({
    fever: false,
    cough: false,
    breathingDifficulty: false,
    needCovidTest: false,
  });
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await axios.get("http://localhost:5002/api/doctors");
      setDoctors(res.data.doctors || []);
    };
    fetchDoctors();

    const fetchAppointments = async () => {
        const res = await axios.get(`http://localhost:5002/api/appointments/patient/${id}`);
        setAppointments(res.data.appointments || []);
      };
    
      fetchAppointments();

    const fetchPatientDetails = async () => {
        try {
          const res = await axios.get(`http://localhost:5002/api/patient/${id}/full-details`);
          setPatient(res.data.patient); // Set full patient details
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      };
    
      fetchPatientDetails();
  }, [id]);

  const hasVisitedDoctor = (doctorId: string) => {
    return appointments.some(app => app.doctorId && app.doctorId._id === doctorId);
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name: patient.name,
        contact: editForm.contact,
        address: editForm.address,
        age: editForm.age,
        gender: editForm.gender,
        testedPositive: editForm.testedPositive,
        testDate: editForm.testDate ? new Date(editForm.testDate) : null,    // convert string to Date
        symptoms: editForm.symptoms,  // already an array
        medicalConditions: editForm.medicalConditions, // split into array
        insuranceCompany: editForm.insuranceCompany,
        insuranceStatus: editForm.insuranceStatus,
        profilePicture: editForm.profilePicture,
      };
  
      await axios.put(`http://localhost:5002/api/patient/${id}/update`, payload);
  
      alert('Profile updated successfully! 🎉');
      setShowEditProfileModal(false);
  
      // (Optional) You can reload patient details here
      const res = await axios.get(`http://localhost:5002/api/patient/${id}/full-details`);
      setPatient(res.data.patient);
  
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          profilePicture: reader.result as string, // store base64 or URL
        }));
      };
      reader.readAsDataURL(file);  // reads file as Base64
    }
  };
  
  
  const handleCovidSubmit = async () => {
    try {
      await axios.post(`http://localhost:5002/api/covid-questionnaire/${id}`, covidForm);
      alert("COVID Questionnaire submitted successfully!");
    } catch (error) {
      console.error("Error submitting COVID questionnaire:", error);
    }
  };

  const handleDoctorSelect = async (doctor: any) => {
    setSelectedDoctor(doctor);
    setAvailableSlots([
      "10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "4:30 PM"
    ]);
  
    try {
      const res = await axios.get(`http://localhost:5002/api/feedback/${doctor._id}`);
      const feedbacks = res.data.feedbacks || [];
      setDoctorFeedbacks(feedbacks);

      const bookedRes = await axios.get(`http://localhost:5002/api/appointments/doctor/${doctor._id}/booked-slots`);
      const bookedTimes = bookedRes.data.bookedTimes || [];
    
      setBookedSlots(bookedTimes); 
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setDoctorFeedbacks([]);
    }
  };
  
  const handleDateChange = async (value: Date | null, event: React.MouseEvent<HTMLButtonElement> | null = null) => {
    if (!value || Array.isArray(value)) return; // ignore if range selected
  
    const date = value as Date;
    setSelectedDate(date);
  
    if (selectedDoctor) {
      const formattedDate = date.toISOString().split("T")[0];
  
      try {
        const res = await axios.get(`http://localhost:5002/api/appointments/doctor/${selectedDoctor._id}?date=${formattedDate}`);
        const booked = res.data.bookedSlots || [];
  
        const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  
        const available = allSlots.filter(slot => !booked.includes(slot));
  
        setAvailableSlots(available);
        setBookedSlots(booked);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    }
};

  
  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await axios.delete(`http://localhost:5002/api/${appointmentId}`);
      alert("Appointment deleted successfully");
  
      // Refresh the appointments list and slots
      const updatedRes = await axios.get(`http://localhost:5002/api/appointments/patient/${id}`);
      setAppointments(updatedRes.data.appointments || []);
  
      if (selectedDate && selectedDoctor) {
        handleDateChange(selectedDate); // refresh available slots
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment.");
    }
  };

  const handleViewProfile = async (doctor: any) => {
    try {
      setProfileDoctor(doctor);  // 🛠️ Save doctor for profile modal
      setSelectedDoctor(doctor); // optional
      const res = await axios.get(`http://localhost:5002/api/feedback/${doctor._id}`);
      const { feedbacks } = res.data;
  
      setProfileFeedbacks(feedbacks);
  
      setShowProfileModal(true);   // 🛠️ OPEN the profile modal after fetching
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };
  

  const handleBookAppointment = async () => {
    try {
      if (!selectedSlot || !selectedDoctor || !selectedDate) return;
  
      const formattedDate = selectedDate.toISOString().split("T")[0]; // 📅 Use selected date!
  
      await axios.post('http://localhost:5002/api/book-appointment', {
        patientId: id,
        doctorId: selectedDoctor._id,
        date: formattedDate,   // ⬅️ FIXED: selected date
        time: selectedSlot
      });
  
      alert(`Appointment booked with Dr. ${selectedDoctor.name} at ${selectedSlot}`);
      setAvailableSlots(prevSlots => prevSlots.filter(slot => slot !== selectedSlot));
      setSelectedSlot("");
  

  
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };
  

  const handleFeedbackOpen = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowFeedbackModal(true);
    setFeedbackForm({ rating: 0, comment: "" }); // clear old feedback
  };
  
  const fetchDoctors = async () => {
    const res = await axios.get("http://localhost:5002/api/doctors");
    setDoctors(res.data.doctors || []);
  };
  
  
  const handleSubmitFeedback = async () => {
    if (!selectedDoctor) return;
  
    try {
      await axios.post("http://localhost:5002/api/feedback", {
        doctorId: selectedDoctor._id,
        patientId: id,
        rating: feedbackForm.rating,
        review: feedbackForm.comment,
      });
  
      // Fetch updated feedbacks (just to show latest comments)
      const updatedFeedbacksRes = await axios.get(`http://localhost:5002/api/feedback/${selectedDoctor._id}`);
      const updatedFeedbacks = updatedFeedbacksRes.data.feedbacks || [];
      setProfileFeedbacks(updatedFeedbacks);
  
      alert("Feedback submitted successfully!");
      setShowFeedbackModal(false);
  
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };
  
  const checkCovidFormStatus = async (): Promise<boolean> => {
    try {
      const res = await axios.get(`http://localhost:5002/api/covid-questionnaire/check/${id}`);
      return res.data.filled;   // true or false
    } catch (error) {
      console.error('Error checking COVID form status:', error);
      return false;
    }
  };
  
  const submitCovidForm = async () => {
    try {
      await axios.post(`http://localhost:5002/api/covid-questionnaire`, {
        patientId: id,
        ...tempCovidForm,
      });
      alert('COVID-19 questionnaire submitted successfully!');
      setShowCovidModal(false);
    } catch (error) {
      console.error('Error submitting COVID form:', error);
      alert('Error submitting COVID-19 questionnaire.');
    }
  };
  
  const handleBookAppointmentWithCheck = async () => {
    const filled = await checkCovidFormStatus();
  
    if (!filled) {
      setShowCovidModal(true);  // Show modal if form not filled
      return;
    }
  
    handleBookAppointment();    // Otherwise book appointment normally
  };
  

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div 
          className="sidebar-logo"  
          style={{ cursor: 'pointer' }}
          onClick={() => navigate("/")}
        >
          CuraSure
        </div>
        <nav>
          <button onClick={() => setActiveTab('profile')}>Profile</button>
          <button onClick={() => setActiveTab('doctors')}>Doctors</button>
          <button onClick={() => setActiveTab("insurance")}>Insurance</button>
          <button onClick={() => setActiveTab("covid-articles")}>COVID-19 Articles</button>
          <button 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              navigate("/");
              window.location.reload();
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
      {activeTab === 'profile' && patient && (
  <div className="profile-container">
    <div className="profile-card">
  {/* Top: Image and Name */}
  <div className="profile-header">
    <img 
      key={patient?.profilePicture} 
      src={patient?.profilePicture || defaultPatientImage}
      alt="Profile"
    />
    <h2>{patient?.name || "N/A"}</h2>
  </div>

  {/* Flex Grid */}
  <div className="profile-info-grid">
    {/* Left Section */}
    <div className="left-section">
      <p><strong>Phone:</strong> {patient?.contact?.trim() || "N/A"}</p>
      <p><strong>Address:</strong> {patient?.address?.trim() || "Not Provided"}</p>
      <p><strong>Age:</strong> {patient?.age || "N/A"}</p>
      <p><strong>Gender:</strong> {patient?.gender?.trim() || "Not Specified"}</p>
    </div>

    {/* Right Section */}
    <div className="right-section">
      <div className="section-title">COVID-19 Information</div>
      <p><strong>Tested Positive:</strong> {patient?.testedPositive ? "Yes" : "No"}</p>
      <p><strong>Symptoms:</strong> {patient?.symptoms?.length > 0 ? patient.symptoms.join(', ') : "None"}</p>
      {patient?.testDate && (
        <p><strong>Test Date:</strong> {new Date(patient.testDate).toLocaleDateString()}</p>
      )}

      <div className="section-title">Medical History</div>
      <p><strong>Conditions:</strong> {patient?.medicalConditions?.length > 0 ? patient.medicalConditions.join(', ') : "None"}</p>

      <div className="section-title">Insurance Information</div>
      <p><strong>Insurance Company:</strong> {patient?.insuranceCompany || "N/A"}</p>
      <p><strong>Coverage Status:</strong> {patient?.insuranceStatus || "N/A"}</p>
    </div>
  </div>

  <button className="edit-profile-btn" onClick={() => {setShowEditProfileModal(true)
    setEditForm({
        contact: patient.contact || "",
        address: patient.address || "",
        age: patient.age || 0,
        gender: patient.gender || "",
        testedPositive: patient.testedPositive || false,
        testDate: patient.testDate ? new Date(patient.testDate) : null,
        symptoms: patient.symptoms ? patient.symptoms.join(", ") : "",        // <-- Convert array to string
        medicalConditions: patient.medicalConditions ? patient.medicalConditions.join(", ") : "",  // <-- Convert array to string
        insuranceCompany: patient.insuranceCompany || "",
        insuranceStatus: patient.insuranceStatus || "",
        profilePicture: patient.profilePicture || ""
    });
  }

  }>
    Edit Profile
  </button>
</div>

  {showEditProfileModal && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2>Edit Full Profile</h2>

      {/* Contact Field (Phone Number) */}
      <input 
        type="text" 
        value={editForm.contact}
        onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
        placeholder="Phone Number"
      />

      {/* Address */}
      <input 
        type="text" 
        value={editForm.address}
        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
        placeholder="Address"
      />

      {/* Age */}
      <input 
        type="number" 
        value={editForm.age}
        onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) })}
        placeholder="Age"
      />

      {/* Gender */}
      <input 
        type="text" 
        value={editForm.gender}
        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
        placeholder="Gender"
      />

      {/* COVID Section */}
      <h3>COVID-19 Info</h3>

      {/* ✅ Tested Positive aligned properly */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" , marginLeft: "40px"}}>
        <label style={{ fontSize: "16px" }}>Tested Positive?</label>
        <input
          type="checkbox"
          checked={editForm.testedPositive}
          onChange={(e) => setEditForm({ ...editForm, testedPositive: e.target.checked })}
        />
        
      </div>

      {/* Test Date */}
      <input 
        type="date"
        value={editForm.testDate ? new Date(editForm.testDate).toISOString().split('T')[0] : ""}
        onChange={(e) => setEditForm({ ...editForm, testDate: e.target.value ? new Date(e.target.value) : null })}
        placeholder="Test Date"
      />

      {/* Symptoms */}
      <input 
        type="text"
        value={editForm.symptoms}
        onChange={(e) => setEditForm({ ...editForm, symptoms: e.target.value })}
        placeholder="Symptoms (e.g. Fever, Cough)"
      />

      {/* Medical Conditions */}
      <h3>Medical History</h3>
      <input 
        type="text"
        value={editForm.medicalConditions}
        onChange={(e) => setEditForm({ ...editForm, medicalConditions: e.target.value })}
        placeholder="Medical Conditions (e.g. Asthma, Diabetes)"
      />

      {/* Insurance Info */}
      <h3>Insurance Info</h3>
      <input 
        type="text" 
        value={editForm.insuranceCompany}
        onChange={(e) => setEditForm({ ...editForm, insuranceCompany: e.target.value })}
        placeholder="Insurance Company"
      />

      <input 
        type="text" 
        value={editForm.insuranceStatus}
        onChange={(e) => setEditForm({ ...editForm, insuranceStatus: e.target.value })}
        placeholder="Coverage Status"
      />

<h3>Profile Picture</h3>

{editForm.profilePicture && (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    marginBottom: "20px" 
  }}>
    <img
      src={editForm.profilePicture}
      alt="Profile Preview"
      style={{ 
        width: "120px", 
        height: "120px", 
        borderRadius: "50%", 
        objectFit: "cover", 
        marginBottom: "10px", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)" 
      }}
    />
    <button 
      style={{ 
        marginTop: "5px", 
        padding: "6px 16px", 
        backgroundColor: "#ff4d4f", 
        color: "white", 
        border: "none", 
        borderRadius: "8px", 
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s ease"
      }}
      onClick={() => {
        setEditForm((prev) => ({
          ...prev,
          profilePicture: "", // ✅ Clear picture
        }));
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d9363e")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4f")}
    >
      Delete Image
    </button>
  </div>
)}


<input 
  type="file"
  accept="image/*"
  onChange={(e) => handleProfileImageChange(e)}
/>

      {/* Save/Cancel Buttons */}
      <div className="modal-buttons">
        <button 
          className="save-btn" 
          onClick={handleSaveProfile}
        >
          Save All
        </button>
        <button 
          className="cancel-btn" 
          onClick={() => setShowEditProfileModal(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}



  </div>
)}


{activeTab === 'doctors' && (
  <div className="doctors-tab-layout">
    {/* LEFT: Doctor Cards */}
    <div className="doctors-left">
    <h2 className="section-title">Search Doctors</h2>

  {/* 🔍 Search Input */}
  <input 
    type="text" 
    placeholder="Search by name or specialization..."
    className="search-input"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {/* 🛡️ COVID Care Checkbox */}
  <label className="checkbox-label">
    <input 
      type="checkbox" 
      checked={filterCovidCare}
      onChange={(e) => setFilterCovidCare(e.target.checked)}
    />
    Support COVID-19 Care
  </label>
    <div className="doctors-list">
  {doctors
    .filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.specialization && doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCovid = !filterCovidCare || doc.covidCare;  // Only filter if checkbox is checked

      return matchesSearch && matchesCovid;
    })
    .map((doc) => (
      <div key={doc._id} className="doctor-card">
        <img
          src={
            doc?.profilePicture && doc.profilePicture.trim() !== ""
              ? doc.profilePicture
              : defaultDoctorImage
          }
          alt="Doctor"
          className="profile-pic"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
        <div className="doctor-info">
          <h3>Dr. {doc.name}</h3>
          <div className="doctor-rating">
            ⭐ 4.5
          </div>
          <p>{doc.specialization || "General Medicine"}</p>
          <p>{doc.hospital?.name || "City Hospital"}</p>
          <p>{doc.hospital?.address || "123 Main St, Springfield"}</p>
          <small>Within 1.5 miles</small>
          <p className="latest-feedback">"Doctor was very kind..."</p>

          <div className="button-group">
            <button className="view-profile-btn" onClick={() => handleViewProfile(doc)}>
              View Profile
            </button>
            <button 
              className={`feedback-btn ${!hasVisitedDoctor(doc._id) ? "disabled" : ""}`} 
              disabled={!hasVisitedDoctor(doc._id)}
              onClick={() => handleFeedbackOpen(doc)}
            >
              Add Feedback
            </button>
            <button className="book-btn" onClick={() => handleDoctorSelect(doc)}>
              Book Appointment / View Feedback
            </button>
          </div>
        </div>
      </div>
    ))
  }

  {/* 🛑 If no doctors after filtering */}
  {doctors.length > 0 && doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.specialization && doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCovid = !filterCovidCare || doc.covidCare;

    return matchesSearch && matchesCovid;
  }).length === 0 && (
    <p style={{ textAlign: "center", marginTop: "20px", color: "gray" }}>
      No doctors found matching your search or filter.
    </p>
  )}
</div>
</div>


    {/* RIGHT: Calendar + Appointment Slots */}
    <div className="doctors-right">
  <h2>Appointments</h2>

  {selectedDoctor && (
    <>
      <h3>Dr. {selectedDoctor.name}</h3>

      {/* Calendar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <Calendar 
            onChange={handleDateChange} 
            value={selectedDate}
            minDate={new Date()}   // ✅ disables past dates
        />
      </div>

      {showCovidModal && (
  <div className="modal-overlay">
  <div className="modal-container">
    <h2 className="modal-title">COVID-19 Questionnaire</h2>

    {/* 🩺 Form Grid */}
    <div className="covid-form-grid">
      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={tempCovidForm.fever}
          onChange={(e) => setTempCovidForm({ ...tempCovidForm, fever: e.target.checked })}
        />
        Fever
      </label>

      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={tempCovidForm.cough}
          onChange={(e) => setTempCovidForm({ ...tempCovidForm, cough: e.target.checked })}
        />
        Cough
      </label>

      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={tempCovidForm.breathingDifficulty}
          onChange={(e) => setTempCovidForm({ ...tempCovidForm, breathingDifficulty: e.target.checked })}
        />
        Breathing Difficulty
      </label>

      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={tempCovidForm.contactWithCovidPatient}
          onChange={(e) => setTempCovidForm({ ...tempCovidForm, contactWithCovidPatient: e.target.checked })}
        />
        Contact with COVID-19 Patient
      </label>

      <label className="checkbox-item">
        <input
          type="checkbox"
          checked={tempCovidForm.needCovidTest}
          onChange={(e) => setTempCovidForm({ ...tempCovidForm, needCovidTest: e.target.checked })}
        />
        Need COVID Test
      </label>
    </div>

    {/* Buttons */}
    <div className="modal-buttons">
      <button className="save-btn" onClick={submitCovidForm}>
        Submit
      </button>
      <button className="cancel-btn" onClick={() => setShowCovidModal(false)}>
        Cancel
      </button>
    </div>
  </div>
</div>

)}




      {selectedDate && (
        <>
          <h3>Available Slots on {selectedDate.toDateString()}</h3>
          {availableSlots.length > 0 ? (
            <div className="slots-grid">
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
                {availableSlots.map((slot, index) => (
                <button 
                  key={index}
                  className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
                </div>
              
            </div>
          ) : (
            <p>No available slots for this day.</p>
          )}
        </>
      )}

      {selectedSlot && (
        <button className="confirm-appointment-btn" onClick={handleBookAppointmentWithCheck}>
        Confirm Appointment at {selectedSlot}
      </button>
      )}

      <button className="back-btn" onClick={() => {
        setSelectedDoctor(null);
        setSelectedSlot("");
        setSelectedDate(null);
      }}>
        Back
      </button>
    </>
  )}

<table className="appointments-table">
  <thead>
    <tr>
      <th>Doctor</th>
      <th>Date</th>
      <th>Time</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {appointments.map((app, index) => (
      <tr key={index}>
        <td>{app.doctorId?.name}</td>
        <td>{new Date(app.date).toLocaleDateString()}</td>
        <td>{app.time}</td>
        <td>{new Date(app.date) < new Date() ? "Completed" : "Upcoming"}</td>
        <td>
          <button onClick={() => handleDeleteAppointment(app._id)} className="delete-btn">
            Cancel
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

</div>

    {showProfileModal && profileDoctor && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2>Dr. {profileDoctor.name}</h2>
      <img
        src={
          profileDoctor.profilePicture && profileDoctor.profilePicture.trim() !== ""
            ? profileDoctor.profilePicture
            : defaultDoctorImage
        }
        alt="Doctor"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "10px",
        }}
      />
      <p><strong>Specialization:</strong> {profileDoctor.specialization || "General"}</p>
      <p><strong>Experience:</strong> {profileDoctor.experience || 0} years</p>
      <p><strong>Hospital:</strong> {profileDoctor.hospital?.name || "City Hospital"}</p>
      <p><strong>Address:</strong> {profileDoctor.hospital?.address || "123 Main St"}</p>
      <p><strong>COVID Care:</strong> {profileDoctor.covidCare ? "✅ Supports COVID Care" : "❌ No COVID Care"}</p>

      {/* Fake Reviews (You can replace with real reviews API later) */}
      <h3>Patient Feedback</h3>
{profileFeedbacks.length > 0 ? (
  <ul style={{ textAlign: "left" }}>
    {profileFeedbacks.map((fb, index) => (
      <li key={index}>
        ⭐ {fb.rating} - {fb.review} ({fb.patientId?.name || "Anonymous"})
      </li>
    ))}
  </ul>
) : (
  <p>No feedbacks yet.</p>
)}


      <button 
        className="back-btn"
        onClick={() => {
          setShowProfileModal(false);
          setProfileDoctor(null);
        }}
      >
        Close
      </button>
    </div>
  </div>
)}

{showFeedbackModal && selectedDoctor && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2 className="modal-title">Give Feedback for Dr. {selectedDoctor.name}</h2>

      <div className="modal-form">
        <label>Rating (1-5 stars):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={feedbackForm.rating}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
          required
        />

        <label>Comment:</label>
        <textarea
          placeholder="Write your review..."
          value={feedbackForm.comment}
          onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
          required
        />

        <div className="modal-buttons">
          <button 
            className="save-btn" 
            onClick={async () => {
              try {
                await axios.post("http://localhost:5002/api/feedback", {
                  doctorId: selectedDoctor._id,
                  patientId: id,
                  rating: feedbackForm.rating,
                  review: feedbackForm.comment,
                });
                alert("Feedback submitted successfully!");
                setShowFeedbackModal(false);
                setSelectedDoctor(null);
              } catch (error) {
                console.error("Error submitting feedback:", error);
                alert("Failed to submit feedback");
              }
            }}
          >
            Submit
          </button>

          <button className="cancel-btn" onClick={() => setShowFeedbackModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}


  </div>
)}

{activeTab === "insurance" && (
  <InsuranceTab patientId={patient._id} />
)}

{activeTab === "covid-articles" && (
  <ViewCovidArticles />
)}



        {activeTab === 'covid' && (
          <>
            <h1>COVID-19 Questionnaire</h1>
            <div className="covid-form">
              <label>
                <input
                  type="checkbox"
                  checked={covidForm.fever}
                  onChange={(e) => setCovidForm({ ...covidForm, fever: e.target.checked })}
                />
                Fever
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={covidForm.cough}
                  onChange={(e) => setCovidForm({ ...covidForm, cough: e.target.checked })}
                />
                Cough
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={covidForm.breathingDifficulty}
                  onChange={(e) => setCovidForm({ ...covidForm, breathingDifficulty: e.target.checked })}
                />
                Breathing Difficulty
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={covidForm.needCovidTest}
                  onChange={(e) => setCovidForm({ ...covidForm, needCovidTest: e.target.checked })}
                />
                Need COVID Test
              </label>

              <button className="submit-btn" onClick={handleCovidSubmit}>Submit COVID Form</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
