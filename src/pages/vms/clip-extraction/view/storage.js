import React, { useState, useRef } from 'react'

import { Button, CardHeader, DialogActions, Grid, MenuItem, Typography } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import useDebounce from './useDebounce'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import { Stack } from '@mui/material'

// ** Third Party Imports

import DatePicker from 'react-datepicker'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { formatTimeShow, formatDate } from 'src/@core/utils/format'

import { Card, CardContent } from "@mui/material"
import ViewCamera from "src/@core/components/camera/playback"
import Daily from '../mocdata/daily'
import CustomTextField from 'src/@core/components/mui/text-field'


const valueFilterInit = {
    page: 1,
    limit: 50,
    deviceTypes: 'NVR'
}

const dateList = [
    {
        id: 1,
        name: 'day',
        value: '1 ngày'
    },
    {
        id: 2,
        name: 'week',
        value: '7 ngày'
    },
    {
        id: 3,
        name: 'month',
        value: '30 ngày'
    },
]

const minuteList = [
    {
        id: 1,
        name: '1minute',
        value: '1 phút'
    },
    {
        id: 2,
        name: '2minute',
        value: '2 phút'
    },
    {
        id: 3,
        name: '5minute',
        value: '5 phút'
    },
]

const dataDailyDefault = [
    {
        label: '',
        value: 1,
    },
    // {
    //     label: 'Thứ 2',
    //     dayOfWeek: 'MONDAY',
    //     value: 2,
    // },
    // {
    //     label: 'Thứ 3',
    //     dayOfWeek: 'TUESDAY',
    //     value: 3,
    // },
    // {
    //     label: 'Thứ 4',
    //     dayOfWeek: 'WEDNESDAY',
    //     value: 4,
    // },
    // {
    //     label: 'Thứ 5',
    //     dayOfWeek: 'THURSDAY',
    //     value: 5,
    // },
    // {
    //     label: 'Thứ 6',
    //     dayOfWeek: 'FRIDAY',
    //     value: 6,
    // },
    // {
    //     label: 'Thứ 7',
    //     dayOfWeek: 'SATURDAY',
    //     value: 7,
    // },
    // {
    //     label: 'CN',
    //     dayOfWeek: 'SUNDAY',
    //     value: 8,
    // },
]

const Storage = ({ id, name, channel }) => {
    const [camera, setCamera] = useState()
    const [channelCurrent, setChannelCurrent] = useState(null)

    const [dataDaily, setDataDaily] = useState([])
    const [timeType, setTimeType] = useState(null)
    const [minuteType, setMinuteType] = useState(null)
    const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)


    function formatTime(timeInSeconds) {
        const result = new Date(timeInSeconds * 1000).toTimeString().substr(0, 8)

        return result
    }

    const msToTime = duration => {

        const seconds = Math.floor((duration / 1000) % 60)
        const minutes = Math.floor((duration / (1000 * 60)) % 60)
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
        const count = seconds + minutes * 60 + hours * 3600

        return count
    }

    const [time, setTime] = useState(new Date())
    const [dateTime, setDateTime] = useState(new Date())

    const [timeFilter, setTimeFilter] = useState({
        start_time: new Date() - 60 * 60 * 1000,
        end_time: new Date()
    })
    const datePickerRef = useRef(null)


    const [play, setPlay] = useState(true)
    const [valueRange, setValueRange] = useState(60 * 60 * 1000)
    const debouncedSearch = useDebounce(valueRange, 700)

    const onClickPlay = v => {
        setPlay(v)

        // if (videoId) {
        //   if (!v) {
        //     videoId.pause();
        //     if (stopAndStartRecord) {
        //       onClickCut('pause');
        //     }
        //   } else {
        //     if (isScreen && isScreen === 'detail' && onChangeCurTimePlayback) {
        //       const acb = timeFilter.start_time + parseInt(valueRange) - 6000;
        //       onChangeCurTimePlayback(acb);
        //     }
        //     videoId.play();
        //   }
        // }
    }

    function timeDisplay(time) {
        if (time < 10)

            return '0' + time

        return time
    }
    function valuetext(value) {

        const timeCurrent = new Date(timeFilter.start_time + value)

        return `${timeCurrent.getFullYear() +
            '/' +
            timeDisplay(timeCurrent.getMonth() + 1) +
            '/' +
            timeCurrent.getDate() +
            ' ' +
            timeDisplay(timeCurrent.getHours()) +
            ':' +
            timeDisplay(timeCurrent.getMinutes())
            }`
    }

    const handleIconClick = () => {
        if (datePickerRef.current) {
            datePickerRef.current.setOpen(true)
        }
    }

    const renderMarks = () => {
        const marks = []
        const part = 10
        for (let i = 0; i <= part; i++) {
            let step = Math.floor(valueRange / part)
            let timeCurrent = new Date(timeFilter.start_time + step * i)
            marks.push({
                value: step * i,
                label: timeCurrent.getHours() + ':' + timeCurrent.getMinutes()
            })
        }


        return marks
    }

    const handSetChanel = (channel) => {
        setChannelCurrent(channel)
    }

    const handleSetTime = (type) => {
        setTimeType(type)
    }

    const handleSetMinuteType = (type) => {
        setMinuteType(type)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
                <Card>
                    <CardHeader
                        title='Trích clip'
                        action={
                            <Grid container spacing={2}>

                                <Grid item xs={12}>
                                    <CustomTextField select fullWidth id='form-layouts-separator-select' defaultValue='5minute'>
                                        {minuteList.map((date, index) => (
                                            <MenuItem value={date.name} onClick={() => handleSetMinuteType(date.name)}>{date.value}</MenuItem>
                                        ))}
                                    </CustomTextField>
                                </Grid>
                            </Grid>
                        }
                    />
                    <CardContent>
                        <Daily
                            callbackOfDaily={(v) => {
                                setDataDaily(v)
                                setDataDailyState(v)
                            }}
                            // dataDailyProps={dataDailyState}
                            dateType={timeType}
                            minuteType={minuteType}
                            aria-describedby='validation-basic-last-name'
                        />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card>
                    <Grid container spacing={2} sx={{ marginBottom: 5 }}>
                        <Grid item xs={12}>
                            {id === '' &&
                                <div style={{ height: '30vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
                                    <IconButton disabled>
                                        <Icon icon="tabler:player-play-filled" width='48' height='48' style={{ color: '#FF9F43' }} />
                                    </IconButton>
                                </div>}
                            {id !== '' && channel !== '' &&
                                <ViewCamera
                                    id={id}
                                    name={name}
                                    channel={channel}
                                    sizeScreen={'1x1'}
                                    handSetChanel={handSetChanel}
                                />
                            }
                        </Grid>
                    </Grid>
                    <DialogActions
                        sx={{
                            justifyContent: 'center',
                            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                        }}
                    >
                        <Button type='submit' variant='contained'>
                            Xuất file
                        </Button>
                    </DialogActions>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Storage