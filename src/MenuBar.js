/*
 * Project 2
 * Editor component JavaScript source code
 *
 * Author: Sai Puppala
 * Version: 1.0
 */

import './MenuBar.css';
import React from "react";
import Box from '@mui/material/Box';
import {
    AppBar,
    Button,
    Toolbar,
    Menu,
    MenuItem,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogActions, List, ListItemText, ListItemButton
} from "@mui/material";
import TextField from "@mui/material/TextField";
import axios from 'axios'; 
import { useState, useEffect } from 'react';

const MenuBar = (props) => {
    const [fileAnchor, setFileAnchor] = React.useState(null);   //Anchor for file menu
    const [newOpen, setNewOpen] = React.useState(false);    //New dialog state
    const [loadOpen, setLoadOpen] = React.useState(false);    //Load dialog state
    const [saveOpen, setSaveOpen] = React.useState(false);    //Save As dialog state
    const [fileName, setFileName] = React.useState('');    //New File Name
    const fileOpen = Boolean(fileAnchor);   //File Menu state
    const [data, setData] = useState([]);
    // Add these state variables at the beginning of your component function
    const [editAnchor, setEditAnchor] = React.useState(null); // Anchor for edit menu
    const editOpen = Boolean(editAnchor); // Edit Menu state
    // Add this state variable at the beginning of your MenuBar component function


    //handles when the file button is clicked
    const handleFileClick = (event) => {
        setFileAnchor(event.currentTarget);
    };
    //handles when the file button is closed
    const handleFileClose = () => {
        setFileAnchor(null);
    };

    //handles when the edit button is clicked
    const handleEditClick = (event) => {
        setEditAnchor(event.currentTarget);
    };
    
    //handles when the edit button is closed
    const handleEditClose = (action) => {
        setEditAnchor(null);
    };
    

    //Again use a use effect hook to find the database's elements to use for later
    useEffect(() => {
        axios.get('http://localhost:3001/db/find') //using axios, it gets the database, which is found at this path
          .then((res) => {
            setData(res.data); //sets the data to the database found
          })
      }, []);

    //return two sets of buttons, one with file, and one with edit, where file will have the load, new, save, and save as options.
    //The edit button will have the cut, copy, and paste options, all with their respective handlers.
    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <div>
                        <Button
                            sx={{ bgcolor: 'white', color: 'blue'}}
                            id="basic-button"
                            aria-controls={fileOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={fileOpen ? 'true' : undefined}
                            onClick={handleFileClick}
                        >
                            File
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={fileAnchor}
                            open={fileOpen}
                            onClose={handleFileClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {setNewOpen(true)}} >New</MenuItem>
                            <Dialog open={newOpen} onClose={() => {setNewOpen(false)}} >
                                <DialogTitle>Enter new file name</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="newFileName"
                                        label="File Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setNewOpen(false)}} >Cancel</Button>
                                    <Button onClick={() => {props.newFileHandler(fileName); setFileName(''); setNewOpen(false)}} >Submit</Button>
                                </DialogActions>
                            </Dialog>

                            <MenuItem onClick={() => {setLoadOpen(true);}} >Load</MenuItem>
                            <Dialog open={loadOpen} onClick={() => {setLoadOpen(false)}} >
                                <DialogTitle>Select file to load</DialogTitle>
                                <List sx={{ pt: 0 }}>
                                {data.map((item, index) => (
                                    <ListItemButton onClick={() => props.loadHandler(item._id)} key={index}>
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                ))}
                                </List>
                            </Dialog>

                            <MenuItem onClick={props.saveHandler}>Save</MenuItem>

                            <MenuItem onClick={() => {setSaveOpen(true)}}>Save As</MenuItem>
                            <Dialog open={saveOpen} onClose={() => {setSaveOpen(false)}}>
                                <DialogTitle>Enter File Name</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="File Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setSaveOpen(false)}} >Cancel</Button>
                                    <Button onClick={() => {props.saveAsHandler(fileName); setFileName(''); setSaveOpen(false)}} >Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Menu>
                        <Button
                            sx={{ bgcolor: 'white', color: 'blue' , marginLeft: '10px'}}
                            id="edit-button"
                            aria-controls={editOpen ? 'edit-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={editOpen ? 'true' : undefined}
                            onClick={handleEditClick}
                        >
                            Edit
                        </Button>
                        <Menu
                            id="edit-menu"
                            anchorEl={editAnchor}
                            open={editOpen}
                            onClose={() => handleEditClose()}
                            MenuListProps={{
                            'aria-labelledby': 'edit-button',
                        }}
                        > 
                            <MenuItem onClick={props.cutHandler}>Cut</MenuItem>
                            <MenuItem onClick={props.copyHandler}>Copy</MenuItem>
                            <MenuItem onClick={props.pasteHandler}>Paste</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default MenuBar;
