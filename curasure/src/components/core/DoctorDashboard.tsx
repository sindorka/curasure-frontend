import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./DoctorDashboard.css";
import defaultDoctorImage from "../../assets/default.png";

import ChatWindow from './ChatWindow';
import socket from '../utils/socket';
import DoctorChatInbox from './DoctorChatInbox';
import DoctorGroupChat from './DoctorGroupChat';



function DoctorDashboard() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bedInfo, setBedInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmitting, setIsAdmitting] = useState(false);
  const [admittedPatients, setAdmittedPatients] = useState<string[]>([]);
  const [chatPatients, setChatPatients] = useState<any[]>([]);
  const [selectedChatPatient, setSelectedChatPatient] = useState<any | null>(null);
  const [doctorId, setDoctorId] = useState<string>(""); // you'll set this from route or token
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [medicalConditionsInput, setMedicalConditionsInput] = useState('');
  const [insuranceCompanyInput, setInsuranceCompanyInput] = useState('');
  const [insuranceStatusInput, setInsuranceStatusInput] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    specialization: '',
    experience: 0,
    available: true,
    covidCare: false,
    profilePicture: '',
  });

  // Open Modal with Pre-filled Data
  const openEditProfileModal = () => {
    setEditForm({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || 0,
      available: doctor.available || false,
      covidCare: doctor.covidCare || false,
      profilePicture: doctor.profilePicture || '',  // ✅ ADD THIS LINE
    });
    setShowEditModal(true);
  };

  const handleDoctorUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5002/api/doctor/edit/${doctor._id}`, {
        name: editForm.name,
        specialization: editForm.specialization,
        experience: editForm.experience,
        available: editForm.available,
        covidCare: editForm.covidCare,
        hospital: doctor.hospital?._id,
        rating: doctor.rating || 0,
        profilePicture: editForm.profilePicture,  // ✅ FIX HERE
      });

      toast.success("Doctor profile updated successfully!");
      setShowEditModal(false);
      window.location.reload();  // quick reload after update
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      toast.error("Failed to update doctor profile");
    }
  };



  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🏥 1. Get Doctor Profile
        const doctorRes = await axios.get(`http://localhost:5002/api/doctor/${id}`);
        const doctorData = doctorRes.data.doctor;
        setDoctor(doctorData);
        setDoctorId(doctorData._id); // ✅ set doctorId here

        // 🧑‍⚕️ 2. Get Doctor's Full Appointments
        const appointmentsListRes = await axios.get(`http://localhost:5002/api/appointments/list/${id}`);
        const appointments = appointmentsListRes.data.appointments;
        setAppointments(appointments);

        // 🧠 3. Fetch Full Patient Info from Appointments
        const fullPatients = await Promise.all(
          appointments.map(async (appointment: any) => {
            const res = await axios.get(`http://localhost:5002/api/patient/${appointment.patientId._id}/full-details`);
            return res.data.patient;
          })
        );

        setPatients(fullPatients);          // ✅ for Patients tab
        setChatPatients(fullPatients);      // ✅ for Chat tab
        console.log("💬 Chat Patients:", fullPatients);

        // 🛏️ 4. Bed info
        if (doctorData.hospital && doctorData.hospital._id) {
          const bedRes = await axios.get(`http://localhost:5002/api/hospital-beds/${doctorData.hospital._id}`);
          setBedInfo(bedRes.data);
        }

        // 🔗 5. Socket connection after doctorId available
        socket.connect();
        socket.emit("register", doctorData._id);
      } catch (error) {
        console.error("❌ Error fetching doctor dashboard:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchDashboardData();

    // ✅ Disconnect socket on cleanup
    return () => {
      socket.disconnect();
    };
  }, [id]);


  const handleBedUpdate = async (change: number, patientId: string) => {
    if (!doctor?.hospital?._id) return;

    try {
      setIsAdmitting(true);

      const res = await axios.put(`http://localhost:5002/api/hospital-beds/${doctor.hospital._id}/update`, { change });
      const updatedBeds = res.data.updatedBeds;

      setBedInfo((prev: any) => ({
        ...prev,
        availableBeds: updatedBeds,
      }));

      toast.success(`Patient admitted successfully! 🛏️ Beds Remaining: ${updatedBeds}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      // ✅ Mark patient as admitted (only if it's not the hospital-level button)
      if (patientId !== 'hospital') {
        setAdmittedPatients((prev) => [...prev, patientId]);
      }

    } catch (error) {
      console.error("Error updating bed availability:", error);
      toast.error("Failed to admit patient. Try again!", {
        position: "top-center",
      });
    } finally {
      setIsAdmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };




  if (loading) return <div className="loading">Loading doctor dashboard...</div>;
  if (!doctor) return <div className="error">Doctor not found.</div>;
  console.log("Doctor profile picture ->", doctor?.profilePicture);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div
          className="sidebar-logo"
          style={{ cursor: 'pointer' }}
        >
          CuraSure
        </div>
        <nav>
          <button onClick={() => setActiveTab('home')}>Home</button>
          <button onClick={() => setActiveTab('patients')}>Patients</button>
          <button onClick={() => setActiveTab('appointments')}>Appointments</button>
          <button onClick={() => setActiveTab('chat')}>Chat</button>
          <button onClick={() => setActiveTab('group-chat')}>Group Chat</button>
          <div className="logout-section">
            <div className="logout-divider"></div>
            <button className="logout-button" onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              navigate("/");
              window.location.reload();
            }}>
              <img
                src="https://w7.pngwing.com/pngs/951/367/png-transparent-close-exit-logout-power-glyphs-icon.png"
                alt="Logout Icon"
                className="logout-icon"
              />Logout</button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'chat' && doctor && (
          <div className="page-container">
            <h2>💬 Chat with Patients</h2>
            <div className="chat-section" style={{ display: 'flex', height: '70vh' }}>
              <DoctorChatInbox
                users={chatPatients}
                onSelectUser={setSelectedChatPatient}
                selectedUserId={selectedChatPatient?._id || null}
              />
              {selectedChatPatient && (
                <ChatWindow
                  currentUserId={doctorId}
                  selectedUser={selectedChatPatient}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'group-chat' && doctorId && (
          <div className="page-container">
            <DoctorGroupChat doctorId={doctorId} />
          </div>
        )}
        {activeTab === 'home' && (
          <>
            <h1>Welcome, Dr. {doctor.name}.</h1>

            <div className="cards-section">
              {/* Doctor Profile Card */}
              <div className="card">
                <h2>Dr. {doctor.name}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>

                  <img
                    src={
                      doctor?.profilePicture && doctor.profilePicture.trim() !== ""
                        ? doctor.profilePicture
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

                </div>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience} years</p>
                <p><strong>Available:</strong> {doctor.available ? "✅ Yes" : "❌ No"}</p>
                <p><strong>COVID Care:</strong> {doctor.covidCare ? "🟢 Supports COVID Care" : "🔴 No COVID Support"}</p>
                <button
                  className="edit-profile-btn"
                  onClick={openEditProfileModal}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Edit Profile
                </button>
              </div>
              {showEditModal && (
                <div className="modal-overlay">
                  <div className="modal-container">
                    <h2 className="modal-title">Edit Profile</h2>
                    <img
                      src={
                        editForm.profilePicture && editForm.profilePicture.trim() !== ""
                          ? editForm.profilePicture
                          : defaultDoctorImage
                      }
                      alt="Doctor Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        marginTop: '10px',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}
                    />
                    <div className="modal-form">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />


                      <label>Specialization:</label>
                      <input
                        type="text"
                        value={editForm.specialization}
                        onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                      />

                      <label>Experience (Years):</label>
                      <input
                        type="number"
                        value={editForm.experience}
                        onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) })}
                      />

                      <label>Available:</label>
                      <select
                        value={editForm.available ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, available: e.target.value === "true" })}
                      >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                      </select>

                      <label>COVID Care Support:</label>
                      <select
                        value={editForm.covidCare ? "true" : "false"}
                        onChange={(e) => setEditForm({ ...editForm, covidCare: e.target.value === "true" })}
                      >
                        <option value="true">Supports COVID Care</option>
                        <option value="false">No COVID Care</option>
                      </select>

                      <label>Profile Picture:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {editForm.profilePicture && (
                        <img
                          src={editForm.profilePicture}
                          alt="Uploaded Preview"
                          style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }}
                        />
                      )}

                      <div className="modal-buttons">
                        <button className="save-btn" onClick={handleDoctorUpdate}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditForm({ ...editForm, profilePicture: "" })}>Delete Image</button>
                        <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hospital Info Card */}
              {doctor.hospital && (
                <div className="card">
                  <h2>🏥 Hospital Info</h2>
                  <p><strong>Name:</strong> {doctor.hospital.name}</p>
                  <p><strong>Address:</strong> {doctor.hospital.address}</p>
                  <p><strong>Contact:</strong> {doctor.hospital.contactNumber}</p>
                  <p><strong>COVID Support:</strong> {doctor.hospital.covidCareSupport ? "✅ Yes" : "❌ No"}</p>
                </div>
              )}

              {/* Hospital Bed Info */}
              {bedInfo && (
                <div className="card">
                  <h2>🛏️ Hospital Bed Availability</h2>
                  <p><strong>Total Beds:</strong> {bedInfo.totalBeds}</p>
                  <p><strong>Available Beds:</strong> {bedInfo.availableBeds}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="page-container">
            <h2>👨‍👩‍👦 Patients' List</h2>
            <div className="table-wrapper">
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>COVID Status</th>
                    <th>Symptoms</th>
                    <th>Test Date</th>
                    <th>Medical Conditions</th>
                    <th>Insurance Company</th>
                    <th>Insurance Status</th>
                    <th>Actions</th> {/* 🆕 */}
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((p, index) => (
                      <tr
                        key={`${p._id}-${index}`}
                        style={{
                          backgroundColor: p.testedPositive ? "#ffe5e5" : "transparent", // Light red if COVID positive
                        }}
                      >
                        <td>{p.name || "Unknown"}</td>
                        <td>{p.age || "Not Specified"}</td>
                        <td>{p.gender || "N/A"}</td>
                        <td>{p.contact || "N/A"}</td>
                        <td>{p.address || "N/A"}</td>
                        <td>{p.testedPositive !== undefined ? (p.testedPositive ? "Positive" : "Negative") : "N/A"}</td>
                        <td>{p.symptoms?.length ? p.symptoms.join(", ") : "N/A"}</td>
                        <td>{p.testDate ? new Date(p.testDate).toLocaleDateString('en-US') : "N/A"}</td>
                        <td>{p.medicalConditions?.length ? p.medicalConditions.join(", ") : "None"}</td>
                        <td>{p.insuranceCompany || "N/A"}</td>
                        <td>{p.insuranceStatus || "N/A"}</td>
                        <td>
                          {/* Critical Admit Button */}
                          {p.testedPositive && bedInfo?.availableBeds > 0 && (
                            <button
                              className="admit-btn"
                              onClick={() => handleBedUpdate(-1, p._id)}
                              disabled={admittedPatients.includes(p._id) || bedInfo?.availableBeds <= 0}
                              style={{
                                backgroundColor: admittedPatients.includes(p._id) ? "green" : undefined
                              }}
                            >
                              {admittedPatients.includes(p._id) ? "Discharge" : "Critical Admit"}
                            </button>

                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={12}>No patients yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'appointments' && (
          <div className="page-container">
            <h2>📅 Appointments</h2>
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((a, index) => (
                    <tr key={`${a._id}-${index}`}>
                      <td>{a.patientId?.name || "Unknown"}</td>
                      <td>{a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A"}</td>
                      <td>{a.time || "N/A"}</td>
                      <td>{a.status || "Scheduled"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4}>No appointments yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
