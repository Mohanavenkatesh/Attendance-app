import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Attendances = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // YYYY-MM-DD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // Attendance status for the current selected date.
  // Format: { studentId: "Present" | "Absent" }
  const [attendanceStatus, setAttendanceStatus] = useState({});

  // Fetch admissions (students)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admissions'); // Adjust endpoint as needed
        const data = response.data;
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
        // Extract distinct courses for the dropdown filter
        const courseList = Array.from(new Set(data.map(student => student.course).filter(Boolean)));
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Update filtered students when selected course changes
  useEffect(() => {
    if (selectedCourse === 'All') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(student => student.course === selectedCourse));
    }
  }, [selectedCourse, students]);

  // Fetch attendance records for the selected date so that stored data is shown on refresh
  useEffect(() => {
    const fetchAttendanceForDate = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        // Filter records that match the selected date (compare only YYYY-MM-DD)
        const attendanceRecordsForDate = response.data.filter(record => {
          const recordDate = moment(record.date).format('YYYY-MM-DD');
          return recordDate === selectedDate;
        });
        // Group records by studentId using reduce.
        // For each student, if any record is "Present", mark that student as Present.
        const statusObj = attendanceRecordsForDate.reduce((acc, record) => {
          if (record.studentId && record.studentId._id) {
            const id = record.studentId._id;
            if (!acc[id]) {
              acc[id] = record.status;
            } else {
              if (acc[id] === 'Absent' && record.status === 'Present') {
                acc[id] = 'Present';
              }
            }
          }
          return acc;
        }, {});
        setAttendanceStatus(statusObj);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    fetchAttendanceForDate();
  }, [selectedDate]);

  // Calculate summary counts for the selected date
  const presentCount = Object.values(attendanceStatus).filter(status => status === "Present").length;
  const absentCount = Object.values(attendanceStatus).filter(status => status === "Absent").length;

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  // Mark attendance and update backend and local state
  const markAttendance = async (studentId, status) => {
    try {
      // Use the selectedDate so that the record is stored for the chosen day
      const attendanceData = { studentId, date: new Date(selectedDate), status };
      await axios.post('http://localhost:5000/api/attendance', attendanceData);
      setMessage(`Attendance marked as ${status} on ${selectedDate}`);
      // Update local attendanceStatus so the summary reflects the new status accurately.
      setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Error marking attendance');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mark Attendance</h2>
      {message && <div className="alert alert-info">{message}</div>}
      
      {/* Date Filter */}
      <div className="mb-3">
        <label htmlFor="dateFilter" className="form-label"><strong>Select Date:</strong></label>
        <input
          type="date"
          id="dateFilter"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Course Filter Dropdown */}
      <div className="mb-3">
        <label htmlFor="courseFilter" className="form-label"><strong>Filter by Course:</strong></label>
        <select
          id="courseFilter"
          className="form-select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="All">All</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>
      </div>

      {/* Summary Section */}
      <div className="mb-3">
        <h4>Summary for {selectedDate}:</h4>
        <p>
          <span className="badge bg-success me-2">Present: {presentCount}</span>
          <span className="badge bg-danger">Absent: {absentCount}</span>
        </p>
      </div>
      
      <ul className="list-group">
        {filteredStudents.map((student) => (
          <li
            key={student._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              {student.name} {student.course && <span className="ms-2 badge bg-secondary">{student.course}</span>}
              {attendanceStatus[student._id] && (
                <span 
                  className={`badge ms-2 ${attendanceStatus[student._id] === "Present" ? "bg-success" : "bg-danger"}`}
                >
                  {attendanceStatus[student._id]}
                </span>
              )}
            </div>
            <div>
              <button
                onClick={() => markAttendance(student._id, "Present")}
                className="btn btn-success me-2 mb-2"
              >
                Present
              </button>
              <button
                onClick={() => markAttendance(student._id, "Absent")}
                className="btn btn-danger mb-2"
              >
                Absent
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attendances;