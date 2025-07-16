import React, { useContext } from 'react';
import { Card, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faUserClock, 
  faFileAlt, 
  faCog, 
  faHeadphones 
} from '@fortawesome/free-solid-svg-icons';


const Help = () => {
 
  return (
    <div className="container " style={{ minHeight: '100vh' }}>
      <h2 className="mb-4">Need help?</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center p-4">
            <FontAwesomeIcon icon={faUser} size="2x" className="mb-3 text-muted" />
            <Card.Title>Get started</Card.Title> {/* Corrected closing tag */}
            <Card.Text className="text-muted">
              Generate insightful attendance reports with customizable date ranges and export options.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center p-4">
            <FontAwesomeIcon icon={faUserClock} size="2x" className="mb-3 text-muted" />
            <Card.Title>Managing Attendance</Card.Title> {/* Corrected closing tag */}
            <Card.Text className="text-muted">
              Effortlessly track, update, and manage attendance with a user-friendly web app.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center p-4">
            <FontAwesomeIcon icon={faUser} size="2x" className="mb-3 text-muted" />
            <Card.Title>User Management</Card.Title> {/* Corrected closing tag */}
            <Card.Text className="text-muted">
              Easily add, assign roles, and manage users for seamless access control.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center p-4">
            <FontAwesomeIcon icon={faFileAlt} size="2x" className="mb-3 text-muted" />
            <Card.Title>Reporting</Card.Title> {/* Corrected closing tag */}
            <Card.Text className="text-muted">
              Generate insightful attendance reports with customizable date ranges and export options.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center p-4">
            <FontAwesomeIcon icon={faCog} size="2x" className="mb-3 text-muted" />
            <Card.Title>Settings</Card.Title> {/* Corrected closing tag */}
            <Card.Text className="text-muted">
              Customize notifications, working hours, and preferences for a tailored experience.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center p-4">
            <FontAwesomeIcon icon={faHeadphones} size="2x" className="mb-3 text-muted" />
            <Card.Title>Support</Card.Title> {/* Corrected closing tag */}
            <Card.Text className="text-muted">
              Access FAQs, live chat, and email support for quick assistance.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>

      {/* FAQs Section */}
      <div className="mt-5">
        <h3>FAQs</h3>
        <Accordion className="mt-3">
          <Accordion.Item eventKey="0" className="shadow-sm border-0 rounded-3">
            <Accordion.Header>Can I export attendance data?</Accordion.Header>
            <Accordion.Body>
              Yes, you can export attendance data in various formats like CSV or PDF with customizable date ranges.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className="shadow-sm border-0 rounded-3">
            <Accordion.Header>What roles can be assigned to users?</Accordion.Header>
            <Accordion.Body>
              Users can be assigned roles such as Admin, Manager, or Viewer, depending on their responsibilities.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="shadow-sm border-0 rounded-3">
            <Accordion.Header>How do I edit an attendance record?</Accordion.Header>
            <Accordion.Body>
              Navigate to the Attendances section, select the record, and click the edit button to update details.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default Help;