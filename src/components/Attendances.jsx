import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Row, Col, Card, ListGroup, Button, Badge, Form } from 'react-bootstrap';

const Attendances = () => {
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
    <Container fluid>
      <div className="shadow-sm mb-4">
        
          <h2 className="text-center mb-3">Mark Attendance</h2>
          {message && <div className="alert alert-info">{message}</div>}

          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Group controlId="dateFilter">
                <Form.Label><strong>Select Date:</strong></Form.Label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  wrapperClassName="d-block"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="courseFilter">
                <Form.Label><strong>Filter by Course:</strong></Form.Label>
                <Form.Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="All">All</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="batchFilter">
                <Form.Label><strong>Filter by Batch:</strong></Form.Label>
                <Form.Select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="All">All</option>
                  {batches.map((batch, index) => (
                    <option key={index} value={batch}>{batch}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-4">
            <h4>Summary for {moment(selectedDate).format('DD/MM/YYYY')}:</h4>
            <div>
              <Badge bg="success" className="me-2">Present: {presentCount}</Badge>
              <Badge bg="danger">Absent: {absentCount}</Badge>
            </div>
          </div>

          <ListGroup>
            {filteredStudents.map((student) => (
              <ListGroup.Item key={student._id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{student.name}</strong>
                  {student.course && (
                    <Badge bg="secondary" className="ms-2">
                      {student.course}
                    </Badge>
                  )}
                  {attendanceStatus[student._id] && (
                    <Badge
                      bg={attendanceStatus[student._id] === "Present" ? "success" : "danger"}
                      className="ms-2"
                    >
                      {attendanceStatus[student._id]}
                    </Badge>
                  )}
                </div>
                <div>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => markAttendance(student._id, "Present")}
                  >
                    Present
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mb-2"
                    onClick={() => markAttendance(student._id, "Absent")}
                  >
                    Absent
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
       
      </div>
    </Container>
  );
};

export default Attendances;