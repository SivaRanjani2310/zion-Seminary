import React, { useState, useEffect } from "react";
import "./BigCalendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap"; // Bootstrap modal components

const localizer = momentLocalizer(moment);
const apiBaseUrl = process.env.REACT_APP_BASE_API;
// const apiBaseurl = process.env.REACT_APP_API_BASE_URL;

const BigCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null); // Store the event to delete
  const userid = JSON.parse(localStorage.getItem("userdata"));

  // Fetch events from the API
  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/event/${userid._id}`);
        const fetchedEvents = res.data.events || [];
        const formattedEvents = fetchedEvents.map((event) => ({
          title: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          id: event.id || event._id, // Ensure compatibility with backend ID
        }));
        setEvents(formattedEvents);

      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    getEvents();
  }, []);

  // Add a new event
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill all fields before adding an event.");
      return;
    }

    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);

    if (startDate >= endDate) {
      alert("End date must be after start date.");
      return;
    }

    const newEventWithUser = {
      title: newEvent.title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userId: userid,
    };

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/event/`,
        newEventWithUser
      );
      window.location.reload();

      setEvents([
        ...events,
        {
          title: newEvent.title,
          start: startDate,
          end: endDate,
          id: res.data.event.id,
        },
      ]);
      setShowModal(false);

    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }

    setNewEvent({ title: "", start: "", end: "" });
  };

    
    // Handle event deletion
    const handleDeleteEvent = async () => {
      if (!eventToDelete || !eventToDelete.id) {
        alert("No event selected for deletion.");
        return;
      }
      
      try {
        const response = await axios.delete(
          `${apiBaseUrl}/api/event/${eventToDelete.id}`
        );
        if (response.status === 200 || response.status === 204) {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventToDelete.id)
        );
        setShowDeleteConfirmation(false);
        alert("Event deleted successfully.");
      } else {
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  // Show delete confirmation modal
  const handleShowDeleteConfirmation = (event) => {
    if (!event || !event.id) {
      alert("Invalid event selected.");
      return;
    }
    setEventToDelete(event);
    setShowDeleteConfirmation(true);
  };

  // const eventPropGetter = (event) => ({
  //   style: {
  //     position: "relative",
  //   },
  // });

  return (
    <div className="react-Big-calendar">
      <div className="main-calendar">
        <div className="Dash_calender">
          <h5>Calendar</h5>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Event
          </Button>
        </div>

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          // eventPropGetter={eventPropGetter}
          style={{ height: "88%", width: "100%" }}
          onSelectEvent={handleShowDeleteConfirmation}
        />

        {/* Modal for adding events */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Event Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Start Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>End Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddEvent}>
              Save Event
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          show={showDeleteConfirmation}
          onHide={() => setShowDeleteConfirmation(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this event?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default BigCalendar;
