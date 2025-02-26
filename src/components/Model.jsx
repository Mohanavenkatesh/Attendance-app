import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ show, message }) => {
    if (!show) return null; // Only render modal if 'show' is true

    return (
        <div className="modal fade show d-block slide-down" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
};

export default Modal;