import React, { useState } from 'react';

const CheckboxTreeView = ({ data, onGroupSelect }) => {
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleCheckboxChange = (groupId, isChecked) => {
    if (isChecked) {
      setSelectedGroups(prevGroups => [...prevGroups, groupId]);
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(id => id !== groupId));
    }
  };

  return (
    <div>
      {data.map(group => (
        <div key={group.groupId}>
          <input
            type="checkbox"
            checked={selectedGroups.includes(group.groupId)}
            onChange={e => handleCheckboxChange(group.groupId, e.target.checked)}
          />
          <label>{group.groupName}</label>
        </div>
      ))}
      <button onClick={() => onGroupSelect(selectedGroups)}>Apply</button>
    </div>
  );
};

export default CheckboxTreeView;
