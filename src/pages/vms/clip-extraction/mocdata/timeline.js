import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Grid, Typography } from "@mui/material";
import TimeRange from "src/@core/components/timelines";

const convertDateToString = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const dataList = [
    {
        StartTime: '2024-06-04T06:14:59Z',
        EndTime: '2024-06-05T06:30:30Z'
    },
    {
        StartTime: '2024-06-05T10:14:59Z',
        EndTime: '2024-06-06T06:30:30Z'
    },
    {
        StartTime: '2024-06-06T06:40:30Z',
        EndTime: '2024-06-06T12:30:30Z'
    },
    {
        StartTime: '2024-06-06T12:50:30Z',
        EndTime: '2024-06-06T22:30:30Z'
    },
];

const Timeline = ({ data, minuteType, callback }) => {
    const [dateData, setDateData] = useState([]);
    const [minutesType, setMinutesType] = useState('5minute');
    const [dayList, setDayList] = useState([]);
    const [timelines, setTimelines] = useState({});
    const [selectedIntervals, setSelectedIntervals] = useState({});
    const [timelineScrubberError, setTimelineScrubberError] = useState(false);
    const [gaps, setGaps] = useState([]);
    const [selectedTime, setSelectedTime] = useState({})


    useEffect(() => {
        if (minuteType) {
            setMinutesType(minuteType);
        }
    }, [minuteType]);

    useEffect(() => {
        let interval = 60; // Default is 1 hour
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
    }, [minutesType]);

    useEffect(() => {
        getLastDays();
    }, []);

    useEffect(() => {
        if (data) {
            const newData = splitDataByDay(data);
            setDateData(newData);
        }
    }, [data]);

    useEffect(() => {
        if (dayList.length) {
            updateTimelines();
        }
    }, [dayList]);

    useEffect(() => {
        if (dateData.length) {
            const gap = calculateDateGap(dateData);
            setGaps(gap);
        }
    }, [dateData]);

    useEffect(() => {
        if (Array.isArray(selectedTime) && selectedTime.length === 2 && selectedTime.every(item => item instanceof Date)) {
            const detail = {
                startTime: selectedTime[0],
                endTime: selectedTime[1]
            }
            callback(detail)
        }
    }, [selectedTime])


    const timelineScrubberErrorHandler = ({ error }) => {
        setTimelineScrubberError(error);
    };

    const onChangeCallback = (day) => (selectedInterval) => {
        setSelectedIntervals((prev) => ({
            ...prev,
            [day]: selectedInterval,
        }));
        setSelectedTime(selectedInterval)
    };

    const getLastDays = () => {
        let daysArray = [];
        daysArray.push(new Date().toISOString().split('T')[0]);
        setDayList(daysArray);
    }

    const updateTimelines = () => {
        const newTimelines = {};
        const newSelectedIntervals = {};

        dayList.forEach((day) => {
            const date = new Date(day);
            const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour to start
            newTimelines[day] = [start, new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)];
            newSelectedIntervals[day] = [start, end];
        });

        setTimelines(newTimelines);
        setSelectedIntervals(newSelectedIntervals);
    };

    const splitDataByDay = (data) => {
        const newData = [];

        data.forEach((item) => {
            const startTime = new Date(item.StartTime);
            const endTime = new Date(item.EndTime);

            startTime.setUTCHours(startTime.getUTCHours() - 7);
            endTime.setUTCHours(endTime.getUTCHours() - 7);

            // Kiểm tra nếu ngày bắt đầu và kết thúc của mục là khác nhau
            if (startTime.toDateString() !== endTime.toDateString()) {
                const endOfDay = new Date(startTime);
                endOfDay.setHours(23, 59, 59, 999); // Set giờ cuối cùng của ngày

                const startOfNextDay = new Date(startTime);
                startOfNextDay.setDate(startOfNextDay.getDate() + 1);
                startOfNextDay.setHours(0, 0, 0, 0); // Set giờ đầu tiên của ngày tiếp theo

                newData.push({
                    StartTime: convertDateToString(startTime),
                    EndTime: convertDateToString(endOfDay),
                });

                newData.push({
                    StartTime: convertDateToString(startOfNextDay),
                    EndTime: convertDateToString(endTime),
                });
            } else {
                newData.push({
                    StartTime: convertDateToString(startTime),
                    EndTime: convertDateToString(endTime),
                });
            }
        });

        return newData;
    };

    const calculateDateGap = (data) => {
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 0);

        let dataDate = [];

        // Thêm khoảng trống từ đầu ngày đầu tiên đến thời gian bắt đầu đầu tiên
        if (data.length > 0) {
            const firstDate = new Date(data[0].StartTime);
            const startOfDay = new Date(firstDate);
            startOfDay.setHours(0, 0, 0, 0);

            if (firstDate.getTime() !== startOfDay.getTime()) {
                dataDate.push({
                    start: startOfDay,
                    end: firstDate,
                });
            }
        }

        for (let i = 0; i < data.length - 1; i++) {
            const start = new Date(data[i].EndTime);
            const end = new Date(data[i + 1].StartTime);

            dataDate.push({
                start: end,
                end: start,
            });
        }

        // Thêm khoảng trống từ thời gian cuối cùng đến thời gian hiện tại
        if (data.length > 0) {
            const lastEnd = new Date(data[data.length - 1].EndTime);
            dataDate.push({
                start: lastEnd,
                end: currentDate,
            });
        }

        return dataDate;
    };

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
                        disabledIntervals={gaps || []}
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

Timeline.getInitialProps = async () => {
    // Chuẩn bị dữ liệu cần thiết ở đây
    return {
        data: dataList,
        dateType: 'day',
        minuteType: '5minute',
    };
};

export default Timeline;
