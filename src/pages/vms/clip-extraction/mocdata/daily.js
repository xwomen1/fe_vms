import React, { useEffect, useState } from 'react'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Icon from 'src/@core/components/icon'

const convertTimeToMinute = (time) => {
    const res = (time / 1440) * 100;

    return res;
};

const Daily = ({ dateType, dataDailyProps, callbackOfDaily, disabled, minuteType }) => {
    const [dataDaily, setDataDaily] = useState(dataDailyProps || []);
    const [timeType, setTimeType] = useState('month')
    const [minutesType, setMinutesType] = useState('5minute')
    const [dataDailyDefault, setDataDailyDefault] = useState([
        {
            label: '',
            value: 0,
        },
    ]);

    const [timeLines, setTimeLines] = useState(
        ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    )

    const [defaultTimePeriods, setDefaultTimePeriods] = useState([]);

    useEffect(() => {
        callbackOfDaily(dataDaily);
    }, [dataDaily]);

    useEffect(() => {
        if (dataDailyProps) {
            setDataDaily(dataDailyProps);
        }
    }, [dataDailyProps])

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
        getLastDays()
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
        setTimeLines(generateTimeLine(interval));
    }, [minutesType])

    useEffect(() => {
        setDefaultTimePeriods(generateTimePeriods(timeLines))
    }, [timeLines])

    useEffect(() => {
        setDataDaily(
            dataDailyDefault.map((day) => ({
                ...day,
                timePeriods: [],
            }))
        );
    }, [dataDailyDefault])

    // Mảng thời gian mặc định
    // const defaultTimePeriods = [
    //     {
    //         endTimeInMinute: 240,
    //         startTimeInMinute: 0,
    //         type: 1,
    //     },
    //     {
    //         endTimeInMinute: 240 + 240,
    //         startTimeInMinute: 240,
    //         type: 2,
    //     },
    //     {
    //         endTimeInMinute: 240 + 240 + 240,
    //         startTimeInMinute: 240 + 240,
    //         type: 3,
    //     },
    //     {
    //         endTimeInMinute: 240 + 240 + 240 + 240,
    //         startTimeInMinute: 240 + 240 + 240,
    //         type: 4,
    //     },
    //     {
    //         endTimeInMinute: 240 + 240 + 240 + 240 + 240,
    //         startTimeInMinute: 240 + 240 + 240 + 240,
    //         type: 5,
    //     },
    //     {
    //         endTimeInMinute: 240 + 240 + 240 + 240 + 240 + 240,
    //         startTimeInMinute: 240 + 240 + 240 + 240 + 240,
    //         type: 6,
    //     },
    // ];

    // Kiểm tra trạng thái của checkbox
    // useEffect(() => {
    //     if (disabled) {
    //         // Nếu checkbox đã được chọn, thiết lập giá trị mặc định cho dataDaily
    //         setDataDaily(
    //             dataDailyDefault.map((day) => ({
    //                 ...day,
    //                 timePeriods: defaultTimePeriods.map((time) => ({ ...time })),
    //             }))
    //         );
    //     } else {
    //         // Nếu checkbox không được chọn, thiết lập giá trị mặc định cho dataDaily (rỗng)
    //         setDataDaily(
    //             dataDailyDefault.map((day) => ({
    //                 ...day,
    //                 timePeriods: [],
    //             }))
    //         );
    //     }
    // }, [disabled]);

    const onClickChoiceItem = (data, type) => {
        // Kiểm tra trạng thái của checkbox
        if (disabled) {
            return; // Nếu checkbox chưa được tích, không làm gì cả
        }

        const foundDate = dataDaily.find((e) => e.value === type);
        if (foundDate) {
            const newTime = [...(foundDate?.timePeriods || []), data];
            setDataDaily([
                ...dataDaily.filter((e) => e.value !== type),
                { ...foundDate, timePeriods: newTime || [] },
            ]);
        }
    };


    const onClickDeleteItem = (date, time) => {
        if (disabled) {
            return; // Nếu checkbox chưa được tích, không làm gì cả
        }
        const newTime = date.timePeriods.filter((i) => i.type !== time.type);
        setDataDaily([
            ...dataDaily.filter((e) => e.value !== date.value),
            { ...date, timePeriods: newTime || [] },
        ]);
    };

    const generateTimeLine = (interval) => {
        const timeLines = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += interval) {
                const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timeLines.push(formattedTime);
            }
        }
        return timeLines;
    }

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

        const newData = [
            ...daysArray.map((day, index) => {
                return {
                    label: day,
                    value: index + 1,
                };
            })
        ];


        setDataDailyDefault(newData);
    };

    const convertTimeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 50 + minutes
    }

    const generateTimePeriods = (timeLines) => {
        const timePeriods = []
        for (let i = 0; i < timeLines.length - 1; i++) {
            const startTimeInMinute = convertTimeToMinutes(timeLines[i])
            const endTimeInMinute = convertTimeToMinutes(timeLines[i + 1])
            timePeriods.push({
                startTimeInMinute,
                endTimeInMinute,
                type: i + 1
            })
        }

        return timePeriods
    }

    return (
        // <div
        //     style={{
        //         width: '100%',
        //     }}
        // >
        //     {dataDaily
        //         .sort(function (a, b) {
        //             return a.value - b.value;
        //         })
        //         .map((item, index) => {
        //             if (item.value === 0) {
        //                 return (
        //                     <div
        //                         key={index.toString()}
        //                         style={{
        //                             display: 'flex',
        //                             flexDirection: 'row',
        //                             alignItems: 'center',
        //                             marginLeft: 93,
        //                             width: 'calc(100% - 150px)',
        //                             position: 'relative',
        //                             color: 'rgba(0, 0, 0, 0.6)',
        //                             fontSize: 14,
        //                             // overflow: 'auto'
        //                         }}
        //                     >
        //                         {timeLines.map(
        //                             (a, b) => (
        //                                 <div
        //                                     key={b.toString()}
        //                                     style={{
        //                                         width: `${100 / 6}%`,
        //                                         margin: '2px'
        //                                     }}
        //                                 >
        //                                     {a}
        //                                 </div>
        //                             ),
        //                         )}
        //                         <div
        //                             style={{
        //                                 position: 'absolute',
        //                                 right: -33,
        //                             }}
        //                         >
        //                             24:00
        //                         </div>
        //                     </div>
        //                 );
        //             }

        //             return (
        //                 <div
        //                     key={index.toString()}
        //                     style={{
        //                         display: 'flex',
        //                         flexDirection: 'row',
        //                         alignItems: 'center',
        //                         width: '100%',
        //                         marginTop: 6,
        //                         fontSize: 14,
        //                         fontWeight: 400,
        //                         color: 'rgba(0, 0, 0, 0.6)',
        //                     }}
        //                 >
        //                     <div style={{ minWidth: 80 }}>{item.label}</div>
        //                     <div
        //                         style={{
        //                             display: 'flex',
        //                             flexDirection: 'row',
        //                             alignItems: 'center',
        //                             width: '100%',
        //                             height: 36,
        //                             borderRadius: 4,
        //                             position: 'relative',
        //                             border: '1px solid rgba(0, 0, 0, 0.06)',
        //                         }}
        //                     >
        //                         {defaultTimePeriods.map((a, b) => (
        //                             <div
        //                                 style={{
        //                                     width: `${100 / 6}%`,
        //                                     cursor: 'pointer',
        //                                 }}
        //                                 onClick={() => {
        //                                     onClickChoiceItem(a, item.value);
        //                                 }}
        //                                 key={b.toString()}
        //                             >
        //                                 <div
        //                                     style={{
        //                                         width: b === 0 ? 0 : 1,
        //                                         height: 36,
        //                                         backgroundColor: 'rgba(0, 0, 0, 0.12)',
        //                                     }}
        //                                 />
        //                             </div>
        //                         ))}
        //                         {item.timePeriods?.map((a, b) => (
        //                             <div
        //                                 key={b.toString()}
        //                                 onClick={() => {
        //                                     onClickDeleteItem(item, a);
        //                                 }}
        //                                 style={{
        //                                     position: 'absolute',
        //                                     left: `${convertTimeToMinute(a.startTimeInMinute)}%`,
        //                                     height: 36,
        //                                     background: '#7EBBFC',
        //                                     cursor: 'pointer',
        //                                     opacity: 0.8,
        //                                     width: `${convertTimeToMinute(a.endTimeInMinute - a.startTimeInMinute)}%`,
        //                                 }}
        //                             />
        //                         ))}
        //                     </div>
        //                 </div>
        //             );
        //         })}


        // </div>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        {timeLines.map((time, index) => (
                            <TableCell key={index} align="center">
                                {time}
                            </TableCell>
                        ))}
                        <TableCell align="center">24:00</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataDailyDefault.sort((a, b) => a.value - b.value).map((item, index) => (
                        <TableRow key={index.toString()}>
                            <TableCell component="th" scope="row">
                                {item.label}
                            </TableCell>
                            <TableCell colSpan={timeLines.length + 1}
                                style={{
                                    padding: '0',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        height: '100%',
                                        position: 'relative'
                                    }}
                                >
                                    {defaultTimePeriods.map((period, idx) => (
                                        <div
                                            key={idx.toString()}
                                            style={{
                                                width: `${100 / defaultTimePeriods.length}%`,
                                                cursor: 'pointer',
                                                position: 'relative',
                                            }}
                                            onClick={() => onClickChoiceItem(period, item.value)}
                                        >
                                            <div
                                                style={{
                                                    width: idx === 0 ? 0 : 1,
                                                    height: '100%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                                    position: 'absolute',
                                                    left: 0,
                                                }}
                                            />
                                        </div>
                                    ))}
                                    {item.timePeriods?.map((period, idx) => (
                                        <div
                                            key={idx.toString()}
                                            onClick={() => onClickDeleteItem(item, period)}
                                            style={{
                                                position: 'absolute',
                                                left: `${convertTimeToMinute(period.startTimeInMinute)}%`,
                                                height: '36px',
                                                backgroundColor: '#7EBBFC',
                                                cursor: 'pointer',
                                                opacity: 0.8,
                                                width: `${convertTimeToMinute(period.endTimeInMinute - period.startTimeInMinute)}%`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Daily;
