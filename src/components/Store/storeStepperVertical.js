/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './store.css'
import Grid from '@mui/material/Grid';

function StoreStepperVertical(props) {
    const [stepIndex, setStepIndex] = useState(0);


    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
    },[]);

    useEffect(() => {
        // Update the document title using the browser API
        setStepIndex(props.tabIndex);
    },[props.tabIndex]);

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} className="border-l-2 border-gray-700">
                    &nbsp;
                </Grid>
                <Grid onClick={()=>{
                    props.onClickEvent(0);
                }} item xs={12} className={stepIndex === 0 ?'text-white font-semibold cursor-pointer border-l-4 border-color-custom pt-3 pb-3':'border-l-2 border-gray-700 text-gray-400 font-thin cursor-pointer'}>
                    {'Business Info'}
                </Grid>
                <Grid item xs={12} className="border-l-2 border-gray-700">
                    &nbsp;
                </Grid>
                <Grid onClick={()=>{
                    props.onClickEvent(1);
                }} item xs={12} className={stepIndex === 1 ?'text-lg text-white font-semibold cursor-pointer border-l-4 border-color-custom pt-3 pb-3':'border-l-2 border-gray-700 text-gray-400 font-thin cursor-pointer'}>
                    {'Contact Info'}
                </Grid>
                <Grid item xs={12} className="border-l-2 border-gray-700">
                    &nbsp;
                </Grid>
                <Grid onClick={()=>{
                    props.onClickEvent(2);
                }} item xs={12} className={stepIndex === 2 ?'text-white font-semibold cursor-pointer border-l-4 border-color-custom pt-3 pb-3':'border-l-2 border-gray-700 text-gray-400 font-thin cursor-pointer'}>
                    {'Proof'}
                </Grid>
                <Grid item xs={12}>
                    &nbsp;
                </Grid>
            </Grid>
        </>
    );
}

export default StoreStepperVertical;