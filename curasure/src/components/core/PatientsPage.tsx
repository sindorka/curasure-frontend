type PatientsPageProps = {
    patients: any[];
  };
  
  function PatientsPage({ patients }: PatientsPageProps) {
    return (
      <div className="page-container">
        <h2>👨‍👩‍👦 Patients List</h2>
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
              <th>Medical Conditions</th> {/* 🆕 Added */}
              <th>Insurance Company</th>   {/* 🆕 Added */}
              <th>Insurance Status</th>    {/* 🆕 Added */}
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((p, index) => (
                <tr key={`${p._id}-${index}`}>
                  <td>{p.name || "Unknown"}</td>
                  <td>{p.age || "N/A"}</td>
                  <td>{p.gender || "N/A"}</td>
                  <td>{p.contact || "N/A"}</td>
                  <td>{p.address || "N/A"}</td>
                  <td>{p.testedPositive !== undefined ? (p.testedPositive ? "Positive" : "Negative") : "N/A"}</td>
                  <td>{p.symptoms?.length ? p.symptoms.join(", ") : "N/A"}</td>
                  <td>{p.testDate ? new Date(p.testDate).toLocaleDateString('en-US') : "N/A"}</td>
  
                  {/* 🆕 New Data */}
                  <td>{p.medicalConditions?.length ? p.medicalConditions.join(", ") : "None"}</td>
                  <td>{p.insuranceCompany || "N/A"}</td>
                  <td>{p.insuranceStatus || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11}>No patients found.</td> {/* updated colspan to 11 */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default PatientsPage;
  