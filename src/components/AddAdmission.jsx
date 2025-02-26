import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from 'react-bootstrap';

const AddAdmission = () => {
  const initialFormData = {
    name: "",
    mobile: "",
    email: "",
    qualification: "",
    parentName: "",
    parentMobile: "",
    address: "",
    course: "",
    modeOfLearning: "",
    batch: "",
    placement: "",
    attendBy: "",
    date: new Date(), // Add date field
  };

  const [formData, setFormData] = useState(initialFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the error for the field being edited
    setErrors({ ...errors, [name]: "" });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  // Validate form fields
  const validateForm = () => {
    const { name, mobile, email, qualification, parentName, parentMobile, address, course, modeOfLearning, batch, attendBy } = formData;
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Please enter the student's name!";
    }

    // Validate mobile
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number!";
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address!";
    }

    // Validate qualification
    if (!qualification.trim()) {
      newErrors.qualification = "Please enter the student's qualification!";
    }

    // Validate parent name
    if (!parentName.trim()) {
      newErrors.parentName = "Please enter the parent's name!";
    }

    // Validate parent mobile
    if (!mobilePattern.test(parentMobile)) {
      newErrors.parentMobile = "Please enter a valid 10-digit mobile number!";
    }

    // Validate address
    if (!address.trim()) {
      newErrors.address = "Please enter the student's address!";
    }

    // Validate course
    if (!course) {
      newErrors.course = "Please select a course!";
    }

    // Validate mode of learning
    if (!modeOfLearning) {
      newErrors.modeOfLearning = "Please select a mode of learning!";
    }

    // Validate batch
    if (!batch) {
      newErrors.batch = "Please select a batch!";
    }

    // Validate attendBy
    if (!attendBy) {
      newErrors.attendBy = "Please select who is attending!";
    }

    // Set errors if any
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Check if the email or mobile already exists
      const checkResponse = await axios.post("http://localhost:5000/api/admission/check", {
        email: formData.email,
        mobile: formData.mobile,
      });

      if (checkResponse.data.exists) {
        setErrorMessage("Student with this email or mobile number already exists!");
        setSuccessMessage("");
        return;
      }

      // If no duplicate, submit the form
      const response = await axios.post("http://localhost:5000/api/admission", formData);
      setSuccessMessage("Admission submitted successfully!");
      setErrorMessage("");
      setFormData(initialFormData);

      // Close the form after 2 seconds
      setTimeout(() => {
        setShowForm(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Error submitting admission form."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Add Admission</h2>
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(true)}>
          Add Admission
        </button>
      </div>
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Admission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {/* Name Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.name}</div>}
              </div>

              {/* Mobile Field */}
              <div className="col-md-6">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter student mobile no"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                />
                {errors.mobile && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.mobile}</div>}
              </div>

              {/* Email Field */}
              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter student email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                {errors.email && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.email}</div>}
              </div>

              {/* Qualification Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  name="qualification"
                  placeholder="Enter student qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={`form-control ${errors.qualification ? "is-invalid" : ""}`}
                />
                {errors.qualification && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.qualification}</div>}
              </div>

              {/* Parent Name Field */}
              <div className="col-md-6">
                <input
                  type="text"
                  name="parentName"
                  placeholder="Enter student parent's name"
                  value={formData.parentName}
                  onChange={handleChange}
                  className={`form-control ${errors.parentName ? "is-invalid" : ""}`}
                />
                {errors.parentName && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.parentName}</div>}
              </div>

              {/* Parent Mobile Field */}
              <div className="col-md-6">
                <input
                  type="tel"
                  name="parentMobile"
                  placeholder="Enter student parent's mobile no"
                  value={formData.parentMobile}
                  onChange={handleChange}
                  className={`form-control ${errors.parentMobile ? "is-invalid" : ""}`}
                />
                {errors.parentMobile && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.parentMobile}</div>}
              </div>

              {/* Address Field */}
              <div className="col-12">
                <input
                  type="text"
                  name="address"
                  placeholder="Enter student address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                />
                {errors.address && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.address}</div>}
              </div>

              {/* Course Field */}
              <div className="col-md-6">
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className={`form-select ${errors.course ? "is-invalid" : ""}`}
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
                {errors.course && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.course}</div>}
              </div>

              {/* Mode of Learning Field */}
              <div className="col-md-6">
                <select
                  name="modeOfLearning"
                  value={formData.modeOfLearning}
                  onChange={handleChange}
                  className={`form-select ${errors.modeOfLearning ? "is-invalid" : ""}`}
                >
                  <option value="">Select mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                {errors.modeOfLearning && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.modeOfLearning}</div>}
              </div>

              {/* Batch Field */}
              <div className="col-md-6">
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className={`form-select ${errors.batch ? "is-invalid" : ""}`}
                >
                  <option value="">Select batch</option>
                  <option value="9.30">9.30</option>
                  <option value="4.30">4.30</option>
                  <option value="12.30">12.30</option>
                  <option value="2.30">2.30</option>
                  <option value="5.30">5.30</option>
                  <option value="1.30">1.30</option>
                </select>
                {errors.batch && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.batch}</div>}
              </div>

              {/* AttendBy Field */}
              <div className="col-md-6">
                <select
                  name="attendBy"
                  value={formData.attendBy}
                  onChange={handleChange}
                  className={`form-select ${errors.attendBy ? "is-invalid" : ""}`}
                >
                  <option value="">AttendBy</option>
                  <option value="self">Self</option>
                  <option value="guardian">Guardian</option>
                </select>
                {errors.attendBy && <div className="text-danger text-start mt-1" style={{ fontSize: "0.875rem" }}>{errors.attendBy}</div>}
              </div>

              {/* Date Field */}
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">Select Date:</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5 py-2">
                Submit Admission
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddAdmission;