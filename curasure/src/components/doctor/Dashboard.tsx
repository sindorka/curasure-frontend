import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  rating: number;
  experience: number;
  available: boolean;
  profilePicture: string;
}

function DoctorDashboard() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [beds, setBeds] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        // Fetch doctor profile
        const resDoctor = await axios.get(`http://localhost:5002/api/doctor/${id}`);
        setDoctor(resDoctor.data);

        // Fetch patients assigned to this doctor
        const resPatients = await axios.get(`http://localhost:5002/api/doctor/${id}/patients`);
        setPatients(resPatients.data);

        // Fetch hospital beds availability
        if (resDoctor.data.hospital) {
          const resBeds = await axios.get(`http://localhost:5002/api/hospital-beds/${resDoctor.data.hospital}`);
          setBeds(resBeds.data);
        }
      } catch (error) {
        console.error("Error loading doctor dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (!doctor) {
    return <div>Doctor profile not found.</div>;
  }

  return (
    <div className="doctor-dashboard">
      <h1>Welcome, Dr. {doctor.name}</h1>
      <img src={doctor.profilePicture} alt="Doctor" width="150" style={{ borderRadius: "50%" }} />
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Hospital:</strong> {doctor.hospital}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
      <p><strong>Available:</strong> {doctor.available ? "Yes" : "No"}</p>

      <hr />

      <h2>Patient List</h2>
      {patients.length > 0 ? (
        <ul>
          {patients.map(patient => (
            <li key={patient._id}>
              {patient.name} - COVID Symptoms: {patient.hasSymptoms ? "Yes" : "No"} | Test Requested: {patient.wantsTest ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients assigned yet.</p>
      )}

      <hr />

      <h2>Hospital Bed Status</h2>
      {beds ? (
        <div>
          <p><strong>Total Beds:</strong> {beds.totalBeds}</p>
          <p><strong>Available Beds:</strong> {beds.availableBeds}</p>
        </div>
      ) : (
        <p>Hospital bed data not available.</p>
      )}
    </div>
  );
}

export default DoctorDashboard;
