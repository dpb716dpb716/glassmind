import React, { useState, useEffect } from 'react';
import '../PeoplePageStyle.css'; // Adjust the path based on your file structure

// Updated PeopleFilter component using a date range
const PeopleFilter = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interactionType, setInteractionType] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');

  // Combine filter values and trigger the parent callback
  const triggerFilterChange = (filters) => {
    onFilterChange(filters);
  };

  const handleDateChange = (newStart, newEnd) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    triggerFilterChange({
      startDate: newStart,
      endDate: newEnd,
      interactionType,
      gender,
      ageRange,
    });
  };

  return (
    <div className="people-filter">
      <h2>Search People</h2>
      <div>
        <label>Interaction Date Range:</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value, endDate)}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange(startDate, e.target.value)}
            placeholder="End Date"
          />
        </div>
      </div>
      <div>
        <label>Interaction Type:</label>
        <select
          value={interactionType}
          onChange={(e) => {
            setInteractionType(e.target.value);
            triggerFilterChange({
              startDate,
              endDate,
              interactionType: e.target.value,
              gender,
              ageRange,
            });
          }}
        >
          <option value="">All</option>
          <option value="chat">Chat</option>
          <option value="meeting">Meeting</option>
          <option value="coincidental">Coincidental</option>
        </select>
      </div>
      <div>
        <label>Gender:</label>
        <select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            triggerFilterChange({
              startDate,
              endDate,
              interactionType,
              gender: e.target.value,
              ageRange,
            });
          }}
        >
          <option value="">All</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label>Age Range:</label>
        <select
          value={ageRange}
          onChange={(e) => {
            setAgeRange(e.target.value);
            triggerFilterChange({
              startDate,
              endDate,
              interactionType,
              gender,
              ageRange: e.target.value,
            });
          }}
        >
          <option value="">All</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-45">36-45</option>
          <option value="46+">46+</option>
        </select>
      </div>
    </div>
  );
};

// PeopleList displays a list of people; clicking on one will select that person
const PeopleList = ({ people, onSelectPerson }) => {
  return (
    <div className="people-list">
      <h2>People</h2>
      <ul>
        {people.map(person => (
          <li key={person.id} onClick={() => onSelectPerson(person)}>
            <img src={person.imageUrl} alt={person.name} className="person-thumb" />
            <span>{person.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// PeopleProfile displays details for the selected person
const PeopleProfile = ({ person }) => {
  if (!person) {
    return <div className="people-profile empty">Select a person to view their profile</div>;
  }

  return (
    <div className="people-profile">
      <h2>{person.name}'s Profile</h2>
      <img src={person.imageUrl} alt={person.name} className="profile-image" />
      <div className="profile-details">
        <p><strong>Age:</strong> {person.age}</p>
        <p><strong>Gender:</strong> {person.gender}</p>
        <p><strong>Last Interaction:</strong> {person.lastInteraction}</p>
        <p><strong>Interaction Type:</strong> {person.interactionType}</p>
      </div>
      <div className="profile-map">
        <h3>Interactive Map</h3>
        <div className="map-placeholder">
          <p>Map points here</p>
        </div>
      </div>
      <div className="profile-relationships">
        <h3>Known Relationships</h3>
        <ul>
          {person.relationships.map(rel => (
            <li key={rel.id}>{rel.name} ({rel.relationship})</li>
          ))}
        </ul>
      </div>
      <div className="profile-emotions">
        <h3>Emotional Scores</h3>
        <p><strong>Towards Others:</strong> {person.emotionalScores.towardsOthers}</p>
        <p><strong>Towards Me:</strong> {person.emotionalScores.towardsMe}</p>
      </div>
    </div>
  );
};

// Main PeoplePage component tying everything together
const PeoplePage = () => {
  const [filters, setFilters] = useState({});
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [people, setPeople] = useState([]);

  // In a real application, fetch filtered data from your API.
  // Here we use dummy data for demonstration.
  useEffect(() => {
    const dummyPeople = [
      {
        id: 1,
        name: 'Alice Johnson',
        age: 28,
        gender: 'female',
        lastInteraction: '2025-03-15',
        interactionType: 'Chat',
        imageUrl: 'https://via.placeholder.com/150',
        relationships: [
          { id: 'r1', name: 'Bob Smith', relationship: 'Friend' },
          { id: 'r2', name: 'Carol Lee', relationship: 'Colleague' },
        ],
        emotionalScores: {
          towardsOthers: 0.8,
          towardsMe: 0.6,
        },
      },
      {
        id: 2,
        name: 'Michael Brown',
        age: 35,
        gender: 'male',
        lastInteraction: '2025-03-14',
        interactionType: 'Meeting',
        imageUrl: 'https://via.placeholder.com/150',
        relationships: [
          { id: 'r3', name: 'Alice Johnson', relationship: 'Friend' },
        ],
        emotionalScores: {
          towardsOthers: 0.7,
          towardsMe: 0.5,
        },
      },
      // Additional dummy profiles can be added here.
    ];

    // For now, simply set the dummy data. You can add filtering logic later.
    setPeople(dummyPeople);
  }, [filters]);

  return (
    <div className="people-page">
      <div className="people-page-header">
        <h1>People</h1>
      </div>
      <div className="people-page-body">
        <div className="people-page-filters">
          <PeopleFilter onFilterChange={(newFilters) => setFilters(newFilters)} />
        </div>
        <div className="people-page-content">
          <PeopleList people={people} onSelectPerson={setSelectedPerson} />
          <PeopleProfile person={selectedPerson} />
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;