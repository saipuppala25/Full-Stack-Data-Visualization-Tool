/*
 * Project 2
 * Item component JavaScript source code
 *
 * Author: Sai Puppala
 * Version: 1.0
 */

//import Box and React to use
import {Box} from "@mui/system";
import React from "react";

//Make item import from props
const Item = (props) => {
    const { sx, ...other } = props;
    return ( //it will return an item that has these characteristics
        <Box
            sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
                border: '1px solid',
                borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                p: 1,
                m: 1,
                borderRadius: 2,
                fontSize: '0.875rem',
                fontWeight: '700',
                ...sx,
            }}
            {...other}
        />
    );
}

export default Item; //export that item
