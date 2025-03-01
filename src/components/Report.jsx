import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Accordion, Card, Button, useAccordionButton, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Report = () => {
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
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));

  // Fetch Students Data
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admissions');
      const data = response.data;
      setStudents(data);
      setFilteredStudents(data);

      // Extract distinct courses and batches
      const courseList = Array.from(new Set(data.map(student => student.course).filter(Boolean)));
      const batchList = Array.from(new Set(data.map(student => student.batch).filter(Boolean)));
      setCourses(courseList);
      setBatches(batchList);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Attendance Data
  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/attendance');
      const attendanceRecords = response.data;

      const statusObj = attendanceRecords.reduce((acc, record) => {
        if (record.studentId?._id) {
          const id = record.studentId._id;
          const date = moment(record.date).format('YYYY-MM-DD');
          if (!acc[id]) acc[id] = {};
          acc[id][date] = record.status;
        }
        return acc;
      }, {});
      setAttendanceStatus(statusObj);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  // Filter Students by Course and Batch
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

  // Calculate Attendance Counts for Selected Date
  const calculateAttendanceCountsForDate = (date) => {
    let presentCount = 0;
    let absentCount = 0;

    filteredStudents.forEach(student => {
      if (attendanceStatus[student._id] && attendanceStatus[student._id][date]) {
        if (attendanceStatus[student._id][date] === 'Present') presentCount++;
        else if (attendanceStatus[student._id][date] === 'Absent') absentCount++;
      }
    });

    return { presentCount, absentCount };
  };

  const { presentCount, absentCount } = calculateAttendanceCountsForDate(moment(selectedDate).format('YYYY-MM-DD'));

  // Calculate Student Attendance Counts for a Specific Month
  const calculateStudentAttendanceCounts = (studentId, month) => {
    let presentCount = 0;
    let absentCount = 0;

    if (attendanceStatus[studentId]) {
      Object.entries(attendanceStatus[studentId]).forEach(([date, status]) => {
        if (moment(date).format('YYYY-MM') === month) {
          if (status === 'Present') presentCount++;
          else if (status === 'Absent') absentCount++;
        }
      });
    }

    const totalDays = presentCount + absentCount;
    const presentPercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : 0;
    const absentPercentage = totalDays > 0 ? ((absentCount / totalDays) * 100).toFixed(2) : 0;

    return { presentCount, absentCount, presentPercentage, absentPercentage };
  };

  // Mark Attendance
  const markAttendance = async (studentId, status) => {
    try {
      const attendanceData = { studentId, date: selectedDate, status };
      await axios.post('http://localhost:5000/api/attendance', attendanceData);
      setMessage(`Attendance marked as ${status} on ${moment(selectedDate).format('YYYY-MM-DD')}`);
      setAttendanceStatus(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [moment(selectedDate).format('YYYY-MM-DD')]: status,
        },
      }));
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Error marking attendance');
    }
  };

  // Get Tile Class Name for Calendar
  const getTileClassName = ({ date, view }, studentId) => {
    if (view === 'month') {
      const dateString = moment(date).format('YYYY-MM-DD');
      if (attendanceStatus[studentId]?.[dateString]) {
        return attendanceStatus[studentId][dateString] === 'Present' ? 'present' : 'absent';
      }
    }
    return null;
  };

  // Handle Active Start Date Change for Calendar
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setSelectedMonth(moment(activeStartDate).format('YYYY-MM'));
  };

  // Render Pie Chart for Student Attendance
  const renderPieChart = (studentId, month) => {
    const { presentCount, absentCount } = calculateStudentAttendanceCounts(studentId, month);
    const data = {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          data: [presentCount, absentCount],
          backgroundColor: ['#A45EE5', '#757575'], // Updated colors
        },
      ],
    };

    return <Pie data={data} />;
  };

  // Loading and Error States
  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Mark Attendance</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="dateFilter" className="form-label"><strong>Select Date:</strong></label>
          <Form.Group controlId="dateFilter">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              wrapperClassName="d-block"
            />
          </Form.Group>
        </div>
        <div className="col-md-3">
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
        <div className="col-md-3">
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
        <div className="col-md-3">
          <h4>Summary for {moment(selectedDate).format('YYYY-MM-DD')}:</h4>
          <p>
            <span className="badge" style={{ backgroundColor: '#A45EE5' }}>Present: {presentCount}</span>
            <span className="badge ms-2" style={{ backgroundColor: '#757575' }}>Absent: {absentCount}</span>
          </p>
        </div>
      </div>

      <Accordion>
        {filteredStudents.map((student, index) => (
          <div key={student._id}>
           
              <CustomToggle className eventKey={index.toString()} onClick={() => setSelectedStudent(student._id)}>
                {student.name}
              </CustomToggle>
           
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>
                <div className="row">
                  <div className="col-md-4">
                    <div className="calendar-container">
                      <Calendar
                        tileClassName={({ date, view }) => getTileClassName({ date, view }, student._id)}
                        onActiveStartDateChange={handleActiveStartDateChange}
                        className="custom-calendar"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h5>Attendance Summary for {student.name} ({selectedMonth}):</h5>
                    <p>
                      <span className="badge" style={{ backgroundColor: '#A45EE5' }}>Present: {calculateStudentAttendanceCounts(student._id, selectedMonth).presentCount}</span>
                      <span className="badge ms-2" style={{ backgroundColor: '#757575' }}>Absent: {calculateStudentAttendanceCounts(student._id, selectedMonth).absentCount}</span>
                      <span className="badge ms-2" style={{ backgroundColor: '#CF9CFF' }}>Present: {calculateStudentAttendanceCounts(student._id, selectedMonth).presentPercentage}%</span>
                      <span className="badge ms-2" style={{ backgroundColor: '#D9DD9' }}>Absent: {calculateStudentAttendanceCounts(student._id, selectedMonth).absentPercentage}%</span>
                    </p>
                  </div>
                  <div className="col-md-4">
                    {renderPieChart(student._id, selectedMonth)}
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </div>
        ))}
      </Accordion>
    </div>
  );
};

// Custom Toggle Component for Accordion
function CustomToggle({ children, eventKey, onClick }) {
  const decoratedOnClick = useAccordionButton(eventKey, onClick);

  return (
    <Button variant="link" onClick={decoratedOnClick}>
      {children}
    </Button>
  );
}

export default Report;