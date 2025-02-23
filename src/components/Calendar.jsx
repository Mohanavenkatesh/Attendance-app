import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', slot: '' });
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const now = new Date();

    const fetchReminders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reminders'); // Replace with your API endpoint
        const reminderData = response.data
          .map(record => ({
            title: record.title,
            start: new Date(record.start),
            end: new Date(record.end),
            allDay: false,
          }))
          .filter(event => event.start >= now); // Only upcoming events
        setEvents(reminderData);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    const fetchFestivals = async () => {
      try {
        const response = await axios.get('https://date.nager.at/api/v3/PublicHolidays/2025/AT'); // Replace with your API endpoint for Indian festivals
        const upcomingFestivals = response.data.filter(festival => new Date(festival.date) >= now);
        setFestivals(upcomingFestivals);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      }
    };

    fetchReminders();
    fetchFestivals();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/reminders', newEvent); // Replace with your API endpoint
      const addedEvent = {
        title: response.data.title,
        start: new Date(response.data.start),
        end: new Date(response.data.end),
        allDay: false,
      };
      // Only add if the event is upcoming.
      if (addedEvent.start >= new Date()) {
        setEvents([...events, addedEvent]);
      }
      setNewEvent({ title: '', start: '', end: '', slot: '' });
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Calendar</h2>
      <form onSubmit={handleAddEvent} className="mb-4">
        <div className="form-row">
          <div className="form-group col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={newEvent.start}
              onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={newEvent.end}
              onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              required
            />
          </div>
          <div className="form-group col-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="Slot"
              value={newEvent.slot}
              onChange={(e) => setNewEvent({ ...newEvent, slot: e.target.value })}
              required
            />
          </div>
          <div className="form-group col-md-1">
            <button type="submit" className="btn btn-primary btn-block">Add Event</button>
          </div>
        </div>
      </form>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="bg-white p-3 rounded shadow-sm"
      />
      <div className="mt-5">
        <h3 className="mb-4 text-center">Upcoming Festivals</h3>
        <ul className="list-group">
          {festivals.map(festival => (
            <li key={festival.date} className="list-group-item">
              <strong>{festival.localName}</strong> - {new Date(festival.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;