import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import moment from 'moment';

ChartJS.register(ArcElement, Tooltip, Legend);

// StudentDetail: shows a student's attendance with accurate present/absent counts and a pie chart.
const StudentDetail = () => {
  const { studentId } = useParams();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/attendance?studentId=${studentId}`);
        setAttendanceRecords(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student attendance:', err);
        setError('Error fetching student attendance');
        setLoading(false);
      }
    };

    fetchStudentAttendance();
  }, [studentId]);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }
  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  // Group attendance records by local day using Moment.js.
  // For each day, if any record is "Present", mark that day as Present.
  const groupedByDay = attendanceRecords.reduce((acc, record) => {
    const day = moment(record.date).format('YYYY-MM-DD');
    if (!acc[day]) {
      acc[day] = record.status;
    } else {
      if (acc[day] === 'Absent' && record.status === 'Present') {
        acc[day] = 'Present';
      }
    }
    return acc;
  }, {});

  const uniqueAttendances = Object.values(groupedByDay);
  const presentCount = uniqueAttendances.filter(status => status === 'Present').length;
  const absentCount = uniqueAttendances.filter(status => status === 'Absent').length;

  const pieData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [presentCount, absentCount],
        backgroundColor: ['#28a745', '#dc3545'],
        hoverBackgroundColor: ['#218838', '#c82333'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2>Student Attendance Details</h2>
      {attendanceRecords.length > 0 ? (
        <div className="mb-3">
          <h4>{attendanceRecords[0]?.studentId?.name}</h4>
          <p>
            <strong>Present:</strong> {presentCount} day(s) &nbsp;&nbsp;
            <strong>Absent:</strong> {absentCount} day(s)
          </p>
        </div>
      ) : (
        <div className="mb-3">
          <h4>No attendance record available</h4>
        </div>
      )}
      <div className="mb-4">
        <h4>Attendance Summary (Pie Chart)</h4>
        <Pie data={pieData} />
      </div>
      <div className="mt-3">
        <Link to="/report" className="btn btn-secondary">
          Back to Student List
        </Link>
      </div>
    </div>
  );
};

// StudentList: displays a filtered list of students based on selected course and attendance records for a selected date.
const StudentList = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [courses, setCourses] = useState([]);

  // Fetch all attendance records.
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        setAttendances(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Error fetching attendance');
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  // Extract distinct courses from attendance records.
  useEffect(() => {
    const courseSet = new Set();
    attendances.forEach(att => {
      if (att.studentId && att.studentId.course) {
        courseSet.add(att.studentId.course);
      }
    });
    setCourses([...courseSet]);
  }, [attendances]);

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }
  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  // Filter attendance records by selected date (using Moment.js).
  const filteredAttendances = attendances.filter(att => {
    const attDate = moment(att.date).format('YYYY-MM-DD');
    return attDate === selectedDate;
  });

  // Group filtered records by studentId *and* by date (to count unique dates).
  let grouped = filteredAttendances.reduce((acc, att) => {
    if (!att.studentId || !att.studentId._id) return acc;
    const id = att.studentId._id;
    const day = moment(att.date).format('YYYY-MM-DD');
    if (!acc[id]) {
      acc[id] = { student: att.studentId, records: {} };
    }
    // The last record for a given day will override, which is enough to count unique days.
    acc[id].records[day] = att.status;
    return acc;
  }, {});

  let groupedArray = Object.values(grouped);

  // Filter grouped records by course if needed.
  if (selectedCourse !== 'All') {
    groupedArray = groupedArray.filter(({ student }) => student.course === selectedCourse);
  }

  return (
    <div className="container mt-4">
      <h2>Attendance Report</h2>

      {/* Date Filter */}
      <div className="mb-3">
        <label htmlFor="dateFilter" className="form-label">
          <strong>Select Date:</strong>
        </label>
        <input
          type="date"
          id="dateFilter"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Filter by Course */}
      <div className="mb-3">
        <label htmlFor="courseFilter" className="form-label">
          <strong>Filter by Course:</strong>
        </label>
        <select
          id="courseFilter"
          className="form-select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="All">All</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Student List */}
      <ul className="list-group">
        {groupedArray.map(({ student, records }) => {
          const recordCount = Object.keys(records).length;
          return (
            <li key={student._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link to={`/report/${student._id}`}>
                  <strong>{student.name}</strong>
                </Link>
                {student.course && <span className="ms-2 badge bg-secondary">{student.course}</span>}
              </div>
              <span className="badge bg-info">
                {recordCount} record{recordCount !== 1 ? 's' : ''}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Main Report component: shows StudentDetail if a studentId parameter is present; otherwise shows StudentList.
const Report = () => {
  const { studentId } = useParams();
  return studentId ? <StudentDetail /> : <StudentList />;
};

export default Report;