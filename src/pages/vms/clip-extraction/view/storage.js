import React, { useState, useEffect } from 'react'

import { Button, CardHeader, DialogActions, Grid, MenuItem } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

import { Card, CardContent } from "@mui/material"
import ViewCamera from "src/@core/components/camera/playback"
import CustomTextField from 'src/@core/components/mui/text-field'
import { callApi } from 'src/@core/utils/requestUltils'
import Timeline from '../mocdata/timeline'
import axios from 'axios'
import toast from 'react-hot-toast'

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

const Storage = ({ id, name, channel }) => {
    const [loading, setLoading] = useState(false)
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })

    const [timeType, setTimeType] = useState(null)
    const [minuteType, setMinuteType] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)


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
    }, [id])

    const fetchDateList = async () => {
        setLoading(true)

        try {
            const res = await callApi(`https://sbs.basesystem.one/ivis/vms/api/v0/playback/camera/${id}`)

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
            try {
                const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/video/download?idCamera=${camera.id}&startTime=${startTime}&endTime=${endTime}`)
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
                        {camera.id !== '' &&
                            <Timeline data={dataList} dateType={timeType} minuteType={minuteType} callback={handleSetTimeSelected} />
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