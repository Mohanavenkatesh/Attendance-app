import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', slot: '', batch: '', course: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');

  useEffect(() => {
    const now = new Date();

    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events'); // Replace with your API endpoint
        const eventData = response.data
          .map(record => ({
            title: record.title,
            start: new Date(record.start),
            end: new Date(record.end),
            allDay: false,
            batch: record.batch,
            course: record.course,
          }))
          .filter(event => event.start >= now); // Only upcoming events
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchBatchesAndCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admissions'); // Replace with your API endpoint
        const data = response.data;

        // Extract distinct batches and courses for the dropdown filters
        const batchList = Array.from(new Set(data.map(student => student.batch).filter(Boolean)));
        const courseList = Array.from(new Set(data.map(student => student.course).filter(Boolean)));

        setBatches(batchList);
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching batches and courses:', error);
      }
    };

    fetchEvents();
    fetchBatchesAndCourses();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/events', newEvent); // Replace with your API endpoint
      const addedEvent = {
        title: response.data.title,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
        allDay: false,
        batch: response.data.batch,
        course: response.data.course,
      };
      // Only add if the event is upcoming.
      if (addedEvent.start >= new Date()) {
        setEvents([...events, addedEvent]);
      }
      setNewEvent({ title: '', start: '', end: '', slot: '', batch: '', course: '' });

      // Set a reminder one day before the event
      const reminderDate = new Date(addedEvent.start);
      reminderDate.setDate(reminderDate.getDate() - 1);
      await axios.post('http://localhost:5000/api/reminders', {
        title: `Reminder: ${addedEvent.title}`,
        start: reminderDate,
        end: reminderDate,
        allDay: true,
      });

      // Show success message
      setSuccessMessage('Event added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesBatch = selectedBatch === 'All' || event.batch === selectedBatch;
    const matchesCourse = selectedCourse === 'All' || event.course === selectedCourse;
    return matchesBatch && matchesCourse;
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Calendar</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleAddEvent} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Slot"
              value={newEvent.slot}
              onChange={(e) => setNewEvent({ ...newEvent, slot: e.target.value })}
              required
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary w-100">Add</button>
          </div>
          <div className="col-md-3 mt-3">
            <select
              className="form-select"
              value={newEvent.batch}
              onChange={(e) => setNewEvent({ ...newEvent, batch: e.target.value })}
              required
            >
              <option value="">Select Batch</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>{batch}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mt-3">
            <select
              className="form-select"
              value={newEvent.course}
              onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
      <div className="row mb-4">
        <div className="col-md-6">
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
        <div className="col-md-6">
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
      </div>
      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="bg-white p-3 rounded shadow-sm"
      />
      <div className="mt-5">
        <h3 className="mb-4 text-center">Upcoming Events</h3>
        <ul className="list-group">
          {filteredEvents.map(event => (
            <li key={event.start} className="list-group-item">
              <strong>{event.title}</strong> - {new Date(event.start).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;