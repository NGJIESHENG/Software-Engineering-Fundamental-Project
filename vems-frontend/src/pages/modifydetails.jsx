import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModifyDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // We expect the booking ID to be passed in state, e.g., from a "Manage Bookings" list
    const bookingId = location.state?.bookingId;

    const [isLoading, setIsLoading] = useState(true);
    const [summaryData, setSummaryData] = useState({}); // Stores read-only info (Venue, Date, Time)
    
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
            background: '#dd6b20', // Changed to Orange for "Update" feel
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
            borderLeft: '3px solid #dd6b20'
        },
        errorBox: {
            padding: '15px',
            background: '#fed7d7',
            border: '1px solid #fc8181',
            borderRadius: '8px',
            color: '#c53030',
            marginBottom: '20px'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '20px'
        },
        loadingSpinner: {
            display: 'inline-block',
            width: '40px', // Larger for main loader
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3182ce',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        },
        smallSpinner: {
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

    // 1. Fetch Existing Booking Details on Mount
    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setSubmitError("No booking ID provided.");
                setIsLoading(false);
                return;
            }

            try {
                const rawToken = localStorage.getItem('token');
                const token = rawToken ? rawToken.replace(/"/g, '') : null;
                
                if (!token) {
                    alert("Please login first.");
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/booking-details`, {
                    params: { booking_id: bookingId },
                    headers: { 'Authorization': `Bearer ${token}`, 
                               'Content-Type': 'application/json' 
                            }
                });

                const data = response.data;

                setFormData({
                    name: data.contact_name || '',
                    gender: data.contact_gender || '',
                    bookingReason: data.booking_reason || '',
                    bookingDetails: data.description || '',
                    organisation: data.organisation || '',
                    eventName: data.event_name || '',
                    estimatedParticipants: data.estimated_participants || '',
                    specialRequirements: data.special_requirements || ''
                });

                // Set Read-Only Summary Data
                setSummaryData({
                    date: data.date,
                    startTime: data.start_time,
                    endTime: data.end_time,
                    venueName: data.venue_name, // Assuming API returns venue_name
                    venueType: data.venue_type, // Assuming API returns venue_type
                    venueCapacity: data.venue_capacity // Assuming API returns capacity
                });

            } catch (error) {
                console.error("Error fetching details:", error);
                setSubmitError("Failed to load booking details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
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
        } else if (summaryData.venueCapacity && parseInt(formData.estimatedParticipants) > summaryData.venueCapacity) {
            newErrors.estimatedParticipants = `Exceeds venue capacity (max: ${summaryData.venueCapacity})`;
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
            const rawToken = localStorage.getItem('token');
            const token = rawToken ? rawToken.replace(/"/g, '') : null;
            
            if (!token) {
                alert("Session expired. Please log in again.");
                navigate('/login');
                return;
            }

            // Prepare update payload
            const updateRequest = {
                booking_id: bookingId, // Identify which booking to update
                description: formData.bookingDetails,
                event_name: formData.eventName,
                estimated_participants: parseInt(formData.estimatedParticipants) || 0,
                booking_reason: formData.bookingReason,
                organisation: formData.organisation || '',
                special_requirements: formData.specialRequirements || '',
                contact_name: formData.name,
                contact_gender: formData.gender
                // Note: We are usually NOT updating date/venue/time here to avoid conflicts.
                // If date change is needed, it's usually a "Reschedule" feature.
            };

            console.log('📤 Updating booking:', updateRequest);
            
            // 2. Call Update API
            const response = await axios.put('http://localhost:5000/api/update-booking', updateRequest, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                alert(`✅ Booking updated successfully!`);
                
                // Return to booking history or dashboard
                navigate('/my-booking', { 
                    state: { 
                        message: `Booking for "${formData.eventName}" updated successfully.`
                    } 
                });
            }
            
        } catch (error) {
            console.error('❌ Error updating booking:', error);
            const msg = error.response?.data?.message || 'Failed to update booking. Please try again.';
            setSubmitError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (isLoading) {
        return (
            <div style={styles.container}>
                <style>{spinAnimation}</style>
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p>Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!bookingId) {
        return (
            <div style={styles.container}>
                <div style={styles.errorBox}>
                    <h3>⚠️ Error</h3>
                    <p>No booking selected to modify.</p>
                </div>
                <div style={styles.buttonGroup}>
                    <button style={styles.backButton} onClick={() => navigate('/my-booking')}>
                        Go to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{spinAnimation}</style>
            <div style={styles.header}>
                <h1 style={styles.title}>Modify Your Booking</h1>
                <p style={styles.subtitle}>Update the details below for reference ID: #{bookingId}</p>
            </div>

            {submitError && (
                <div style={styles.errorBox}>
                    <h3>⚠️ Error</h3>
                    <p>{submitError}</p>
                </div>
            )}

            {/* Read Only Summary Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <span role="img" aria-label="summary">🔒</span> Fixed Booking Details
                </h2>
                <div style={styles.note}>
                    To change Date, Time, or Venue, please cancel this booking and create a new one.
                </div>
                <div style={styles.bookingSummary}>
                    <div style={styles.summaryGrid}>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Date</div>
                            <div style={styles.summaryValue}>
                                {formatDate(summaryData.date)}
                            </div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Venue Type</div>
                            <div style={styles.summaryValue}>
                                {summaryData.venueType || 'N/A'}
                            </div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Venue</div>
                            <div style={styles.summaryValue}>
                                {summaryData.venueName || 'N/A'}
                                {summaryData.venueCapacity && (
                                    <div style={{ fontSize: '14px', color: '#718096', marginTop: '3px' }}>
                                        Capacity: {summaryData.venueCapacity} people
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={styles.summaryItem}>
                            <div style={styles.summaryLabel}>Time Slot</div>
                            <div style={styles.summaryValue}>
                                {summaryData.startTime} - {summaryData.endTime}
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
                                placeholder="e.g., Annual Conference"
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
                                // Fallback capacity to 9999 if not loaded yet
                                max={summaryData.venueCapacity || 9999}
                                disabled={isSubmitting}
                            />
                            {errors.estimatedParticipants && <div style={styles.errorText}>{errors.estimatedParticipants}</div>}
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
                                placeholder="e.g., University Club"
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
                            placeholder="Please provide detailed information..."
                            rows="5"
                            disabled={isSubmitting}
                        />
                        {errors.bookingDetails && <div style={styles.errorText}>{errors.bookingDetails}</div>}
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
                            rows="4"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div style={styles.buttonGroup}>
                    <button 
                        type="button"
                        style={styles.backButton}
                        onClick={handleBack}
                        disabled={isSubmitting}
                    >
                        Cancel
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
                                <div style={styles.smallSpinner}></div>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ModifyDetails;