import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingData = location.state || {};
    
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        bookingReason: '',
        bookingDetails: '',
        organisation: '',
        eventName: '',
        estimatedParticipants: '',
        specialRequirements: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');


    const styles = {
        container: {
            maxWidth: '900px',
            margin: '40px auto',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '20px'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#2b6cb0',
            marginBottom: '10px'
        },
        subtitle: {
            color: '#4a5568',
            fontSize: '16px'
        },
        section: {
            marginBottom: '30px',
            padding: '25px',
            background: '#f8fafc',
            borderRadius: '10px'
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#2d3748',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        bookingSummary: {
            background: '#e0f0fb',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px'
        },
        summaryGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '15px'
        },
        summaryItem: {
            marginBottom: '10px'
        },
        summaryLabel: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#4a5568',
            marginBottom: '3px'
        },
        summaryValue: {
            fontSize: '16px',
            color: '#2d3748',
            fontWeight: '500'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '15px'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#4a5568',
            marginBottom: '8px'
        },
        required: {
            color: '#e53e3e',
            marginLeft: '2px'
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '1px solid #b5babe',
            borderRadius: '6px',
            fontSize: '16px',
            background: 'white',
            boxSizing: 'border-box'
        },
        select: {
            width: '100%',
            padding: '12px',
            border: '1px solid #b5babe',
            borderRadius: '6px',
            fontSize: '16px',
            background: 'white',
            cursor: 'pointer'
        },
        textarea: {
            width: '100%',
            padding: '12px',
            border: '1px solid #b5babe',
            borderRadius: '6px',
            fontSize: '16px',
            background: 'white',
            minHeight: '100px',
            resize: 'vertical'
        },
        radioGroup: {
            display: 'flex',
            gap: '20px',
            marginTop: '5px'
        },
        radioOption: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
        },
        radioInput: {
            margin: '0',
            cursor: 'pointer'
        },
        errorText: {
            color: '#e53e3e',
            fontSize: '14px',
            marginTop: '5px'
        },
        buttonGroup: {
            display: 'flex',
            gap: '15px',
            marginTop: '30px',
            justifyContent: 'center'
        },
        submitButton: {
            padding: '15px 40px',
            background: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
        },
        backButton: {
            padding: '15px 40px',
            background: '#718096',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
        },
        note: {
            fontSize: '14px',
            color: '#718096',
            marginTop: '20px',
            padding: '15px',
            background: '#f7fafc',
            borderRadius: '8px',
            borderLeft: '3px solid #4299e1'
        },
        errorBox: {
            padding: '15px',
            background: '#fed7d7',
            border: '1px solid #fc8181',
            borderRadius: '8px',
            color: '#c53030',
            marginBottom: '20px'
        },
        successBox: {
            padding: '15px',
            background: '#c6f6d5',
            border: '1px solid #9ae6b4',
            borderRadius: '8px',
            color: '#22543d',
            marginBottom: '20px'
        },
        loadingSpinner: {
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }
    };

    const spinAnimation = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    if (!bookingData.date || !bookingData.venue) {
        return (
            <div style={styles.container}>
                <style>{spinAnimation}</style>
                <div style={styles.errorBox}>
                    <h3>⚠️ Missing Booking Information</h3>
                    <p>Please go back and complete your booking selection first.</p>
                </div>
                <div style={styles.buttonGroup}>
                    <button 
                        style={styles.backButton}
                        onClick={() => navigate('/booking')}
                    >
                        ← Back to Booking
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.gender) newErrors.gender = 'Please select gender';
        if (!formData.bookingReason.trim()) newErrors.bookingReason = 'Booking reason is required';
        if (!formData.bookingDetails.trim()) newErrors.bookingDetails = 'Please provide detailed booking description'; 
        if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
        if (!formData.estimatedParticipants) {
            newErrors.estimatedParticipants = 'Please estimate number of participants';
        } else if (isNaN(formData.estimatedParticipants) || parseInt(formData.estimatedParticipants) <= 0) {
            newErrors.estimatedParticipants = 'Please enter a valid number';
        } else if (parseInt(formData.estimatedParticipants) > bookingData.venueDetails?.capacity) {
            newErrors.estimatedParticipants = `Exceeds venue capacity (max: ${bookingData.venueDetails?.capacity})`;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        
        if (!validateForm()) {
            alert("Validation failed! Please check all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!currentUser) {
                setSubmitError('Please login to submit booking');
                navigate('/login');
                return;
            }

            const bookingRequest = {
                user_id: currentUser.User_ID,
                venue_id: bookingData.venueId,
                date: bookingData.formattedDate,
                start_time: bookingData.startTime,
                end_time: bookingData.endTime,
                description: formData.bookingDetails,
                event_name: formData.eventName,
                estimated_participants: parseInt(formData.estimatedParticipants) || 0,
                booking_reason: formData.bookingReason,
                organisation: formData.organisation || '',
                special_requirements: formData.specialRequirements || '',
                contact_name: formData.name,
                contact_gender: formData.gender
            };

            console.log('Submitting booking to database:', bookingRequest);
            
            const response = await axios.post('http://localhost:5000/api/create-booking', bookingRequest);
            
            if (response.status === 201 || response.status === 200) {
                alert(`✅ Booking request submitted successfully!\n\nBooking ID: ${response.data.booking_id}\nStatus: ${response.data.status}\n`);
                
                navigate('/homepage', { 
                    state: { 
                        showSuccessMessage: true,
                        bookingId: response.data.booking_id,
                        message: `Booking #${response.data.booking_id} submitted successfully! It is now pending admin approval.`
                    } 
                });
            }
            
        } catch (error) {
            console.error('Error submitting booking:', error);
            
            if (error.response) {
                if (error.response.status === 409) {
                    setSubmitError('This time slot is no longer available. Please go back and choose another time.');
                } else if (error.response.status === 404) {
                    setSubmitError('User or venue not found. Please login again.');
                    navigate('/login');
                } else if (error.response.status === 400) {
                    setSubmitError(error.response.data.message || 'Please check your information and try again.');
                } else {
                    setSubmitError(error.response.data.message || 'Failed to submit booking. Please try again.');
                }
            } else if (error.request) {
                setSubmitError('Network error. Please check your connection and try again.');
            } else {
                setSubmitError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/booking', { state: bookingData });
    };

    return (
        <div style={styles.container}>
            <style>{spinAnimation}</style>
            <div style={styles.header}>
                <h1 style={styles.title}>Complete Your Booking</h1>
                <p style={styles.subtitle}>Review your selections and fill in the details</p>
            </div>

            {submitError && (
                <div style={styles.errorBox}>
                    <h3>⚠️ Submission Error</h3>
                    <p>{submitError}</p>
                </div>
            )}

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <span role="img" aria-label="summary">📋</span> Booking Summary
                </h2>
                <div style={styles.bookingSummary}>
                    <div style={styles.summaryGrid}>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Date</div>
                            <div style={styles.summaryValue}>
                                {formatDate(bookingData.date)}
                            </div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Venue Type</div>
                            <div style={styles.summaryValue}>
                                {bookingData.venueTypeName || 'N/A'}
                            </div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Venue</div>
                            <div style={styles.summaryValue}>
                                {bookingData.venue || 'N/A'}
                                {bookingData.venueDetails && (
                                    <div style={{ fontSize: '14px', color: '#718096', marginTop: '3px' }}>
                                        Capacity: {bookingData.venueDetails.capacity} people
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Time Slot</div>
                            <div style={styles.summaryValue}>
                                {bookingData.startTime} - {bookingData.endTime}
                                {bookingData.duration && (
                                    <div style={{ fontSize: '14px', color: '#718096', marginTop: '3px' }}>
                                        Duration: {bookingData.duration}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span role="img" aria-label="contact">👤</span> Contact Information
                    </h2>
                    
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Full Name <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                style={styles.input}
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                disabled={isSubmitting}
                            />
                            {errors.name && <div style={styles.errorText}>{errors.name}</div>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Gender <span style={styles.required}>*</span>
                            </label>
                            <div style={styles.radioGroup}>
                                <label style={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={handleInputChange}
                                        style={styles.radioInput}
                                        disabled={isSubmitting}
                                    />
                                    Male
                                </label>
                                <label style={styles.radioOption}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={handleInputChange}
                                        style={styles.radioInput}
                                        disabled={isSubmitting}
                                    />
                                    Female
                                </label>
                            </div>
                            {errors.gender && <div style={styles.errorText}>{errors.gender}</div>}
                        </div>
                    </div>
                </div>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <span role="img" aria-label="event">🎯</span> Event Details
                    </h2>
                    
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Event Name <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="eventName"
                                style={styles.input}
                                value={formData.eventName}
                                onChange={handleInputChange}
                                placeholder="e.g., Annual Conference, Workshop, Seminar"
                                disabled={isSubmitting}
                            />
                            {errors.eventName && <div style={styles.errorText}>{errors.eventName}</div>}
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Estimated Participants <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                name="estimatedParticipants"
                                style={styles.input}
                                value={formData.estimatedParticipants}
                                onChange={handleInputChange}
                                placeholder="Number of people"
                                min="1"
                                max={bookingData.venueDetails?.capacity || 9999}
                                disabled={isSubmitting}
                            />
                            {errors.estimatedParticipants && <div style={styles.errorText}>{errors.estimatedParticipants}</div>}
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                                Venue capacity: {bookingData.venueDetails?.capacity || 'N/A'} people
                            </div>
                        </div>
                    </div>
                    
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Organisation (if applicable)
                            </label>
                            <input
                                type="text"
                                name="organisation"
                                style={styles.input}
                                value={formData.organisation}
                                onChange={handleInputChange}
                                placeholder="e.g., University Club, Company Name"
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Booking Reason <span style={styles.required}>*</span>
                            </label>
                            <select
                                name="bookingReason"
                                style={styles.select}
                                value={formData.bookingReason}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="">Select a reason</option>
                                <option value="academic">Academic (Class, Lecture, Exam)</option>
                                <option value="club">Club/Society Activity</option>
                                <option value="sports">Sports Event</option>
                                <option value="conference">Conference/Seminar</option>
                                <option value="workshop">Workshop/Training</option>
                                <option value="social">Social Event</option>
                                <option value="meeting">Meeting</option>
                                <option value="performance">Performance/Show</option>
                                <option value="exhibition">Exhibition</option>
                                <option value="competition">Competition</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.bookingReason && <div style={styles.errorText}>{errors.bookingReason}</div>}
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Detailed Booking Description <span style={styles.required}>*</span>
                        </label>
                        <textarea
                            name="bookingDetails"
                            style={styles.textarea}
                            value={formData.bookingDetails}
                            onChange={handleInputChange}
                            placeholder="Please provide detailed information about your booking..."
                            rows="5"
                            disabled={isSubmitting}
                        />
                        {errors.bookingDetails && <div style={styles.errorText}>{errors.bookingDetails}</div>}
                        <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                            Please include:
                            <ul style={{ margin: '5px 0 0 15px', padding: '0' }}>
                                <li>Specific activities planned</li>
                                <li>Equipment/furniture needed (chairs, tables, projectors, etc.)</li>
                                <li>Setup requirements (stage, seating arrangement)</li>
                                <li>Any items you'll be bringing</li>
                                <li>Technical/audio-visual needs</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Special Requirements (Optional)
                        </label>
                        <textarea
                            name="specialRequirements"
                            style={styles.textarea}
                            value={formData.specialRequirements}
                            onChange={handleInputChange}
                            placeholder="Any special requirements, equipment needs, or additional notes..."
                            rows="4"
                            disabled={isSubmitting}
                        />

                        <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                            For example: food catering, decorations, security, extra cleaning, etc.
                        </div>
                    </div>
                </div>

                <div style={styles.note}>
                    <strong>📝 Important Notes:</strong>
                    <ul style={{ margin: '10px 0 0 20px', padding: '0' }}>
                        <li><strong>Please provide detailed booking description</strong> to help us prepare the venue appropriately</li>
                        <li>Please arrive at least 15 minutes before your booking time</li>
                        <li>Cancellations must be made at least 24 hours in advance</li>
                        <li>Food and drinks may not be allowed in some venues</li>
                        <li>You will receive a confirmation email shortly after submission</li>
                        <li>Please bring your student/staff ID on the day of the event</li>
                    </ul>
                </div>

                <div style={styles.buttonGroup}>
                    <button 
                        type="button"
                        style={styles.backButton}
                        onClick={handleBack}
                        disabled={isSubmitting}
                    >
                        ← Back
                    </button>
                    <button 
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            ...(isSubmitting ? styles.disabledButton : {})
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div style={styles.loadingSpinner}></div>
                                Submitting...
                            </>
                        ) : 'Submit Booking'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BookingForm;