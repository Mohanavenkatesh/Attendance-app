import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button, Alert, Row, Col, Form } from 'react-bootstrap';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', slot: '', batch: '', course: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // Fetch events, batches, and courses on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        const eventData = response.data.map(record => ({
          id: record._id,
          title: record.title,
          start: new Date(record.start),
          end: new Date(record.end),
          allDay: false,
          batch: record.batch,
          course: record.course,
        }));
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchBatchesAndCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admissions');
        const data = response.data;
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

  // Handle adding a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/events', newEvent);
      const addedEvent = {
        id: response.data._id,
        title: response.data.title,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
        allDay: false,
        batch: response.data.batch,
        course: response.data.course,
      };
      setEvents([...events, addedEvent]);
      setNewEvent({ title: '', start: '', end: '', slot: '', batch: '', course: '' });
      setSuccessMessage('Event added successfully!');
      setShowForm(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  // Handle editing an event
  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/events/${editEvent.id}`, newEvent);
      const updatedEvent = {
        id: response.data._id,
        title: response.data.title,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
        allDay: false,
        batch: response.data.batch,
        course: response.data.course,
      };
      setEvents(events.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
      setNewEvent({ title: '', start: '', end: '', slot: '', batch: '', course: '' });
      setSuccessMessage('Event updated successfully!');
      setShowForm(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
      setSuccessMessage('Event deleted successfully!');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Handle edit button click
  const handleEditClick = (event) => {
    setEditEvent(event);
    setNewEvent(event);
    setShowForm(true);
  };

  // Filter events based on selected batch and course
  const filteredEvents = events.filter(event => {
    const matchesBatch = selectedBatch === 'All' || event.batch === selectedBatch;
    const matchesCourse = selectedCourse === 'All' || event.course === selectedCourse;
    return matchesBatch && matchesCourse;
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Calendar</h2>
      {showSuccessModal && (
        <Alert variant="success" className="text-center">
          {successMessage}
        </Alert>
      )}
      
      <div className="d-flex justify-content-end mb-3">
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
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
        <Col md={6}>
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
      </Row>

      {/* Calendar */}
      <div className="mb-4">
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          className="custom-calendar p-2 rounded shadow-sm"
        />
      </div>

      {/* Upcoming Events List */}
      <div className="mt-4">
        <h3 className="mb-3 text-center">Upcoming Events</h3>
        <ul className="list-group">
          {filteredEvents.length ? (
            filteredEvents.map(event => (
              <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{event.title}</strong> - {new Date(event.start).toLocaleString()}
                </div>
                <div>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(event)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center">No events found.</li>
          )}
        </ul>
      </div>

      {/* Add/Edit Event Modal */}
      <Modal show={showForm} onHide={() => { setShowForm(false); setEditEvent(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editEvent ? 'Edit Event' : 'Add Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editEvent ? handleEditEvent : handleAddEvent}>
            <Form.Group className="mb-3" controlId="eventTitle">
              <Form.Control
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventStart">
              <DatePicker
                selected={newEvent.start}
                onChange={(date) => setNewEvent({ ...newEvent, start: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
                placeholderText="Start Date & Time"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventEnd">
              <DatePicker
                selected={newEvent.end}
                onChange={(date) => setNewEvent({ ...newEvent, end: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
                placeholderText="End Date & Time"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventSlot">
              <Form.Control
                type="text"
                placeholder="Slot"
                value={newEvent.slot}
                onChange={(e) => setNewEvent({ ...newEvent, slot: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventBatch">
              <Form.Select
                value={newEvent.batch}
                onChange={(e) => setNewEvent({ ...newEvent, batch: e.target.value })}
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch, index) => (
                  <option key={index} value={batch}>{batch}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="eventCourse">
              <Form.Select
                value={newEvent.course}
                onChange={(e) => setNewEvent({ ...newEvent, course: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              {editEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Calendar;