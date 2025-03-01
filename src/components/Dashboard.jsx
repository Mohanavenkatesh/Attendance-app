import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import '../css/Dashboard.css';




ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

//  // ----- Static Upcoming Classes Data (Removed API fetching) -----
const upcomingClasses = [
  { _id: "1", title: "Fullstack Development", date: "2025-02-28T09:30:00.000Z", batch: "9.30" },
  { _id: "2", title: "UI/UX", date: "2025-02-28T10:30:00.000Z", batch: "10.30" },
  { _id: "3", title: "Graphics Design", date: "2025-02-28T11:30:00.000Z", batch: "11.30" },
  { _id: "4", title: "Creator Course", date: "2025-02-28T12:30:00.000Z", batch: "12.30" },
  { _id: "5", title: "Digital Marketing", date: "2025-02-28T13:30:00.000Z", batch: "1.30" },
  { _id: "6", title: "Web Design", date: "2025-02-28T14:30:00.000Z", batch: "2.30" },
  { _id: "7", title: "Video Editing", date: "2025-02-28T15:30:00.000Z", batch: "3.30" },
  { _id: "8", title: "Machine Learning", date: "2025-02-28T16:30:00.000Z", batch: "4.30" },
  { _id: "9", title: "App Development", date: "2025-02-28T17:30:00.000Z", batch: "5.30" },
];

const Dashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceError, setAttendanceError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false); // State for welcome popup

  const scrollContainerRef = useRef(null);
  const leaderboardScrollRef = useRef(null);

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

  useEffect(() => {
    fetchAdmissions();
    fetchAttendance();
    setShowWelcomePopup(true); // Show the popup when the component mounts
    const timer = setTimeout(() => {
      setShowWelcomePopup(false); // Automatically close the popup after 2 seconds
    }, 2000);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
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

  // Weekly Attendance Summary
  const startOfWeek = moment().startOf('isoWeek');
  const endOfWeek = moment().endOf('isoWeek');
  const weekAttendance = attendance.filter((att) => {
    const attDate = moment(att.date);
    return attDate.isBetween(startOfWeek, endOfWeek, null, '[]');
  });

  const daysOfWeek = [];
  const currentWeekDate = startOfWeek.clone();
  while (currentWeekDate.isSameOrBefore(endOfWeek)) {
    daysOfWeek.push(currentWeekDate.clone());
    currentWeekDate.add(1, 'day');
  }

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
      day: day.format('ddd'), // Display day of the week (e.g., Mon, Tue, etc.)
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

  // Leaderboard: Compute monthly attendance ranking for students based on 'Present' records.
  const startOfMonth = moment().startOf('month'); // Start of the current month
  const endOfMonth = moment().endOf('month'); // End of the current month

  const leaderboard = {};
  attendance.forEach(record => {
    const recordDate = moment(record.date);
    if (
      record.studentId &&
      record.studentId._id &&
      record.status === 'Present' &&
      recordDate.isBetween(startOfMonth, endOfMonth, null, '[]') // Check if the record is within the current month
    ) {
      const id = record.studentId._id;
      if (!leaderboard[id]) {
        leaderboard[id] = { name: record.studentId.name || 'Unknown', count: 0 };
      }
      leaderboard[id].count += 1;
    }
  });

  const leaderboardArray = Object.values(leaderboard).sort((a, b) => b.count - a.count);

  // Vertical Auto-scroll effect for attendance leaderboard.
  useEffect(() => {
    const interval = setInterval(() => {
      if (leaderboardScrollRef.current) {
        leaderboardScrollRef.current.scrollTop += 1;
        if (
          leaderboardScrollRef.current.scrollTop >=
          leaderboardScrollRef.current.scrollHeight - leaderboardScrollRef.current.clientHeight
        ) {
          leaderboardScrollRef.current.scrollTop = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [leaderboardArray]);

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
        <div className=" shadow-sm">
          <div className="">
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
    <div className="container  position-relative">

      <h2 className="mb-4 text-start">Dashboard</h2>

      {/* Search Bar in Top-Right Corner */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', width: '250px' }}>
        <input
          type="text"
          className="form-control form-control-sm rounded"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ backgroundColor: 'var(--input-background-color)', color: 'var(--input-text-color)' }}
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
                  <div className="card shadow-sm" style={{ backgroundColor: 'var(--card-background-color)', color: 'var(--card-text-color)' }}>
                    <div className="card-body">
                      <h5>{admission.name}</h5>
                      <p>{admission.course}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No results found.</div>
          )}
        </div>
      )}

      {/* Admissions Data by Course (Count Only) */}
      <div className="row mb-4">
        {['Fullstack Development', 'UI/UX', 'Creator Course'].map((course) => (
          <div className="col-md-4  dashboard-cards" key={course}>
            <div className="card shadow" style={{ backgroundColor: 'var(--card-background-color)', color: 'var(--card-text-color)' }}>
              <div className="card-body">
                <h5 className="text-center">{course}</h5>
                <p className="text-center">{groupedAdmissions[course] ? groupedAdmissions[course].length : 0} Students</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-Column Layout for Today's Attendance, Weekly Summary, and Upcoming Classes */}
      <div className="row mb-4">
        <div className="col-md-4">
          <h5 className="text-center">Today's Attendance</h5>
          <div className="p-2" style={{ height: '300px' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: true, responsive: true }} />
          </div>
        </div>

        <div className="col-md-4">
          <h5 className="text-center">Weekly Attendance Summary</h5>
          <div className="p-2">
            <Bar data={barData} options={{ maintainAspectRatio: true, responsive: true }} />
          </div>
          <div className="text-center mt-2">
            <p>Week: {moment().startOf('isoWeek').format('MMM D')} - {moment().endOf('isoWeek').format('MMM D')}</p>
          </div>
        </div>

        <div className="col-md-4">
          <h5 className="text-center">Upcoming Classes</h5>
          <div
            className="card shadow-sm"
            ref={scrollContainerRef}
            style={{ height: '300px', overflow: 'hidden' }} // Updated style to remove scrollbar
          >
            <ul className="list-group list-group-flush">
              {[...sortedClassesByBatch, ...sortedClassesByBatch].map((cls, index) => (
                <li key={index} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6>{cls.title}</h6>
                      <p className="mb-0">Batch: {cls.batch}</p>
                    </div>
                    <span className="badge badge-primary">{moment(cls.date).format('MMM D, YYYY')}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Attendance Leaderboard */}
      <div className="row mb-4 justify-content-center">
        <div className="col-md-12">
          <h5 className="text-center">Attendance Leaderboard</h5>
          <div
            className="card shadow-sm"
            ref={leaderboardScrollRef}
            style={{ height: '300px', overflow: 'hidden' }} // Updated style to remove scrollbar
          >
            <ul className="list-group list-group-flush">
              {[...leaderboardArray, ...leaderboardArray].map((student, index) => (
                <li key={index} className="list-group-item">
                  <strong>{index % leaderboardArray.length + 1}. {student.name}</strong> - {student.count} Present
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;