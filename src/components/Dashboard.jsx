import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for attendance
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState('');

  // ----- Static Upcoming Classes Data (Removed API fetching) -----
  const upcomingClasses = [
    { _id: "1", title: "Math", date: "2025-02-28T09:30:00.000Z", batch: "9.30" },
    { _id: "2", title: "Physics", date: "2025-02-28T10:30:00.000Z", batch: "10.30" },
    { _id: "3", title: "Chemistry", date: "2025-02-28T11:30:00.000Z", batch: "11.30" },
    { _id: "4", title: "Biology", date: "2025-02-28T12:30:00.000Z", batch: "12.30" },
    { _id: "5", title: "History", date: "2025-02-28T13:30:00.000Z", batch: "1.30" },
    { _id: "6", title: "Geography", date: "2025-02-28T14:30:00.000Z", batch: "2.30" },
    { _id: "7", title: "Art", date: "2025-02-28T15:30:00.000Z", batch: "3.30" },
    { _id: "8", title: "Music", date: "2025-02-28T16:30:00.000Z", batch: "4.30" },
    { _id: "9", title: "Physical Ed", date: "2025-02-28T17:30:00.000Z", batch: "5.30" },
  ];

  // Search state for student names.
  const [searchTerm, setSearchTerm] = useState("");
  // Selected student for detailed report.
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Reference to the vertical scrolling container.
  const scrollContainerRef = useRef(null);

  // Fetch Admissions
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admissions');
        setAdmissions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admissions data:', err);
        setError('Error fetching admissions data');
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  // Fetch Attendance Records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        setAttendance(response.data);
        setAttendanceLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setAttendanceError('Error fetching attendance data');
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Sort upcoming classes by date.
  const sortedClasses = [...upcomingClasses].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // --- Batch-Based Sorting ---
  const batchOrder = ["9.30", "10.30", "11.30", "12.30", "1.30", "2.30", "3.30", "4.30", "5.30"];
  const batchTimesMapping = {
    "9.30": { hour: 9, minute: 30 },
    "10.30": { hour: 10, minute: 30 },
    "11.30": { hour: 11, minute: 30 },
    "12.30": { hour: 12, minute: 30 },
    "1.30": { hour: 13, minute: 30 },
    "2.30": { hour: 14, minute: 30 },
    "3.30": { hour: 15, minute: 30 },
    "4.30": { hour: 16, minute: 30 },
    "5.30": { hour: 17, minute: 30 },
  };

  const now = moment();
  const todayBatchMoments = batchOrder.map(batch => moment().set(batchTimesMapping[batch]));
  let nextBatchIndex = batchOrder.findIndex((batch, index) => now.isBefore(todayBatchMoments[index]));
  if (nextBatchIndex === -1) nextBatchIndex = 0;
  const rotatedBatchOrder = batchOrder.slice(nextBatchIndex).concat(batchOrder.slice(0, nextBatchIndex));

  const sortedClassesByBatch = [...sortedClasses].sort((a, b) => {
    const indexA = rotatedBatchOrder.indexOf(a.batch);
    const indexB = rotatedBatchOrder.indexOf(b.batch);
    return indexA - indexB;
  });

  // Vertical Auto-scroll effect for upcoming classes.
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += 1;
        if (
          scrollContainerRef.current.scrollTop >=
          scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight
        ) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [sortedClassesByBatch]);

  // Group Admissions by course.
  const groupByCourse = (admissions) =>
    admissions.reduce((groups, admission) => {
      const course = admission.course;
      if (!groups[course]) {
        groups[course] = [];
      }
      groups[course].push(admission);
      return groups;
    }, {});
  const groupedAdmissions = groupByCourse(admissions);

  // Filter Today's Attendance.
  const todayStr = moment().format('YYYY-MM-DD');
  const todayAttendance = attendance.filter(
    (att) => moment(att.date).format('YYYY-MM-DD') === todayStr
  );
  const groupedAttendance = todayAttendance.reduce((acc, record) => {
    if (record.studentId && record.studentId._id) {
      const id = record.studentId._id;
      if (!acc[id]) {
        acc[id] = record.status;
      } else if (acc[id] === 'Absent' && record.status === 'Present') {
        acc[id] = 'Present';
      }
    }
    return acc;
  }, {});
  const presentCount = Object.values(groupedAttendance).filter(
    (status) => status === 'Present'
  ).length;
  const absentCount = Object.values(groupedAttendance).filter(
    (status) => status === 'Absent'
  ).length;
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

  // Weekly Attendance Summary.
  const startOfWeek = moment().startOf('week');
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(moment(startOfWeek).add(i, 'days'));
  }
  const weekAttendance = attendance.filter((att) => {
    const attDate = moment(att.date);
    return attDate.isBetween(startOfWeek, moment().endOf('week'), null, '[]');
  });
  const weeklyData = daysOfWeek.map((day) => {
    const dayStr = day.format('YYYY-MM-DD');
    const recordsForDay = weekAttendance.filter(
      (att) => moment(att.date).format('YYYY-MM-DD') === dayStr
    );
    const group = {};
    recordsForDay.forEach((record) => {
      if (record.studentId && record.studentId._id) {
        const id = record.studentId._id;
        if (!group[id]) {
          group[id] = record.status;
        } else if (group[id] === 'Absent' && record.status === 'Present') {
          group[id] = 'Present';
        }
      }
    });
    const dayPresentCount = Object.values(group).filter(
      (status) => status === 'Present'
    ).length;
    const dayAbsentCount = Object.values(group).filter(
      (status) => status === 'Absent'
    ).length;
    return {
      day: day.format('ddd'),
      present: dayPresentCount,
      absent: dayAbsentCount,
    };
  });
  const barData = {
    labels: weeklyData.map((d) => d.day),
    datasets: [
      {
        label: 'Present',
        data: weeklyData.map((d) => d.present),
        backgroundColor: '#28a745',
      },
      {
        label: 'Absent',
        data: weeklyData.map((d) => d.absent),
        backgroundColor: '#dc3545',
      },
    ],
  };

  // Leaderboard: Compute weekly attendance ranking for students based on 'Present' records.
  const leaderboard = {};
  weekAttendance.forEach(record => {
    if (record.studentId && record.studentId._id && record.status === 'Present') {
      const id = record.studentId._id;
      if (!leaderboard[id]) {
        leaderboard[id] = { name: record.studentId.name || 'Unknown', count: 0 };
      }
      leaderboard[id].count += 1;
    }
  });
  const leaderboardArray = Object.values(leaderboard).sort((a, b) => b.count - a.count);

  // Filter admissions based on search term (by student name).
  const filteredAdmissions = admissions.filter(admission =>
    admission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Early returns for loading/error.
  if (loading) return <div className="alert alert-info">Loading Admissions...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // If a student is selected, show detailed report (filter out __v, id, _id).
  if (selectedStudent) {
    return (
      <div className="container mt-5">
        <button className="btn btn-secondary mb-4" onClick={() => setSelectedStudent(null)}>
          Back to Dashboard
        </button>
        <h2 className="mb-4 text-center">Student Detailed Report</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>{selectedStudent.name}</h4>
            <ul className="list-unstyled">
              {Object.keys(selectedStudent)
                .filter(key => key !== '__v' && key !== 'id' && key !== '_id')
                .map((key) => (
                  <li key={key}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {selectedStudent[key]}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 position-relative">
      <h2 className="mb-4 text-center">Dashboard</h2>

      {/* Search Bar in Top-Right Corner */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '250px' }}>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Search student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* If search term is provided, show search results */}
      {searchTerm && (
        <div className="mb-5">
          <h4>Search Results</h4>
          {filteredAdmissions.length > 0 ? (
            <div className="row">
              {filteredAdmissions.map((admission) => (
                <div
                  key={admission._id}
                  className="col-md-4 mb-3"
                  onClick={() => setSelectedStudent(admission)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>{admission.name}</h5>
                      <p className="mb-0">
                        <small>{admission.course}</small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No students found.</p>
          )}
        </div>
      )}

      {/* Default Dashboard View */}
      {!searchTerm && (
        <>
          {/* Courses Row (Admissions Cards) */}
          <div className="row mb-4 justify-content-center">
            {Object.keys(groupedAdmissions).map((course) => (
              <div key={course} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{course}</h5>
                    <p className="card-text">Admissions: {groupedAdmissions[course].length}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Three-column Summary Row */}
          <div className="row mb-4 justify-content-center align-items-center">
            {/* Today's Attendance Summary */}
            <div className="col-md-4">
              <h5 className="text-center">Today's Attendance Summary</h5>
              {attendanceLoading ? (
                <div>Loading Attendance...</div>
              ) : attendanceError ? (
                <div className="alert alert-danger">{attendanceError}</div>
              ) : (
                <>
                  <Pie data={pieData} options={{ maintainAspectRatio: true, responsive: true }} />
                  <div className="text-center mt-2">
                    <p>Present: {presentCount} | Absent: {absentCount}</p>
                  </div>
                </>
              )}
            </div>

            {/* Weekly Attendance Summary */}
            <div className="col-md-4">
              <h5 className="text-center">Weekly Attendance Summary</h5>
              <div className="p-2">
                <Bar data={barData} options={{ maintainAspectRatio: true, responsive: true }} />
              </div>
              <div className="text-center mt-2">
                <p>
                  Week: {startOfWeek.format('MMM D')} - {moment().endOf('week').format('MMM D')}
                </p>
              </div>
            </div>

            {/* Upcoming Classes with Vertical Auto-Scrolling */}
            <div className="col-md-4">
              <h5 className="text-center">Upcoming Classes</h5>
              <div
                ref={scrollContainerRef}
                className="overflow-auto hide-scrollbar"
                style={{ height: '250px', border: '1px solid #ddd', padding: '5px' }}
              >
                {sortedClassesByBatch.length ? (
                  sortedClassesByBatch.map((cls) => (
                    <div
                      key={cls.id || cls._id}
                      className="card mb-2"
                      style={{ width: '100%' }}
                    >
                      <div className="card-body">
                        <strong>{cls.title}</strong>
                        <br />
                        <small className="text-muted">
                          {moment(cls.date).format('MMM D, YYYY h:mm A')}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No upcoming classes.</p>
                )}
              </div>
            </div>
          </div>

          {/* Attendance Leaderboard */}
          <div className="mt-5">
            <h3 className="text-center">Attendance Leaderboard</h3>
            {leaderboardArray.length > 0 ? (
              <ul className="list-group">
                {leaderboardArray.map((entry, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{index + 1}. {entry.name}</span>
                    <span>{entry.count} days</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No leaderboard data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;