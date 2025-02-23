import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingAdmission, setEditingAdmission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    qualification: '',
    parentName: '',
    parentMobile: '',
    address: '',
    modeOfLearning: '',
    preferredSlot: '',
    placement: '',
    attendBy: '',
    course: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleEdit = (admission) => {
    setEditingAdmission(admission._id);
    setFormData(admission);
  };

  const handleDelete = async (admissionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admissions/${admissionId}`);
      const updatedAdmissions = admissions.filter(admission => admission._id !== admissionId);
      setAdmissions(updatedAdmissions);
      setSuccessMessage('Admission deleted successfully!');
      setErrorMessage('');
      if (updatedAdmissions.length === 0) {
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error('Error deleting admission:', error);
      setErrorMessage('Error deleting admission');
      setSuccessMessage('');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admissions/${editingAdmission}`, formData);
      const updatedAdmissions = await axios.get('http://localhost:5000/api/admissions');
      setAdmissions(updatedAdmissions.data);
      setEditingAdmission(null);
      setSuccessMessage('Admission updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating admission:', error);
      setErrorMessage('Error updating admission');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Use a fixed, light theme.
  const containerClass = "container mt-5";
  const cardClass = "card bg-light shadow-sm";
  const btnClass = "btn btn-dark";

  return (
    <div className={containerClass}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center">Admissions</h2>
      </div>

      {/* Success or Error messages */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {selectedCourse ? (
        <div>
          <button onClick={() => setSelectedCourse(null)} className={`btn ${btnClass} mb-4`}>
            Back to Courses
          </button>
          <h3 className="text-center mb-3">{selectedCourse}</h3>

          {groupedAdmissions[selectedCourse] && groupedAdmissions[selectedCourse].length > 0 ? (
            <div className="row">
              {groupedAdmissions[selectedCourse].map((admission) => (
                <div key={admission._id} className="col-md-4 mb-4">
                  <div className={cardClass}>
                    <div className="card-body">
                      {editingAdmission === admission._id ? (
                        <form onSubmit={handleUpdate}>
                          {Object.keys(formData).map((key) => (
                            key !== 'course' ? (
                              <div className="form-group" key={key}>
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input
                                  type="text"
                                  name={key}
                                  value={formData[key]}
                                  onChange={handleChange}
                                  className="form-control"
                                  required
                                />
                              </div>
                            ) : (
                              <div className="form-group" key={key}>
                                <label>Course</label>
                                <select
                                  name="course"
                                  value={formData.course}
                                  onChange={handleChange}
                                  className="form-control"
                                  required
                                >
                                  <option value="">Select course</option>
                                  <option value="Fullstack Development">Fullstack Development</option>
                                  <option value="UI/UX">UI/UX</option>
                                  <option value="Graphics Design">Graphics Design</option>
                                  <option value="Creator Course">Creator Course</option>
                                  <option value="Digital Marketing">Digital Marketing</option>
                                  <option value="Web Design">Web Design</option>
                                  <option value="Video Editing">Video Editing</option>
                                  <option value="Machine Learning">Machine Learning</option>
                                  <option value="App Development">App Development</option>
                                </select>
                              </div>
                            )
                          ))}
                          <button type="submit" className="btn btn-warning mt-3">Update</button>
                        </form>
                      ) : (
                        <>
                          <h5>{admission.name}</h5>
                          <ul className="list-unstyled">
                            {['name', 'mobile', 'email', 'qualification', 'parentName', 'parentMobile', 'address', 'modeOfLearning', 'preferredSlot', 'placement', 'attendBy'].map((key) => (
                              <li key={key}>
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {admission[key]}
                              </li>
                            ))}
                          </ul>
                          <button onClick={() => handleEdit(admission)} className="btn btn-primary mt-2">Edit</button>
                          <button onClick={() => handleDelete(admission._id)} className="btn btn-danger mt-2 ml-2">Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No admissions available for this course.</p>
          )}
        </div>
      ) : (
        <div className="row">
          {Object.keys(groupedAdmissions).map((course) => (
            <div key={course} className="col-md-4 mb-4">
              <div className={cardClass} onClick={() => setSelectedCourse(course)} style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <h5 className="card-title">{course}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;