import React, { useState, useRef, useEffect } from 'react'

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
import { callApi } from 'src/@core/utils/requestUltils'
import Demo from '../mocdata/demo'

import TimeRange from "react-video-timelines-slider"
import { format } from 'date-fns'


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
    }
]

const Storage = ({ id, name, channel }) => {
    const [loading, setLoading] = useState(false)
    const [camera, setCamera] = useState({ id: id, name: name, channel: channel })
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

    const time_start = new Date().getTime() - 60 * 60 * 1000
    const time_end = new Date().getTime()

    const [time, setTime] = useState(new Date())
    const [dateTime, setDateTime] = useState(new Date())

    const [timeFilter, setTimeFilter] = useState({
        start_time: time_start,
        end_time: time_end
    })

    const [timePlay, setTimePlay] = useState(time_start)
    const [currentTime, setCurrentTime] = useState(0)


    const [play, setPlay] = useState(true)
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        if (id) {
            fetchDateList()
        }
    }, [id])

    const fetchDateList = async () => {
        setLoading(true)

        try {
            const res = await callApi(`https://sbs.basesystem.one/ivis/vms/api/v0/playback/camera/${id}`)
            const data = res.data.MatchList.map((item, index) => {
                return item.TimeSpan
            })
            setDataList(data)
            console.log('data', data)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('Error 404: Not Found', error.response.data)
            } else {
                console.error('Error fetching data:', error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handSetChanel = (id, channel) => {
        setCamera({ id: id, name: name, channel: channel })
    }

    const handleSetTime = (type) => {
        setTimeType(type)
    }

    const handleSetMinuteType = (type) => {
        setMinuteType(type)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
                <Card>
                    <CardHeader
                        title='Trích clip'
                        action={
                            <Grid container spacing={2}>

                                <Grid item xs={6}>
                                    <CustomTextField select fullWidth id='form-layouts-separator-select' defaultValue='5minute'>
                                        {minuteList.map((minute, index) => (
                                            <MenuItem key={minute.id} value={minute.name} onClick={() => handleSetMinuteType(minute.name)}>{minute.value}</MenuItem>
                                        ))}
                                    </CustomTextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomTextField select fullWidth id='form-layouts-separator-select' defaultValue='day'>
                                        {dateList.map((date, index) => (
                                            <MenuItem key={date.id} value={date.name} onClick={() => handleSetTime(date.name)}>{date.value}</MenuItem>
                                        ))}
                                    </CustomTextField>
                                </Grid>
                            </Grid>
                        }
                    />
                    <CardContent>
                        {/* <Daily
                            callbackOfDaily={(v) => {
                                setDataDaily(v)
                                setDataDailyState(v)
                            }}

                            // dataDailyProps={dataDailyState}

                            dateType={timeType}
                            minuteType={minuteType}
                            aria-describedby='validation-basic-last-name'
                        /> */}
                        <Demo data={dataList} dateType={timeType} minuteType={minuteType} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
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
                                    name={camera.name}
                                    id={camera.id}
                                    channel={camera.channel}
                                    play={play}
                                    startTime={timePlay || time_start}
                                    endTime={timeFilter?.end_time || time_end}
                                    onChangeCurrentTime={time => {
                                        setCurrentTime(1000 * time)
                                    }}
                                    sizeScreen={'1x1.8'}
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