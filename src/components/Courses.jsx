import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admissions');
        setAdmissions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        setError('Error fetching admissions');
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  const groupByCourse = (admissions) => {
    return admissions.reduce((groups, admission) => {
      const course = admission.course;
      if (!groups[course]) {
        groups[course] = [];
      }
      groups[course].push(admission);
      return groups;
    }, {});
  };

  const groupedAdmissions = groupByCourse(admissions);

  if (loading) {
    return <div className="p-6 bg-gray-900 text-white rounded-md">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 bg-gray-900 text-white rounded-md">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-md">
      <h2 className="text-2xl mb-4">Admissions</h2>
      {selectedCourse ? (
        <div>
          <button onClick={() => setSelectedCourse(null)} className="mb-4 p-2 bg-purple-500 rounded text-white">Back to Courses</button>
          <h3 className="text-xl mb-2">{selectedCourse}</h3>
          <div className="grid grid-cols-1 gap-4">
            {groupedAdmissions[selectedCourse].map((admission) => (
              <div key={admission._id} className="p-4 bg-gray-800 rounded">
                <h4 className="text-lg">{admission.name}</h4>
                <p>Email: {admission.email}</p>
                <p>Mobile: {admission.mobile}</p>
                <p>Qualification: {admission.qualification}</p>
                <p>Parent Name: {admission.parentName}</p>
                <p>Parent Mobile: {admission.parentMobile}</p>
                <p>Address: {admission.address}</p>
                <p>Mode of Learning: {admission.modeOfLearning}</p>
                <p>Preferred Slot: {admission.preferredSlot}</p>
                <p>Placement: {admission.placement}</p>
                <p>Attend By: {admission.attendBy}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(groupedAdmissions).map((course) => (
            <div key={course} className="p-4 bg-gray-800 rounded cursor-pointer" onClick={() => setSelectedCourse(course)}>
              <h3 className="text-xl">{course}</h3>
              <div className="text-sm text-gray-400">Count: {groupedAdmissions[course].length}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;