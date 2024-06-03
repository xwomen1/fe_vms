import React, { useState, useEffect } from "react"
import TimeRange from "react-video-timelines-slider";
import { format } from "date-fns";
import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";

const Demo = ({ data, dateType, minuteType }) => {
    const [dateData, setDateData] = useState([])
    const [timeType, setTimeType] = useState('day')
    const [minutesType, setMinutesType] = useState('5minute')
    const [dayList, setDayList] = useState([])

    useEffect(() => {
        if (dateType) {
            setTimeType(dateType);
        }
    }, [dateType])

    useEffect(() => {
        if (minuteType) {
            setMinutesType(minuteType);
        }
    }, [minuteType])

    useEffect(() => {
        console.log('data', data)
        if (data) {
            setDateData(data)
        }
    }, [data])

    useEffect(() => {
        let interval = 60; // Mặc định là 1 giờ
        switch (minutesType) {
            case '1minute':
                interval = 1; // 12 phút
                break;
            case '2minute':
                interval = 2; // 2 phút
                break;
            case '5minute':
                interval = 5; // 5 phút
                break;
            default:
                break;
        }
        // setTimeLines(generateTimeLine(interval));
    }, [minutesType])

    useEffect(() => {
        getLastDays()
    }, [timeType])

    const timeline = [
        new Date("2022-11-22T21:51:44.054Z"),
        new Date("2022-11-23T07:15:44.309Z"),
    ];

    const gap = [
        {
            start: new Date("2022-11-23T03:51:44.054Z"),
            end: new Date("2022-11-23T04:15:44.309Z"),
        },
    ];
    const [selectedInterval, setSelectedInterval] = useState([
        new Date("2022-11-22T23:51:44.054Z"),
        new Date("2022-11-23T01:51:44.054Z"),
    ]);
    const [timelineScrubberError, setTimelineScrubberError] = useState(false);

    const timelineScrubberErrorHandler = ({ error }) => {
        setTimelineScrubberError(error);
    };

    const onChangeCallback = (selectedInterval) => {
        setSelectedInterval(selectedInterval);
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
                    daysArray.push(date.toISOString().split('T')[0]); // Chuyển đổi sang định dạng YYYY-MM-DD
                }
                break;
            case 'month':
                for (let i = 0; i < 30; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    daysArray.push(date.toISOString().split('T')[0]); // Chuyển đổi sang định dạng YYYY-MM-DD
                }
                break;
            default:
                break;
        }
        setDayList(daysArray)
    };

    return (
        <Grid container spacing={2}>
            {dayList.map((day, index) =>
                <Grid item xs={12} display={'flex'}>
                    <Typography sx={{ width: '100px' }}>{day}</Typography>
                    <TimeRange
                        showNow
                        error={timelineScrubberError}
                        ticksNumber={6}
                        selectedInterval={selectedInterval}
                        timelineInterval={timeline}
                        onUpdateCallback={timelineScrubberErrorHandler}
                        onChangeCallback={onChangeCallback}
                        disabledIntervals={gap}
                        step={1}
                        formatTick={(ms) => format(new Date(ms), "HH:mm:ss")}
                        formatTooltip={(ms) => format(new Date(ms), "HH:mm:ss.SSS")}
                        showToolTip={true}
                    />
                </Grid>
            )}
        </Grid>
    )
}

export default Demo
