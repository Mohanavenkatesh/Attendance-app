import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/admission", formData);
      setSuccessMessage("Admission submitted successfully!");
      setErrorMessage("");
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error submitting admission form."
      );
      setSuccessMessage("");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div className="position-relative">
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#dc3545",
            cursor: "pointer",
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded shadow-sm bg-white"
          style={{ 
            width: "500px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          <h3 className="text-center mb-4">Admission Form</h3>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                placeholder="Enter student name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                name="mobile"
                placeholder="Enter student mobile no"
                value={formData.mobile}
                onChange={handleChange}
                className="form-control"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                name="email"
                placeholder="Enter student email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="qualification"
                placeholder="Enter student qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="parentName"
                placeholder="Enter student parent's name"
                value={formData.parentName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                name="parentMobile"
                placeholder="Enter student parent's mobile no"
                value={formData.parentMobile}
                onChange={handleChange}
                className="form-control"
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                name="address"
                placeholder="Enter student address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="form-select"
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
            <div className="col-md-6">
              <select
                name="modeOfLearning"
                value={formData.modeOfLearning}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select batch</option>
                <option value="9.30">9.30</option>
                <option value="4.30">4.30</option>
                <option value="12.30">12.30</option>
                <option value="2.30">2.30</option>
                <option value="5.30">5.30</option>
                <option value="1.30">1.30</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                name="placement"
                value={formData.placement}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="col-md-6">
              <select
                name="attendBy"
                value={formData.attendBy}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select</option>
                <option value="self">Self</option>
                <option value="guardian">Guardian</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="date" className="form-label">Select Date:</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-5 py-2">
              Submit Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdmission;