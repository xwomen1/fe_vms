import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Grid, Typography } from "@mui/material";
import TimeRange from "src/@core/components/timelines";

const convertDateToString1 = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const convertDateToString = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const Timeline = ({ data, minuteType, callback, startDate, endDate }) => {
    const [dateData, setDateData] = useState([]);
    const [minutesType, setMinutesType] = useState('5minute');
    const [dateList, setDateList] = useState([]);
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
        if (data) {
            const datesInRange = handleUpdateListDate(startDate, endDate)
            const dateOfList = datesInRange.map(date => date)
            setDateList(dateOfList)
            const newData = splitDataByDay(data);
            setDateData(newData);
        }
    }, [data]);

    useEffect(() => {
        if (dateList.length) {
            updateTimelines();
        }
    }, [dateList]);

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


    useEffect(() => {
    }, [gaps])

    const timelineScrubberErrorHandler = ({ error }) => {
        setTimelineScrubberError(error);
    };

    const onChangeCallback = (day, intervalIndex) => (selectedInterval) => {
        setSelectedIntervals((prev) => {
            const newSelectedIntervals = { ...prev };
            newSelectedIntervals[day][intervalIndex] = selectedInterval;

            return newSelectedIntervals;
        });
        setSelectedTime(selectedInterval);
    };

    const handleUpdateListDate = (start, end) => {
        const dates = []

        if (start?.getDate() <= end?.getDate()) {
            const gap = end?.getDate() - start?.getDate()
            const currentDate = new Date(start.getTime())
            for (let i = 0; i <= gap; i++) {
                const dateString = convertDateToString1(currentDate).split('T')[0]
                dates.push(dateString)
                currentDate.setDate(currentDate.getDate() + 1)
            }
        }

        return dates
    }

    const updateTimelines = () => {
        const newTimelines = {};
        const newSelectedIntervals = {};

        dateList.forEach((day) => {
            const date = new Date(day);
            const start1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            const end1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 59, 59);
            const start2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
            const end2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

            newTimelines[day] = [
                [start1, end1],
                [start2, end2]
            ];
            newSelectedIntervals[day] = [
                [start1, new Date(start1.getTime() + 10 * 60 * 1000)],
                [start2, new Date(start2.getTime() + 10 * 60 * 1000)]
            ];
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
                endOfDay.setHours(24, 0, 0, 0); // Set giờ cuối cùng của ngày

                const startOfNextDay = new Date(startTime);
                startOfNextDay.setDate(startOfNextDay.getDate() + 1);
                startOfNextDay.setHours(0, 0, 0, 0); // Set giờ đầu tiên của ngày tiếp theo

                newData.push({
                    StartTime: convertDateToString1(startTime),
                    EndTime: convertDateToString1(endOfDay),
                });

                newData.push({
                    StartTime: convertDateToString1(startOfNextDay),
                    EndTime: convertDateToString1(endTime),
                });
            } else {
                newData.push({
                    StartTime: convertDateToString1(startTime),
                    EndTime: convertDateToString1(endTime),
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

            // Kiểm tra xem start và end có trùng nhau không
            if (start.getTime() !== end.getTime()) {
                dataDate.push({
                    start: end,
                    end: start,
                });
            }
        }

        //Thêm khoảng trống từ thời gian cuối cùng đến thời gian hiện tại
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

            {
                Array.isArray(selectedTime) && selectedTime.length === 2 && selectedTime.every(item => item instanceof Date) &&
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography>Khoảng thời gian đã chọn:  <span style={{ color: "#FF9F43", fontWeight: 600 }}>{convertDateToString(selectedTime[0])}</span> đến <span style={{ color: "#FF9F43", fontWeight: 600 }}>{convertDateToString(selectedTime[1])}</span></Typography>
                </Grid>
            }

            {dateList.map((day, index) => (
                <Grid item xs={12} key={index} style={{ marginBottom: '10px' }}>
                    <Typography sx={{ minWidth: '100px' }}>Ngày {day} :</Typography>
                    {(timelines[day] || []).map((interval, intervalIndex) => (
                        <TimeRange
                            key={`${day}-${intervalIndex}`}
                            showNow
                            error={timelineScrubberError}
                            ticksNumber={24 * 2} // 12 ticks to show every 5 minutes
                            selectedInterval={selectedIntervals[day][intervalIndex] || []}
                            timelineInterval={interval || []}
                            onUpdateCallback={timelineScrubberErrorHandler}
                            onChangeCallback={onChangeCallback(day, intervalIndex)}
                            disabledIntervals={gaps || []}
                            step={10 * 60 * 1000}
                            formatTick={(ms) => format(new Date(ms), "HH:mm")}
                            formatTooltip={(ms) => format(new Date(ms), "HH:mm:ss")}
                            showToolTip={true}
                        />
                    ))}
                </Grid>
            ))}
        </Grid>
    );
};

export default Timeline;
