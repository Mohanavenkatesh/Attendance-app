import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeContext } from '../context/ThemeContext';

const Attendances = () => {
  const { theme } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Use Date object for react-datepicker
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admissions'); // Adjust endpoint as needed
      const data = response.data;
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);

      // Extract distinct courses and batches for the dropdown filters
      const courseList = Array.from(new Set(data.map(student => student.course).filter(Boolean)));
      const batchList = Array.from(new Set(data.map(student => student.batch).filter(Boolean)));
      setCourses(courseList);
      setBatches(batchList);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error fetching students');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update filtered students when selected course or batch changes
  useEffect(() => {
    let filtered = students;

    if (selectedCourse !== 'All') {
      filtered = filtered.filter(student => student.course === selectedCourse);
    }

    if (selectedBatch !== 'All') {
      filtered = filtered.filter(student => student.batch === selectedBatch);
    }

    setFilteredStudents(filtered);
  }, [selectedCourse, selectedBatch, students]);

  useEffect(() => {
    const fetchAttendanceForDate = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        const attendanceRecordsForDate = response.data.filter(record => {
          const recordDate = moment(record.date).format('YYYY-MM-DD');
          return recordDate === moment(selectedDate).format('YYYY-MM-DD');
        });

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

  const presentCount = filteredStudents.filter(student => attendanceStatus[student._id] === "Present").length;
  const absentCount = filteredStudents.filter(student => attendanceStatus[student._id] === "Absent").length;

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  const markAttendance = async (studentId, status) => {
    try {
      const attendanceData = { studentId, date: selectedDate, status };
      await axios.post('http://localhost:5000/api/attendance', attendanceData);
      setMessage(`Attendance marked as ${status} on ${moment(selectedDate).format('YYYY-MM-DD')}`);
      setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Error marking attendance');
    }
  };

  return (
    <div className={`container mt-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <h2 className="text-center mb-4">Mark Attendance</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mb-3">
        <div className="col-md-4 d-flex flex-column">
          <label htmlFor="dateFilter" className="form-label"><strong>Select Date:</strong></label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
        </div>
        <div className="col-md-4 d-flex flex-column">
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
        <div className="col-md-4 d-flex flex-column">
          <label htmlFor="batchFilter" className="form-label"><strong>Filter by Batch:</strong></label>
          <select
            id="batchFilter"
            className="form-select"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="All">All</option>
            {batches.map((batch, index) => (
              <option key={index} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <h4>Summary for {moment(selectedDate).format('DD/MM/YYYY')}:</h4>
        <p>
          <span className="badge bg-success me-2">Present: {presentCount}</span>
          <span className="badge bg-danger">Absent: {absentCount}</span>
        </p>
      </div>

      <ul className="list-group">
        {filteredStudents.map((student) => (
          <li
            key={student._id}
            className={`list-group-item d-flex justify-content-between align-items-center ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
          >
            <div>
              <strong>{student.name}</strong> {student.course && <span className="ms-2 badge bg-secondary">{student.course}</span>}
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