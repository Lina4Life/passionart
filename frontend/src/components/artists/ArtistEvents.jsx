import React, { useState, useEffect } from 'react';
import './ArtistEvents.css';

const ArtistEvents = ({ artistId, isOwnProfile }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: '',
    start_date: '',
    end_date: '',
    location: '',
    virtual_link: '',
    is_virtual: false,
    max_attendees: '',
    ticket_price: '',
    is_free: true
  });

  const eventTypes = [
    { value: 'exhibition', label: 'Exhibition', icon: 'ðŸ–¼ï¸', color: '#6c5ce7' },
    { value: 'workshop', label: 'Workshop', icon: 'ðŸŽ¨', color: '#fd79a8' },
    { value: 'gallery-opening', label: 'Gallery Opening', icon: 'ðŸŽ­', color: '#fdcb6e' },
    { value: 'art-fair', label: 'Art Fair', icon: 'ðŸ›ï¸', color: '#e84393' },
    { value: 'studio-visit', label: 'Studio Visit', icon: 'ðŸ ', color: '#00b894' },
    { value: 'lecture', label: 'Lecture/Talk', icon: 'ðŸŽ¤', color: '#74b9ff' },
    { value: 'collaboration', label: 'Collaboration', icon: 'ðŸ¤', color: '#a29bfe' },
    { value: 'other', label: 'Other', icon: 'ðŸ“…', color: '#636e72' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'past', label: 'Past Events' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'in-person', label: 'In-Person' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [artistId, filter]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artistId}/events?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/artists/${artistId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });

      if (response.ok) {
        alert('Event created successfully!');
        setShowCreateModal(false);
        setNewEvent({
          title: '',
          description: '',
          event_type: '',
          start_date: '',
          end_date: '',
          location: '',
          virtual_link: '',
          is_virtual: false,
          max_attendees: '',
          ticket_price: '',
          is_free: true
        });
        fetchEvents();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'past';
    return 'ongoing';
  };

  const getEventTypeConfig = (type) => {
    return eventTypes.find(t => t.value === type) || eventTypes[eventTypes.length - 1];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'virtual') return event.is_virtual;
    if (filter === 'in-person') return !event.is_virtual;
    return getEventStatus(event) === filter;
  });

  if (loading) {
    return (
      <div className="events-container">
        <div className="events-header">
          <h2>ðŸ“… Artist Events</h2>
          <div className="loading-placeholder">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>ðŸ“… Artist Events</h2>
        <div className="events-controls">
          <div className="filter-tabs">
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`filter-tab ${filter === option.value ? 'active' : ''}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          {isOwnProfile && (
            <button 
              className="create-event-btn"
              onClick={() => setShowCreateModal(true)}
            >
              âž• Create Event
            </button>
          )}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">ðŸ“…</div>
            <h3>No events found</h3>
            <p>
              {isOwnProfile 
                ? "Create your first event to connect with your audience!"
                : "This artist hasn't scheduled any events yet."
              }
            </p>
            {isOwnProfile && (
              <button 
                className="create-first-event-btn"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map(event => {
            const eventType = getEventTypeConfig(event.event_type);
            const status = getEventStatus(event);
            
            return (
              <div key={event.id} className={`event-card ${status}`}>
                <div className="event-header">
                  <div 
                    className="event-type-badge"
                    style={{ backgroundColor: eventType.color }}
                  >
                    <span className="event-icon">{eventType.icon}</span>
                    <span className="event-type-label">{eventType.label}</span>
                  </div>
                  <div className={`event-status ${status}`}>
                    {status === 'upcoming' && 'ðŸ”® Upcoming'}
                    {status === 'ongoing' && 'ðŸ”´ Live'}
                    {status === 'past' && 'âœ… Completed'}
                  </div>
                </div>

                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>

                  <div className="event-details">
                    <div className="event-detail">
                      <span className="detail-icon">ðŸ“…</span>
                      <div className="detail-content">
                        <strong>Date & Time</strong>
                        <div className="event-dates">
                          <div>Start: {formatDate(event.start_date)}</div>
                          {event.end_date && <div>End: {formatDate(event.end_date)}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="event-detail">
                      <span className="detail-icon">{event.is_virtual ? 'ðŸ’»' : 'ðŸ“'}</span>
                      <div className="detail-content">
                        <strong>{event.is_virtual ? 'Virtual Event' : 'Location'}</strong>
                        <div>
                          {event.is_virtual ? (
                            event.virtual_link ? (
                              <a href={event.virtual_link} target="_blank" rel="noopener noreferrer">
                                Join Virtual Event
                              </a>
                            ) : (
                              'Link will be provided'
                            )
                          ) : (
                            event.location || 'Location TBD'
                          )}
                        </div>
                      </div>
                    </div>

                    {event.max_attendees && (
                      <div className="event-detail">
                        <span className="detail-icon">ðŸ‘¥</span>
                        <div className="detail-content">
                          <strong>Capacity</strong>
                          <div>{event.current_attendees || 0} / {event.max_attendees}</div>
                        </div>
                      </div>
                    )}

                    <div className="event-detail">
                      <span className="detail-icon">ðŸ’°</span>
                      <div className="detail-content">
                        <strong>Price</strong>
                        <div>
                          {event.is_free ? 'Free' : `$${event.ticket_price}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="event-actions">
                    {!isOwnProfile && status !== 'past' && (
                      <button className="attend-btn">
                        {event.is_attending ? 'âœ… Attending' : 'ðŸŽ« Attend Event'}
                      </button>
                    )}
                    <button className="share-btn">ðŸ“¤ Share</button>
                    {isOwnProfile && (
                      <>
                        <button className="edit-btn">âœï¸ Edit</button>
                        <button className="manage-btn">âš™ï¸ Manage</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="create-event-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>ðŸ“… Create New Event</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>Ã—</button>
            </div>

            <form onSubmit={handleCreateEvent} className="event-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Solo Exhibition: Digital Dreams"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Event Type *</label>
                  <div className="event-type-grid">
                    {eventTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        className={`event-type-option ${newEvent.event_type === type.value ? 'selected' : ''}`}
                        style={{ '--accent-color': type.color }}
                        onClick={() => setNewEvent(prev => ({ ...prev, event_type: type.value }))}
                      >
                        <span className="type-icon">{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    placeholder="Describe your event, what attendees can expect..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={newEvent.start_date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newEvent.end_date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, end_date: e.target.value }))}
                      min={newEvent.start_date}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newEvent.is_virtual}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, is_virtual: e.target.checked }))}
                    />
                    Virtual Event
                  </label>
                </div>

                {newEvent.is_virtual ? (
                  <div className="form-group">
                    <label>Virtual Meeting Link</label>
                    <input
                      type="url"
                      placeholder="https://zoom.us/j/..."
                      value={newEvent.virtual_link}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, virtual_link: e.target.value }))}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      placeholder="Gallery name, address, or venue"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      required={!newEvent.is_virtual}
                    />
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Max Attendees</label>
                    <input
                      type="number"
                      placeholder="Leave empty for unlimited"
                      value={newEvent.max_attendees}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, max_attendees: e.target.value }))}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newEvent.is_free}
                        onChange={(e) => setNewEvent(prev => ({ 
                          ...prev, 
                          is_free: e.target.checked,
                          ticket_price: e.target.checked ? '' : prev.ticket_price
                        }))}
                      />
                      Free Event
                    </label>
                  </div>
                </div>

                {!newEvent.is_free && (
                  <div className="form-group">
                    <label>Ticket Price ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newEvent.ticket_price}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, ticket_price: e.target.value }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  ðŸ“… Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistEvents;

