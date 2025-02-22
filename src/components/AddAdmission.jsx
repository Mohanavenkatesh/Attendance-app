import React, { useState } from "react";
import axios from "axios";

const AddAdmission = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    qualification: "",
    parentName: "",
    parentMobile: "",
    address: "",
    course: "",
    modeOfLearning: "",
    preferredSlot: "",
    placement: "",
    attendBy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/admission", formData);
      alert("Admission submitted successfully!");
    } catch (error) {
      alert("Error submitting admission form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-900 text-white rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Enter student name" onChange={handleChange} className="p-2 rounded" required />
        <input type="text" name="mobile" placeholder="Enter Student mobile no" onChange={handleChange} className="p-2 rounded" required />
        <input type="email" name="email" placeholder="Enter student email" onChange={handleChange} className="p-2 rounded" required />
        <input type="text" name="qualification" placeholder="Enter student qualification" onChange={handleChange} className="p-2 rounded" required />
        <input type="text" name="parentName" placeholder="Enter student parent's name" onChange={handleChange} className="p-2 rounded" required />
        <input type="text" name="parentMobile" placeholder="Enter student parent's no" onChange={handleChange} className="p-2 rounded" required />
        <input type="text" name="address" placeholder="Enter student address" onChange={handleChange} className="p-2 rounded col-span-2" required />
        <select name="course" onChange={handleChange} className="p-2 rounded">
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
        <select name="modeOfLearning" onChange={handleChange} className="p-2 rounded">
          <option value="">Select mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <select name="preferredSlot" onChange={handleChange} className="p-2 rounded">
          <option value="">Select slot</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
        <select name="placement" onChange={handleChange} className="p-2 rounded">
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select name="attendBy" onChange={handleChange} className="p-2 rounded">
          <option value="">Select</option>
          <option value="self">Self</option>
          <option value="guardian">Guardian</option>
        </select>
      </div>
      <button type="submit" className="mt-4 p-2 bg-purple-500 rounded text-white">Submit admission</button>
    </form>
  );
};

export default AddAdmission;