import React, { useState, useEffect } from 'react'

import { Box, Button, CardHeader, DialogActions, Grid, MenuItem } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

import { Card, CardContent } from "@mui/material"
import ViewCamera from "src/@core/components/camera/playback"
import CustomTextField from 'src/@core/components/mui/text-field'
import { callApi } from 'src/@core/utils/requestUltils'
import Timeline from '../mocdata/timeline'
import axios from 'axios'
import toast from 'react-hot-toast'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { utils } from 'xlsx'

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


const convertDateToString = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

const Storage = ({ id, name, channel }) => {
    const [loading, setLoading] = useState(false)
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })

    const [minuteType, setMinuteType] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday;
    });
    const [endDate, setEndDate] = useState(new Date())


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

    const [currentTime, setCurrentTime] = useState(0)

    const [play, setPlay] = useState(true)
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        if (id) {
            fetchDateList()
        }
        setCamera({ id: id, name: name, channel: channel })
    }, [id, startDate, endDate])

    const fetchDateList = async () => {
        setLoading(true)

        const params = {
            startTime: convertDateToString(startDate),
            endTime: convertDateToString(endDate)
        }

        try {
            const res = await callApi(`https://sbs.basesystem.one/ivis/vms/api/v0/playback/camera/${id}?startTime=${params.startTime}&endTime=${params.endTime}`)

            const data = res.data.MatchList.map((item, index) => {
                return item.TimeSpan
            })
            setDataList(data)
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

    const handleDownloadFile = async () => {
        setLoading(true)

        if (camera.id !== '') {

            const params = {
                startTime: convertDateToString(startTime),
                endTime: convertDateToString(endTime)
            }

            try {
                const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/video/download?idCamera=${camera.id}&startTime=${params.startTime}&endTime=${params.endTime}`)
                const videoDownloadUrl = res.data[0].videoDownLoad[0].video

                if (videoDownloadUrl) {
                    await handleExportLinkDownload(videoDownloadUrl)
                } else {
                    toast.error('Không tìm thấy URL tải về video')
                }
            } catch (error) {
                if (error && error?.response?.data) {
                    console.error('error', error)
                    toast.error(error?.response?.data?.message)

                } else {
                    console.error('Error fetching data:', error)
                    toast.error(error)
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const handleExportLinkDownload = async (linkDownload) => {

        const axiosInstance = axios.create();
        try {
            const response = await axiosInstance.get(linkDownload, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clip.mp4');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(error?.message || 'An error occurred while downloading the file.');
        }
    };


    const handSetChanel = (id, channel) => {
        setCamera({ id: id, name: name, channel: channel })
    }

    const handleSetTime = (type) => {
        setTimeType(type)
    }

    const handleSetMinuteType = (type) => {
        setMinuteType(type)
    }

    const handleSetTimeSelected = (data) => {
        setStartTime(data?.startTime)
        setEndTime(data?.endTime)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
                <Card>
                    <CardHeader
                        title='Trích clip'
                        action={
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DatePickerWrapper>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                                            <div>
                                                <DatePicker
                                                    selected={startDate}
                                                    id='basic-input'
                                                    maxDate={endDate}
                                                    onChange={date => setStartDate(date)}
                                                    customInput={<CustomInput label='Ngày bắt đầu' />}
                                                />
                                            </div>
                                        </Box>
                                    </DatePickerWrapper>
                                </Grid>
                                <Grid item xs={4}>
                                    <DatePickerWrapper>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                                            <div>
                                                <DatePicker
                                                    selected={endDate}
                                                    id='basic-input'
                                                    maxDate={new Date()}
                                                    onChange={date => setEndDate(date)}
                                                    customInput={<CustomInput label='Ngày kết thúc' />}
                                                />
                                            </div>
                                        </Box>
                                    </DatePickerWrapper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                                        <CustomTextField select fullWidth id='form-layouts-separator-select' defaultValue='5minute' label='Default'>
                                            {minuteList.map((minute, index) => (
                                                <MenuItem key={minute.id} value={minute.name} onClick={() => handleSetMinuteType(minute.name)}>{minute.value}</MenuItem>
                                            ))}
                                        </CustomTextField>
                                    </Box>
                                </Grid>
                            </Grid>
                        }
                    />
                    <CardContent>
                        {camera.id !== '' &&
                            <Timeline data={dataList} minuteType={minuteType} startDate={startDate} endDate={endDate} callback={handleSetTimeSelected} />
                        }
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
                                    startTime={startTime}
                                    endTime={endTime}
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
                        <Button type='submit' variant='contained' onClick={() => handleDownloadFile()}>
                            Xuất file
                        </Button>
                    </DialogActions>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Storage