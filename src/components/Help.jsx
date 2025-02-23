import React from 'react';

const Help = () => {
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

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header" id="faq1">
                  <h5 className="mb-0">
                    <button
                      className="btn btn-link"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFaq1"
                      aria-expanded="true"
                      aria-controls="collapseFaq1"
                    >
                      How do I create an admission?
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseFaq1"
                  className="collapse show"
                  aria-labelledby="faq1"
                  data-bs-parent="#helpAccordion"
                >
                  <div className="card-body">
                    You can create an admission by filling out the admission form and clicking "Submit Admission". Make sure all required fields are completed accurately.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header" id="faq2">
                  <h5 className="mb-0">
                    <button
                      className="btn btn-link collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFaq2"
                      aria-expanded="false"
                      aria-controls="collapseFaq2"
                    >
                      How do I update or delete an admission?
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseFaq2"
                  className="collapse"
                  aria-labelledby="faq2"
                  data-bs-parent="#helpAccordion"
                >
                  <div className="card-body">
                    To update or delete an admission, please navigate to the dashboard, select the admission you wish to modify, and use the available update or delete options.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header" id="faq3">
                  <h5 className="mb-0">
                    <button
                      className="btn btn-link collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFaq3"
                      aria-expanded="false"
                      aria-controls="collapseFaq3"
                    >
                      Who should I contact for support?
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseFaq3"
                  className="collapse"
                  aria-labelledby="faq3"
                  data-bs-parent="#helpAccordion"
                >
                  <div className="card-body">
                    For assistance, please contact our support team at <a href="mailto:support@example.com">support@example.com</a> or call +1 234 567 890.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header" id="faq4">
                  <h5 className="mb-0">
                    <button
                      className="btn btn-link collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFaq4"
                      aria-expanded="false"
                      aria-controls="collapseFaq4"
                    >
                      How do I reset my password?
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseFaq4"
                  className="collapse"
                  aria-labelledby="faq4"
                  data-bs-parent="#helpAccordion"
                >
                  <div className="card-body">
                    To reset your password, click on the "Forgot Password" link on the login page and follow the instructions.
                  </div>
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