import React from 'react';

export const Help = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="text-center mb-4">Help & Support</h2>
          <p className="text-center">
            Find answers to frequently asked questions or contact our support team.
          </p>
          <img 
            src="https://via.placeholder.com/800x300" 
            alt="Help" 
            className="img-fluid mb-4"
          />

          <div className="accordion" id="helpAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="faq1">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFaq1"
                  aria-expanded="true"
                  aria-controls="collapseFaq1"
                >
                  How do I create an admission?
                </button>
              </h2>
              <div
                id="collapseFaq1"
                className="accordion-collapse collapse show"
                aria-labelledby="faq1"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  You can create an admission by filling out the admission form and clicking "Submit Admission". Make sure all required fields are completed accurately.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq2">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFaq2"
                  aria-expanded="false"
                  aria-controls="collapseFaq2"
                >
                  How do I update or delete an admission?
                </button>
              </h2>
              <div
                id="collapseFaq2"
                className="accordion-collapse collapse"
                aria-labelledby="faq2"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  To update or delete an admission, please navigate to the dashboard, select the admission you wish to modify, and use the available update or delete options.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq3">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFaq3"
                  aria-expanded="false"
                  aria-controls="collapseFaq3"
                >
                  Who should I contact for support?
                </button>
              </h2>
              <div
                id="collapseFaq3"
                className="accordion-collapse collapse"
                aria-labelledby="faq3"
                data-bs-parent="#helpAccordion"
              >
                <div className="accordion-body">
                  For assistance, please contact our support team at <a href="mailto:support@example.com">support@example.com</a> or call +1 234 567 890.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;