/*
 * Project 2
 * App component JavaScript source code
 *
 * Author: Sai Puppala
 * Version: 1.0
 */

//Importing all the necessary things needed for the App, like the items, hooks, barcharts, editor, box, axios, and scatterplot
import './App.css';
import React, {useState, useEffect} from 'react';
import Item from './Item.js';
import MenuBar from './MenuBar.js';
import BarChart from './BarChart';
import Editor from './Editor.js';
import {Box, Container} from "@mui/system";
import axios from 'axios';
import ScatterPlot from './ScatterPlot.js';


const App = (props) => {
    const [key, setKey] = useState('p1.json'); // MongoDB document key
    const [value, setValue] = useState(null); //Dataset
    const [dataSize, setDataSize] = useState(0); // Size of data
    const [selected, setSelected] = useState([]); // Selected elements
    const [isInitialized, setIsInitialized] = useState(false); //Initialization elements
    const [data, setData] = useState([]); //Mongodb data
    const [selectedIndices, setSelectedIndices] = useState([]); //Selected elements indices
    const [copied, setCopy] = useState([]); //copied elements

    //useeffect hook to get the items from the database 
    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            document.title = 'Project 2: spuppala25';
            axios.get('http://localhost:3001/db/find').then(res => {
        		setData(res.data); //sets the data to the database found
            });
        }
    });

    //Load File using the database id
    const loadDataset = async (_id) => {
        try {
            const response = await fetch(`http://localhost:3001/db/find/${_id}`); //uses a fetch request to fetch the data by ID
            if (!response.ok) {
                throw new Error('Failed to fetch data from the server');
            }
    
            const data = await response.json(); //loading the json data
    
            setKey(_id); //setting the key using the ID
    
            if (data.data.length === 0) {
                data.data.push({ 'x': '', 'y': 0 }); //push that data to the barchart, and other charts as well.
            }
    
            //set the value, datasize, and set selected as nothing
            setValue(data);
            console.log(data);
            setDataSize(data.data.length);
            setSelected([]);
        } catch (error) {
            console.error('Error loading dataset:', error.message);
            // Handle the error appropriately (e.g., show an error message to the user)
        }
    };    

    // Open New File using the file name
    const newDataset = (fileName) => {
        setKey(fileName);
        let val = {
            title: fileName,
            data: [{'x': '', 'y': 0}]
        };
        setValue(val);
        setDataSize(val.data.length); // Use val.data.length instead of value.data.length
        setSelected([]);
        console.log(val);
    }


    //Save Current File to the database Id. Basically it will read the ID and save the data to the correct database ID
    const saveDataset = () => {
        console.log(value);
        console.log(value._id);
        console.log(value.data);
        //Simple post for when an update is done.
        axios.post('http://localhost:3001/db/update/' + value._id, { myTitle: value.title, data: value.data });
    }

    //Save File with new name
    const saveAsDataset = async (fileName) => {
        try {
        // Make a POST request to the MongoDB route to save the data
            const response = await axios.post('http://localhost:3001/db/add', {
                fileName: value.title, // Pass the new fileName
                fileContent: value.data // Pass the current dataset
            });

            console.log(response.data);
            setKey(fileName);
            setDataSize(value.data.length);
        } catch (error) {
            console.error('Error saving dataset:', error.message);
            // Handle the error appropriately, e.g., show a user-friendly message
        }
    };



    //Change Chart Title
    const changeTitle = (e) => {
        value.title = e.target.value; //sets the new chart title
        setValue(value);
        setDataSize(dataSize+1);
        console.log(value._id)
        console.log(value.title);
    }

    //Change X label
    const changeXLabel = (e) => {
        let newValue = value;
        newValue.data = value.data.map( //maps the new x label
            (x, i)=>
            {return {[e.target.value] : Object.values(value.data[i])[0], [Object.keys(value.data[0])[1]] : Object.values(value.data[i])[1]}}
        );
        setValue(newValue);
        setDataSize(dataSize+1);
        console.log(value);
    }

    //Change Y Label
    const changeYLabel = (e) => {
        let newValue = value;
        newValue.data = value.data.map( //maps the new y value
            (x, i)=>
            {return {[Object.keys(value.data[0])[0]] : Object.values(value.data[i])[0], [e.target.value] : Object.values(value.data[i])[1]}}
        );
        setValue(newValue);
        setDataSize(dataSize+1);
        console.log(value);
    }

    //Simply just selects the copied data. Helper method
    const copyData = (e) =>{
        setCopy(selected);
    }
    /**
     * This pastes the data to the respective views
     */
    const pasteData = (e) => {
        setCopy(selected) //set copy to the new selected value
        let newValue = value
        for (let i = 0; i < copied.length; i++) {
            const rowIndex = copied[i];
            //For loop so I can add more then one together
            if (rowIndex >= 0 && rowIndex < newValue.data.length) {
                const row = value.data[rowIndex];
                //Effectively recreting addElement, but without the useState.
                let c1 = Object.keys(newValue.data[0])[0];
                let c2 = Object.keys(newValue.data[0])[1];
                //Gets the first and second values from the row to be appended
                const first = Object.values(row)[0];
                const second = Object.values(row)[1];
                const newRow = {[c1]:first, [c2]:second};
                //Append to new row and then change size.
                newValue.data.push(newRow);
            } else {
                console.log(`Invalid index: ${rowIndex}`);
            }
        }
        //Once all is done, set the value to the copy and change the length to accomodate.
        setDataSize(dataSize + copied.length);
        setValue(newValue);
    }

    //Utilizes the copy data and then deletes the elements using the deleteElements helpder
    const cutData = (e) =>{
        setCopy(selected);
        deleteElements(copied)
    }

    //Add a new row
    const addElement = (newX, newY) => {
        console.log(dataSize);
        let c1 = Object.keys(value.data[0])[0]; //get the x value
        let c2 = Object.keys(value.data[0])[1]; //get the y value
        const newRow = {[c1]:newX, [c2]:newY}; //set the new row as the x and y value
        value.data.push(newRow);
        setDataSize(dataSize+1);
        console.log(dataSize);
        setValue(value);
    };

    //Delete a row
    const deleteElement = (index) => {
        if (value.data.length > 1) {
            let newValue = value;
            newValue.data = value.data.filter((x, i, arr) => {return i !== index}); //filter the data with the index 
            setValue(newValue);
            console.log(newValue);
            setDataSize(newValue.data.length);
        }
    };

    //very similar to the delete element method above, except it applies for multiple elements
    const deleteElements = (indices) =>{
        let newValue = value;
        newValue.data = value.data.filter((x, i, arr) => {return !indices.includes(i)}); 
        setDataSize(newValue.data.length);
        setValue(newValue);
        setSelected([]);
        console.log(newValue);

    }

    //Edit a row
    const editElement = (newVal, index, xVal) => {
        console.log('Edit Elem: ', index, newVal, xVal);
        let c1 = Object.keys(value.data[0])[0]; //get the x
        let c2 = Object.keys(value.data[0])[1]; //get the y
        xVal ? value.data[index][c1] = newVal : value.data[index][c2] = newVal; //set the new values of both the x and y
        setDataSize(dataSize+1);
        setValue(value);
        console.log(value);
        console.log(value.data);
    };

    // Select with checkboxes
    const selectElement = (e, index) => {
        if (e.target.checked) { //if row is checked, then make it the new selected and push its index
            console.log('Checked: ' + index);
            setSelected(prevSelected => {
                let newSelected = [...prevSelected];

                if (index === -1) {
                    for (let i = 0; i < value.data.length; i++) {
                        if (newSelected.indexOf(i) === -1) {
                            newSelected.push(i);
                        }
                    }
                } else {
                    newSelected.push(index);
                }

                setDataSize(dataSize + 1); //set the new datasize and setSelectedIndices to the newly selected
                setSelectedIndices(newSelected);
                console.log(newSelected);
                return newSelected;
            });
        } else { //if it is unchecked, reset and update the new setSelectedIndices
            console.log('Unchecked: ' + index);
            setSelected(prevSelected => {
                let newSelected = prevSelected.filter(value => value !== index);

                setDataSize(dataSize + 1);
                setSelectedIndices(newSelected);
                console.log(newSelected);
                return newSelected;
            });
        }
    };

    //uses a use effect hook to update the selected indices 
    useEffect(() => {
        console.log(selectedIndices);
    }, [selectedIndices]);

    //init();

    //returns a menubar, an editor, a barchart, and a scatterplot with event handlers for all of them
    return (
        <Container className="App" >
            <MenuBar
                loadHandler={loadDataset}
                newFileHandler={newDataset}
                saveHandler={saveDataset}
                saveAsHandler={saveAsDataset}
                cutHandler={cutData}
                copyHandler={copyData}
                pasteHandler={pasteData}
            >
            </MenuBar>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} >
                <Item>
                    <Editor
                        dataset={value}
                        sx={{bgcolor: 'white', width: '100%', height: '100%'}}
                        addElementHandler={addElement}
                        deleteElementHandler={deleteElement}
                        editElementHandler={editElement}
                        selected={selected}
                        selectHandler={selectElement}
                        titleHandler={changeTitle}
                        xLabelHandler={changeXLabel}
                        yLabelHandler={changeYLabel}
                    />
                </Item>
                <Item>
                <BarChart dataset={value} 
                selectedIndices={selectedIndices}
                sx={{
                    bgcolor: 'white', width: '100%', height: '100%'
                }}>
                </BarChart>
                </Item>
                <Item>
                    <ScatterPlot
                        dataset={value}
                        selectedIndices={selectedIndices}
                        sx={{ bgcolor: 'white', width: '100%', height: '100%' }}
                    />
                </Item>
            </Box>
        </Container>
    );

}

export default App;
