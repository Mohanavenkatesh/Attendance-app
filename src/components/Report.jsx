import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Accordion, Card, Button, useAccordionButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Report = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD')); // YYYY-MM-DD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM')); // YYYY-MM

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
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        const attendanceRecords = response.data;

        const statusObj = attendanceRecords.reduce((acc, record) => {
          if (record.studentId && record.studentId._id) {
            const id = record.studentId._id;
            const date = moment(record.date).format('YYYY-MM-DD');
            if (!acc[id]) {
              acc[id] = {};
            }
            acc[id][date] = record.status;
          }
          return acc;
        }, {});
        setAttendanceStatus(statusObj);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    fetchAttendance();
  }, []);

  const calculateAttendanceCounts = () => {
    let presentCount = 0;
    let absentCount = 0;

    filteredStudents.forEach(student => {
      if (attendanceStatus[student._id]) {
        Object.values(attendanceStatus[student._id]).forEach(status => {
          if (status === 'Present') {
            presentCount++;
          } else if (status === 'Absent') {
            absentCount++;
          }
        });
      }
    });

    return { presentCount, absentCount };
  };

  const calculateStudentAttendanceCounts = (studentId, month) => {
    let presentCount = 0;
    let absentCount = 0;

    if (attendanceStatus[studentId]) {
      Object.entries(attendanceStatus[studentId]).forEach(([date, status]) => {
        if (moment(date).format('YYYY-MM') === month) {
          if (status === 'Present') {
            presentCount++;
          } else if (status === 'Absent') {
            absentCount++;
          }
        }
      });
    }

    const totalDays = presentCount + absentCount;
    const presentPercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : 0;
    const absentPercentage = totalDays > 0 ? ((absentCount / totalDays) * 100).toFixed(2) : 0;

    return { presentCount, absentCount, presentPercentage, absentPercentage };
  };

  const { presentCount, absentCount } = calculateAttendanceCounts();

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  const markAttendance = async (studentId, status) => {
    try {
      const attendanceData = { studentId, date: new Date(selectedDate), status };
      await axios.post('http://localhost:5000/api/attendance', attendanceData);
      setMessage(`Attendance marked as ${status} on ${selectedDate}`);
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

  const getTileClassName = ({ date, view }, studentId) => {
    if (view === 'month') {
      const dateString = moment(date).format('YYYY-MM-DD');
      if (attendanceStatus[studentId] && attendanceStatus[studentId][dateString]) {
        return attendanceStatus[studentId][dateString] === 'Present' ? 'present' : 'absent';
      }
    }
    return null;
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setSelectedMonth(moment(activeStartDate).format('YYYY-MM'));
  };

  const renderPieChart = (studentId, month) => {
    const { presentCount, absentCount } = calculateStudentAttendanceCounts(studentId, month);
    const data = {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          data: [presentCount, absentCount],
          backgroundColor: ['#28a745', '#dc3545'],
        },
      ],
    };

    return <Pie data={data} />;
  };

  return (
    <div className="container mt-4">
      <h2>Mark Attendance</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mb-3">
        <div className="col-md-3">
          <label htmlFor="dateFilter" className="form-label"><strong>Select Date:</strong></label>
          <input
            type="date"
            id="dateFilter"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
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
          <h4>Summary for {selectedDate}:</h4>
          <p>
            <span className="badge bg-success me-2">Present: {presentCount}</span>
            <span className="badge bg-danger">Absent: {absentCount}</span>
          </p>
        </div>
      </div>

      <Accordion>
        {filteredStudents.map((student, index) => (
          <Card key={student._id}>
            <Card.Header>
              <CustomToggle eventKey={index.toString()} onClick={() => setSelectedStudent(student._id)}>
                {student.name}
              </CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey={index.toString()}>
              <Card.Body>
                <div className="row">
                  <div className="col-md-4">
                    <div className="calendar-container">
                      <Calendar
                        tileClassName={({ date, view }) => getTileClassName({ date, view }, student._id)}
                        onActiveStartDateChange={handleActiveStartDateChange}
                        className="custom-calendar" // Add custom class for styling
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h5>Attendance Summary for {student.name} ({selectedMonth}):</h5>
                    <p>
                      <span className="badge bg-success me-2">Present: {calculateStudentAttendanceCounts(student._id, selectedMonth).presentCount}</span>
                      <span className="badge bg-danger me-2">Absent: {calculateStudentAttendanceCounts(student._id, selectedMonth).absentCount}</span>
                      <span className="badge bg-info">Present: {calculateStudentAttendanceCounts(student._id, selectedMonth).presentPercentage}%</span>
                      <span className="badge bg-warning">Absent: {calculateStudentAttendanceCounts(student._id, selectedMonth).absentPercentage}%</span>
                    </p>
                  </div>
                  <div className="col-md-4">
                    {renderPieChart(student._id, selectedMonth)}
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

function CustomToggle({ children, eventKey, onClick }) {
  const decoratedOnClick = useAccordionButton(eventKey, onClick);

  return (
    <Button variant="link" onClick={decoratedOnClick}>
      {children}
    </Button>
  );
}

export default Report;