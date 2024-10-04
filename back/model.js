/*
 * Project 2
 * model back-end JavaScript code
 *
 * Author: Sai Puppala
 * Version: 1.0
 */

// Import mongoose library
const mongoose = require('mongoose');

// Create schema
const tableSchema = new mongoose.Schema({
    title: String,
    data: Array
    /*records: {
        type: Array,
        items: {
            type: Object,
            properties: {
                Item: String,
                Description: String,
                'Price ($)': String
            }
        }
    },
    footer: String*/
});


// Export schema
module.exports = mongoose.model('Datasets', tableSchema, 'Datasets');