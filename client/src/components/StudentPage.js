import React, { useState } from 'react';
import './StudentPage.css'; // Importing the CSS file

const StudentPage = () => {
  const studentsAttendance = [
    {
      id:1,
      name: 'Swetha',
      monthlyAttendance: {
        March: { totalDays: 30, presentDays: 25 },
        April: { totalDays: 30, presentDays: 28 },
      },
    },
    {
      id: 2,
      name: 'Praveen',
      monthlyAttendance: {
        March: { totalDays: 30, presentDays: 15 },
        April: { totalDays: 30, presentDays: 18 },
      },
    },
    {
      id: 3,
      name: 'Ganesh',
      monthlyAttendance: {
        March: { totalDays: 30, presentDays: 30 },
        April: { totalDays: 30, presentDays: 30 },
      },
    },
    {
      id: 4,
      name: 'Apnavi',
      monthlyAttendance: {
        March: { totalDays: 30, presentDays: 20 },
        April: { totalDays: 30, presentDays: 23 },
      },
    },
    {
      id: 5,
      name: 'Gopinadh',
      monthlyAttendance: {
        March: { totalDays: 30, presentDays: 22 },
        April: { totalDays: 30, presentDays: 26 },
      },
    },
  ];

  const [studentNo, setStudentNo] = useState('');
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [attendanceDetails, setAttendanceDetails] = useState(null);

  const handleSubmit = () => {
    const student = studentsAttendance.find(
      (student) =>
        student.id === parseInt(studentNo) && student.name.toLowerCase() === name.toLowerCase()
    );

    if (student) {
      setAttendance(`${student.name}'s Attendance:`);
      setAttendanceDetails(student.monthlyAttendance);
    } else {
      setAttendance('Student not found or incorrect details.');
      setAttendanceDetails(null);
    }
  };

  return (
    <div className="student-page-container">
      <h2 className="page-heading">Search Student Attendance</h2>

      <div className="input-container">
        <label>Student Number</label>
        <input
          type="text"
          placeholder="Enter Student Number"
          value={studentNo}
          onChange={(e) => setStudentNo(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="input-container">
        <label>Student Name</label>
        <input
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
      </div>

      <button onClick={handleSubmit} className="submit-btn">
        View Attendance
      </button>

      {attendance && (
        <div className="attendance-details">
          <p className="attendance-heading">{attendance}</p>
          {attendanceDetails && (
            <div className="attendance-months">
              {Object.keys(attendanceDetails).map((month) => (
                <div className="attendance-month" key={month}>
                  <h3>{month} Attendance</h3>
                  <p>Total Days: {attendanceDetails[month].totalDays}</p>
                  <p>Present Days: {attendanceDetails[month].presentDays}</p>
                  <p>Absent Days: {attendanceDetails[month].totalDays - attendanceDetails[month].presentDays}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPage;
