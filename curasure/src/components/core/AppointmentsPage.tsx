// components/doctor/AppointmentsPage.tsx

type AppointmentsPageProps = {
    appointments: any[];
  };
  
  function AppointmentsPage({ appointments }: AppointmentsPageProps) {
    return (
      <div className="page-container">
        <h2>📅 Appointments</h2>
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a, index) => (
                <tr key={`${a._id}-${index}`}>
                  <td>{a.patientId?.name || 'Unknown'}</td>
  
                  {/* 📅 Format Date in Long Style like April 5, 2025 */}
                  <td>{a.date ? new Date(a.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
  
                  <td>{a.status || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default AppointmentsPage;
  