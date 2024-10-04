/*
 * Project 2
 * ScatterPlot component JavaScript source code
 *
 * Author: Sai Puppala
 * Version: 1.0
 */

//import the necessary things for the scatterplot to have, like the styling, react, useEffect, box, and d3
import './ScatterPlot.css';
import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import * as d3 from 'd3';

let svg = null; //set svg and didMount

let didMount = true;

//set the settings for the viewbox of the scatterplot
const settings = {
    viewBox: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    title: {
        x: 0,
        y: 0,
        width: 100,
        height: 10,
        baseline: 5
    },
    labels: {
        x: 5,
        y: 95,
        width: 95,
        height: 5,
        baseline: 2
    },
    values: {
        x: 0,
        y: 10,
        width: 5,
        height: 90,
        baseline: 4.5,
        min: 0,
        max: 7,
        step: 0.5
    },
    circles: {
        radius: 1
    },
    lines: {
        margin: 1.5
    }
};

//set the scatterplot, so that it pulls from props
const ScatterPlot = (props) => {
    let myReference = React.createRef(); //creates a reference
    let dataset = props.dataset; //set the dataset
    if (dataset) {
        settings.values.max = Math.max(...dataset.data.map(x => Object.values(x)[1]));
    }

    //initialize the scatterplot 
    const init = () => {
        let container = d3.select(myReference.current);
        container
            .selectAll("*")
            .remove();
        svg = container
            .append("svg")
            .attr("viewBox", settings.viewBox.x + " " + settings.viewBox.y + " " + settings.viewBox.width + " " + settings.viewBox.height)
            .attr("preserveAspectRatio", "none")
            .style("width", "100%")
            .style("height", "100%")
            .style("border", "none");
    }

    //paint the scatterplot
    const paint = () => {
        if (!dataset) {
            return;
        }
        svg
            .selectAll("*")
            .remove();

        // Lines
        svg
            .append("g")
            .attr("id", "lines")
            .selectAll("line")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("line")
            .attr("x1", settings.values.x + settings.values.width)
            .attr("x2", settings.values.x + settings.values.width + settings.labels.width - settings.lines.margin)
            .attr("y1", (item, index) => {
                return settings.labels.y - index * settings.values.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .attr("y2", (item, index) => {
                return settings.labels.y - index * settings.values.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .style("stroke", "silver")
            .style("stroke-width", "0.1pt");

        // Circles
        svg
            .append("g")
            .attr("id", "circles")
            .selectAll("circle")
            .data(dataset.data)
            .enter()
            .append("circle")
            .attr("cx", (item, index) => {
                return settings.labels.x + (1 - settings.circles.radius + index + settings.circles.radius / 2) * settings.labels.width / dataset.data.length;
            })
            .attr("cy", (item, index) => {
                return settings.labels.y - Object.values(item)[1] * settings.values.height / (settings.values.max - settings.values.min);
            })
            .attr("r", settings.circles.radius)
            .attr("fill", (item, index) => {
                return props.selectedIndices.indexOf(index) !== -1 ? 'red' : 'dodgerblue';
            });

        // Title
        svg
            .append("g")
            .attr("id", "title")
            .append("text")
            .attr("x", (settings.title.x + settings.title.width) / 2)
            .attr("y", settings.title.y + settings.title.height - settings.title.baseline)
            .text(dataset.title);

        // Labels
        svg
            .append("g")
            .attr("id", "labels")
            .selectAll("text")
            .data(dataset.data)
            .enter()
            .append("text")
            .attr("x", (item, index) => {
            // For Bar Chart
            //return settings.bars.x + (1 - settings.bars.ratio + index + settings.bars.ratio / 2) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);

            // For Scatter Plot
            return settings.labels.x + (1 - settings.circles.radius + index + settings.circles.radius / 2) * settings.labels.width / dataset.data.length;
        })
            .attr("y", settings.labels.y + settings.labels.height - settings.labels.baseline)
            .text((item, index) => {
            return Object.values(item)[0];
        });

        // Values
        svg
            .append("g")
            .attr("id", "values")
            .selectAll("text")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("text")
            .attr("x", settings.values.x + settings.values.width / 2)
            .attr("y", (item, index) => {

            // For Scatter Plot
            return settings.labels.y - index * settings.values.height / ((settings.values.max - settings.values.min) / settings.values.step);
        })
            .text((item, index) => {
            return (item / 2.0).toFixed(1);
        });

    }

    //use a hook to listen if the scatterplot mounted correctly.
    useEffect(() => {
        if (didMount) {
            didMount = false;
            init();
            window.addEventListener('resize', () => {
                paint();
            })
        }
        paint();
    });

    //return the scatterplot
    return (
        <Box ref={myReference} sx={props.sx} >
        </Box>
    );
}

export default ScatterPlot;
