import React, { useState, useEffect } from "react";
import TimeRange from "react-video-timelines-slider";
import { format } from "date-fns";
import { Grid, Typography } from "@mui/material";

const Demo = ({ data, dateType, minuteType }) => {
    const [dateData, setDateData] = useState([]);
    const [timeType, setTimeType] = useState('day');
    const [minutesType, setMinutesType] = useState('5minute');
    const [dayList, setDayList] = useState([]);
    const [timelines, setTimelines] = useState({});
    const [selectedIntervals, setSelectedIntervals] = useState({});
    const [timelineScrubberError, setTimelineScrubberError] = useState(false);
    const [gaps, setGaps] = useState([])

    useEffect(() => {
        if (dateType) {
            setTimeType(dateType);
        }
    }, [dateType]);

    useEffect(() => {
        if (minuteType) {
            setMinutesType(minuteType);
        }
    }, [minuteType]);

    useEffect(() => {
        let interval = 60; // Mặc định là 1 giờ
        switch (minutesType) {
            case '1minute':
                interval = 1;
                break;
            case '2minute':
                interval = 2;
                break;
            case '5minute':
                interval = 5;
                break;
            default:
                break;
        }
        // setTimeLines(generateTimeLine(interval)); // Hàm này không được cung cấp
    }, [minutesType]);

    useEffect(() => {
        getLastDays();
    }, [timeType]);

    useEffect(() => {
        if (data) {
            console.log('data', data)
            setDateData(data);
            updateTimeGaps(data)
        }
    }, [data]);

    useEffect(() => {
        if (dayList.length) {
            updateTimelines();
        }
    }, [dayList]);

    useEffect(() => {
        // console.log('timelines', timelines)
        // console.log('selectedIntervals', selectedIntervals)
        // updateTimeGap()
    }, [timelines, selectedIntervals, gaps])

    const timelineScrubberErrorHandler = ({ error }) => {
        setTimelineScrubberError(error);
    };

    const onChangeCallback = (day) => (selectedInterval) => {
        setSelectedIntervals(prev => ({
            ...prev,
            [day]: selectedInterval
        }));
    };

    const getLastDays = () => {
        let daysArray = [];

        switch (timeType) {
            case 'day':
                daysArray.push(new Date().toISOString().split('T')[0]);
                break;
            case 'week':
                for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    daysArray.push(date.toISOString().split('T')[0]);
                }
                break;
            case 'month':
                for (let i = 0; i < 30; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    daysArray.push(date.toISOString().split('T')[0]);
                }
                break;
            default:
                break;
        }
        setDayList(daysArray);
    };

    const updateTimelines = () => {
        const newTimelines = {};
        const newSelectedIntervals = {};

        dayList.forEach(day => {
            const date = new Date(day);
            const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // Thêm 1 giờ vào start
            newTimelines[day] = [start, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)];
            newSelectedIntervals[day] = [start, end];
        });

        setTimelines(newTimelines);
        setSelectedIntervals(newSelectedIntervals);
    };

    const updateTimeGaps = (data) => {
        const dateRanges = [];
        let currentDate = null;

        for (const { StartTime, EndTime } of data) {


            const startDate = new Date(StartTime).toLocaleDateString();
            const endDate = new Date(EndTime).toLocaleDateString();

            console.log('startTime', startDate)
            console.log('EndTime', endDate)

            if (currentDate === null || startDate !== currentDate) {
                if (currentDate !== null) {
                    dateRanges.push({
                        start: new Date(currentDate).toISOString(),
                        end: new Date(new Date(currentDate).getFullYear(), new Date(currentDate).getMonth(), new Date(currentDate).getDate(), 23, 59, 59).toISOString()
                    });
                }
                currentDate = startDate;
            }

            dateRanges.push({
                start: StartTime,
                end: EndTime
            });
        }

        if (currentDate !== null) {
            dateRanges.push({
                start: new Date(currentDate).toISOString(),
                end: new Date(new Date(currentDate).getFullYear(), new Date(currentDate).getMonth(), new Date(currentDate).getDate(), 23, 59, 59).toISOString()
            });
        }

        console.log(dateRanges);
    }

    return (
        <Grid container spacing={2}>
            {dayList.map((day, index) => (
                <Grid item xs={12} display={'flex'} key={index}>
                    <Typography sx={{ width: '100px' }}>{day}</Typography>
                    <TimeRange
                        showNow
                        error={timelineScrubberError}
                        ticksNumber={6}
                        selectedInterval={selectedIntervals[day] || []}
                        timelineInterval={timelines[day] || []}
                        onUpdateCallback={timelineScrubberErrorHandler}
                        onChangeCallback={onChangeCallback(day)}
                        disabledIntervals={[]}
                        step={1}
                        formatTick={(ms) => format(new Date(ms), "HH:mm:ss")}
                        formatTooltip={(ms) => format(new Date(ms), "HH:mm:ss.SSS")}
                        showToolTip={true}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default Demo;
