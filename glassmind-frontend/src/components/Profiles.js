import React, { useEffect, useState } from "react";
import { getProfiles } from "../services/api";

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);

useEffect(() => {
  getProfiles().then((data) => {
    console.log("Data from API:", data);
    if (data && data.profiles) {
      setProfiles(data.profiles);
    }
  });
}, []);

  return (
    <div>
      <h2>User Profiles</h2>
      {profiles.length ? (
        <ul>
          {profiles.map((profile) => (
            <li key={profile.id}>
              {profile.name} - {profile.emotion}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading profiles...</p>
      )}
    </div>
  );
};

export default Profiles;