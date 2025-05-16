import React, { useState } from 'react';
import { FaChalkboardTeacher, FaUsers, FaChartBar, FaPlusCircle, FaCalendarAlt, FaCog, FaTrash } from 'react-icons/fa';
import './StaffPage.css';
import { submitAttendance } from '../api/attendance'; // adjust path as needed

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AttendanceCircles = ({ presentCount, absentCount, totalStudents }) => {
  const presentPercent = totalStudents ? (presentCount / totalStudents) * 100 : 0;
  const absentPercent = totalStudents ? (absentCount / totalStudents) * 100 : 0;

  return (
    <div className="attendance-circles">
      <div className="circle-ring">
        <div
          className="ring present-ring"
          style={{ background: `conic-gradient(green ${presentPercent}%, #e0e0e0 ${presentPercent}%)` }}
        >
          <div className="inner-circle">
            <div className="label">Present</div>
            <div className="value">{presentCount}</div>
          </div>
        </div>
      </div>
      <div className="circle-ring">
        <div
          className="ring absent-ring"
          style={{ background: `conic-gradient(red ${absentPercent}%, #e0e0e0 ${absentPercent}%)` }}
        >
          <div className="inner-circle">
            <div className="label">Absent</div>
            <div className="value">{absentCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};



const StaffPage = () => {
  // State for classes and sections
  const [classes, setClasses] = useState([
    { id: 1, name: 'Class 10', sections: ['A', 'B'] },
    { id: 2, name: 'Class 11', sections: ['A', 'B', 'C'] },
    { id: 3, name: 'Class 12', sections: ['A'] }
  ]);
  
  // State for students (grouped by class and section)
  const [students, setStudents] = useState({
    'Class 10': {
      'A': [
        { id: 1, name: 'Swetha',rollNo:"A101", present: false },
        { id: 2, name: 'Praveen',rollNo:"A102", present: false }
      ],
      'B': [
        { id: 3, name: 'Ganesh',rollNo:3, present: false },
        { id: 4, name: 'Apnavi',rollNo:4, present: false }
      ]
    },
    'Class 11': {
      'A': [
        { id: 5, name: 'Gopinadh',rollNo:5, present: false },
        { id: 6, name: 'Vinay',rollNo:6, present: false }
      ],
      'B': [
        { id: 7, name: 'Sandy',rollNo:7, present: false },
        { id: 8, name: 'Sandhya',rollNo:8, present: false }
      ],
      'C': [
        { id: 9, name: 'Vicek',rollNo:9, present: false }
      ]
    },
    'Class 12': {
      'A': [
        { id: 10, name: 'Vikram',rollNo:10, present: false },
        { id: 11, name: 'Anusha',rollNo:11, present: false }
      ]
    }
  });

  // Form states
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRollNo, setNewStudentRollNo] = useState('');

  const [activeTab, setActiveTab] = useState('reports');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Get sections for selected class
  const getSectionsForClass = (className) => {
    const classObj = classes.find(c => c.name === className);
    return classObj ? classObj.sections : [];
  };

  // Handle class selection change
  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    setSelectedSection('');
  };

  // Toggle attendance status
  const toggleAttendance = (studentId) => {
    setStudents(prev => {
      const updated = { ...prev };
      for (const className in updated) {
        for (const section in updated[className]) {
          updated[className][section] = updated[className][section].map(student =>
            student.id === studentId ? { ...student, present: !student.present } : student
          );
        }
      }
      return updated;
    });
  };

  // Submit attendance
  const handleSubmitAttendance = () => {
    const attendanceData = {
      date,
      className: selectedClass,
      section: selectedSection,
      students: students[selectedClass]?.[selectedSection] || []
    };
  
    submitAttendance(attendanceData)
      .then(() => {
        alert(`Attendance for ${selectedClass}-${selectedSection} on ${date} submitted!`);
      })
      .catch((err) => {
        alert(`Error submitting attendance: ${err.message}`);
      });
  };
  
  // Add new class
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName) return;

    const newClass = {
      id: classes.length + 1,
      name: newClassName,
      sections: []
    };

    setClasses([...classes, newClass]);
    setStudents({
      ...students,
      [newClassName]: {}
    });

    setNewClassName('');
  };

  // Add new section to class
  const handleAddSection = (e) => {
    e.preventDefault();
    if (!selectedClass || !newSectionName) return;

    setClasses(classes.map(cls =>
      cls.name === selectedClass
        ? { ...cls, sections: [...cls.sections, newSectionName] }
        : cls
    ));

    setStudents({
      ...students,
      [selectedClass]: {
        ...students[selectedClass],
        [newSectionName]: []
      }
    });

    setNewSectionName('');
  };

  // Add new student to class section
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSection || !newStudentName) return;

    const newStudent = {
      id: Date.now(), // Using timestamp as temporary ID
      name: newStudentName,
      rollNo: newStudentRollNo,
      present: false
    };

    setStudents({
      ...students,
      [selectedClass]: {
        ...students[selectedClass],
        [selectedSection]: [...students[selectedClass][selectedSection], newStudent]
      }
    });

    setNewStudentName('');
  };

  // Delete student
  const handleDeleteStudent = (studentId) => {
    if (!selectedClass || !selectedSection) return;

    setStudents({
      ...students,
      [selectedClass]: {
        ...students[selectedClass],
        [selectedSection]: students[selectedClass][selectedSection].filter(s => s.id !== studentId)
      }
    });
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'mark-attendance':
        return (
          <div className="content-section">
            <h2>Mark Attendance</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select 
                  value={selectedClass} 
                  onChange={handleClassChange}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedClass}
                >
                  <option value="">Select Section</option>
                  {getSectionsForClass(selectedClass).map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedClass && selectedSection && (
              <>
                <div className="attendance-table-container">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Present</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students[selectedClass]?.[selectedSection]?.map((student) => (
                        <tr key={student.id}>
                          <td>{student.rollNo}</td>
                          <td>{student.name}</td>
                          <td>
        <input 
          className="checkbox"
          checked={student.present}
          onChange={() => toggleAttendance(student.id)}
        />
      </td>
    </tr>
  ))}
</tbody>
                  </table>
                </div>
                <button 
                  className="submit-btn" 
                  onClick={handleSubmitAttendance}
                >
                  Submit Attendance
                </button>
              </>
            )}
          </div>
        );

 
      case 'manage-students':
        return (
          <div className="content-section">
            <h2>Manage Students</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Class</label>
                <select 
                  value={selectedClass} 
                  onChange={handleClassChange}
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Section</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedClass}
                >
                  <option value="">Select Section</option>
                  {getSectionsForClass(selectedClass).map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

            </div>
            
            {selectedClass && selectedSection && (
              <>
                <form onSubmit={handleAddStudent} className="add-form">
  <div className="form-group">
    <label>Add New Student</label>
    <div className="input-with-button">
      <input 
        type="text" 
        placeholder="Roll No." 
        value={newStudentRollNo}
        onChange={(e) => setNewStudentRollNo(e.target.value)}
        style={{ marginRight: '8px' }}
      />
      <input 
        type="text" 
        placeholder="Student name" 
        value={newStudentName}
        onChange={(e) => setNewStudentName(e.target.value)}
      />
      <button type="submit" className="add-btn">
        Add
      </button>
    </div>
  </div>
</form>

                
                <div className="students-list">
                  <h3>Students in {selectedClass}-{selectedSection}</h3>
                  <table className="students-table">
                    <thead>
                      <tr>

                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students[selectedClass]?.[selectedSection]?.map((student) => (
                        <tr key={student.id}>

                          <td>{student.rollNo}</td>
                          <td>{student.name}</td>
                          <td>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
        
      case 'manage-classes':
        return (
          <div className="content-section">
            <h2>Manage Classes & Sections</h2>
            
            <div className="forms-container">
            <form onSubmit={handleAddClass} className="add-form">
  <div className="form-group">
    <h3>Add New Class</h3>
    <div className="input-with-button">
      <input 
        type="text" 
        placeholder="e.g., Class 9" 
        value={newClassName}
        onChange={(e) => setNewClassName(e.target.value)}
      />
      <button type="submit" className="add-btn" disabled={!newClassName}>
        Add Class
      </button>
    </div>
  </div>
</form>
              
              
<form onSubmit={handleAddSection} className="add-form">
  <h3>Add Section to Class</h3>
  <div className="form-row">
    <div className="form-group">
      <label>Class</label>
      <select 
        value={selectedClass} 
        onChange={handleClassChange}
      >
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.id} value={cls.name}>{cls.name}</option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label>New Section</label>
      <div className="input-with-button">
        <input 
          type="text" 
          placeholder="e.g., A" 
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          disabled={!selectedClass}
        />
        <button 
          type="submit" 
          className="add-btn"
          disabled={!selectedClass || !newSectionName}
        >
          Add Section
        </button>
      </div>
    </div>
  </div>
</form>
     
            </div>
            
            <div className="classes-list">
              <h3>Existing Classes & Sections</h3>
              <div className="classes-grid">
                {classes.map(cls => (
                  <div key={cls.id} className="class-card">
                    <h4>{cls.name}</h4>
                    <div className="sections-list">
                      {cls.sections.length > 0 ? (
                        cls.sections.map(section => (
                          <span key={section} className="section-badge">
                            {section}
                          </span>
                        ))
                      ) : (
                        <p>No sections yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
        case 'reports':
          return (
            <div className="content-section">
              <h2>Attendance Reports</h2>
              <div className="reports-container">
                {classes.map((cls) => {
                  const sectionReports = cls.sections.map((section) => {
                    const sectionStudents = students[cls.name]?.[section] || [];
                    const presentCount = sectionStudents.filter(s => s.present).length;
                    const absentCount = sectionStudents.length - presentCount;
        
                    return (
                      <div key={section} className="section-report">
                        <h4>{section} Section</h4>
        
                        <div className="attendance-summary-and-chart">
                          <div className="attendance-summary">
                            <p>Total Present: {presentCount}</p>
                            <p>Total Absent: {absentCount}</p>
                            <p>Attendance Percentage: {Math.round((presentCount / sectionStudents.length) * 100)}%</p>
                          </div>
        
                          {/* Attendance Circles */}
                          <AttendanceCircles 
                            presentCount={presentCount} 
                            absentCount={absentCount} 
                            totalStudents={sectionStudents.length} 
                          />
                        </div>
                      </div>
                    );
                  });
        
                  return (
                    <div key={cls.id} className="report-card">
                      <h3>{cls.name} Attendance Report</h3>
                      <div className="section-reports">
                        {sectionReports}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        
                
                  

          
                        
            
        
        default:
            return (
              <div className="content-section">
                <h2>Staff Dashboard</h2>
                <p>Select an option from the sidebar to get started.</p>
              </div>
            );
        }
      };
    
      return (
        <div className="staff-page-container">
          <div className="sidebar">
            <div className="sidebar-header">
              <FaChalkboardTeacher className="sidebar-icon" />
              <h3>Staff Portal</h3>
            </div>
            <ul className="sidebar-menu">
            <li 
                className={activeTab === 'reports' ? 'active' : ''}
                onClick={() => setActiveTab('reports')}
              >
                <FaChartBar className="menu-icon" />
                <span>Reports</span>
              </li>
              <li 
                className={activeTab === 'mark-attendance' ? 'active' : ''}
                onClick={() => setActiveTab('mark-attendance')}
              >
                <FaCalendarAlt className="menu-icon" />
                <span>Mark Attendance</span>
              </li>
              <li 
                className={activeTab === 'manage-students' ? 'active' : ''}
                onClick={() => setActiveTab('manage-students')}
              >
                <FaUsers className="menu-icon" />
                <span>Manage Students</span>
              </li>
              <li 
                className={activeTab === 'manage-classes' ? 'active' : ''}
                onClick={() => setActiveTab('manage-classes')}
              >
                <FaPlusCircle className="menu-icon" />
                <span>Manage Classes</span>
              </li>
              
              <li>
                <FaCog className="menu-icon" />
                <span>Settings</span>
              </li>
            </ul>
          </div>
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      );
    };
    
    export default StaffPage;
    
        
        
    
    
    
    
    
    
    