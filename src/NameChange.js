//import react and axios
import React, { useState } from 'react';
import axios from 'axios';

const NameChange = ({ title, _id }) => {

  //creates states that will be used later
  const [editableTitle, setEditableTitle] = useState(title);
  const [documentData, setDocumentData] = useState(null);
  const [isTextFieldSelected, setIsTextFieldSelected] = useState(false);

  //this method handles the file name change
  const handleInputChange = (e) => {
    const newTitle = e.target.value; //sets the new value
    setEditableTitle(newTitle);

    //posts that new value to this path
    axios.post(`http://localhost:3001/db/update/${_id}`, { title: newTitle })
      .then((res) => {
        console.log(res.data); //logs the data
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //this method handles when the textfield is clicked
  const handleInputClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/db/find/${_id}`); //uess a get request to pull data from the URL
      setDocumentData(response.data); //sets the document data
      setIsTextFieldSelected(true); //sets isSelected to true
    } catch (error) {
      console.error(error);
    }
  };

  //handles blur
  const handleInputBlur = () => {
    setIsTextFieldSelected(false);
  };

  //returns an object that contains the document and all the event handlers
  return (
    <>
      <li>
        <div className={`text-field-container ${isTextFieldSelected ? 'selected' : ''}`}>
          <input
            type="text"
            value={editableTitle}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
          />
        </div>
      </li>
      {isTextFieldSelected && documentData && (
        <div className="document-info">
          <pre>{JSON.stringify(documentData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default NameChange;