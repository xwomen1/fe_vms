import React, { useState, useRef, useEffect } from 'react'

import { Grid, Typography } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import useDebounce from './useDebounce'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import { Stack } from '@mui/material'

// ** Custom Component Imports
import { formatTimeShow } from 'src/@core/utils/format'

import { Card } from "@mui/material"
import ViewCamera from "src/@core/components/camera/playback"

const Review = ({ id, name, channel, data }) => {
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

    const [loading, setLoading] = useState(false)
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
    const [monthOfYear, setMonthOfYear] = useState((new Date()).getMonth() + 1)
    const [year, setYear] = useState((new Date()).getFullYear())
    const [eventDates, setEventDates] = useState([])
    const [speed, setSpeed] = useState(1)
    const [timestamp, setTimestamp] = useState(data?.timestamp)

    // const time_start = new Date().getTime() - 60 * 60 * 1000
    // const time_end = new Date().getTime()

    const [dateTime, setDateTime] = useState(new Date())

    const [timeFilter, setTimeFilter] = useState({
        start_time: timestamp - 5 * 60 * 1000,
        end_time: timestamp + 5 * 60 * 1000
    })

    const [timePlay, setTimePlay] = useState(timestamp - 5 * 60 * 1000)
    const [currentTime, setCurrentTime] = useState(0)
    const datePickerRef = useRef(null)
    const [play, setPlay] = useState(true)
    const [valueRange, setValueRange] = useState(60 * 60 * 1000)
    const debouncedSearch = useDebounce(valueRange, 700)
    const [duration, setDuration] = useState(0)
    const [reload, setReload] = useState(0)
    const [volume, setVolume] = useState(30)

    useEffect(() => {
        setCamera({ id: id, name: name, channel: channel })
    }, [reload])

    const onClickPlay = v => {
        setCamera({ id: id, name: name, channel: channel })
        setPlay(v)
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

    const renderMarksSpeed = () => {
        const marks = [
            {
                value: 0.5,
                label: '0.5x'
            },
            {
                value: 0.75,
                label: '0.75x'
            },
            {
                value: 1,
                label: '1x'
            },
            {
                value: 1.5,
                label: '1.5x'
            },
            {
                value: 2,
                label: '2x'
            }
        ]

        return marks
    }

    const handSetChanel = (id, channel) => {
        setCamera({ id: id, name: name, channel: channel })
    }

    const handleSeekChange = (event, newValue) => {
        setCurrentTime(0)
        setTimePlay(timeFilter.start_time + newValue)
        setCamera({ id: '', name: '', channel: '' })
        setReload(reload + 1)
    }

    return (
        <Card>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    {camera.id === '' &&
                        <div style={{ height: '70vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
                            <IconButton disabled>
                                <Icon icon="tabler:player-play-filled" width='48' height='48' style={{ color: '#FF9F43' }} />
                            </IconButton>
                        </div>
                    }
                    {camera.id !== '' &&
                        <ViewCamera
                            id={camera.id}
                            name={camera.name}
                            channel={camera.channel}
                            sizeScreen={'1x1.2'}
                            startTime={timePlay || time_start}
                            endTime={timeFilter?.end_time || time_end}
                            play={play}
                            duration={duration}
                            onChangeDuration={setDuration}
                            onChangeCurrentTime={time => {
                                setCurrentTime(1000 * time)
                            }}
                            volume={volume}
                            handSetChanel={handSetChanel}
                        />
                    }
                </Grid>
                <Grid item xs={12}>
                    <div className='bottom-controls' style={{ background: '#000' }}>
                        <div className='left-controls'>
                            <Box className='w-100' sx={{ px: 2 }}>
                                <Slider
                                    defaultValue={1}
                                    min={0.5}
                                    max={2}
                                    step={0.25}
                                    marks={renderMarksSpeed()}
                                    value={speed}
                                    onChange={(event, newValue) => {
                                        setSpeed(newValue)
                                    }}
                                    valueLabelDisplay='auto'
                                    color='secondary'
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            width: 8,
                                            height: 8,
                                            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                            '&::before': {
                                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)'
                                            },
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`
                                            },
                                            '&.Mui-active': {
                                                width: 20,
                                                height: 20
                                            }
                                        },
                                        '& .MuiSlider-track': {
                                            backgroundColor: '#fff',
                                            opacity: 0
                                        },
                                        '& .MuiSlider-rail': {
                                            opacity: 0.28,
                                            backgroundColor: '#fff'
                                        },
                                        '& .MuiSlider-markLabel': {
                                            color: '#fff'
                                        }
                                    }}
                                />
                            </Box>
                            <div className='w-100' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {timeFilter && (
                                    <IconButton
                                        style={{ padding: 5, margin: '0 8px 0 8px' }}
                                        onClick={() => {
                                            // onChangeRange(1);
                                        }}
                                    >
                                        <Icon icon='mage:previous' size='1.2em' color='#FFF' />
                                    </IconButton>
                                )}

                                {timeFilter && (
                                    <IconButton onClick={() => onClickPlay(!play)} style={{ padding: 5, margin: '0 8px 0 8px' }}>
                                        {!play ? (
                                            <Icon icon='ph:play-light' size='1.2em' color='#FFF' />
                                        ) : (
                                            <Icon icon='ic:twotone-pause' size='1.2em' color='#FFF' />
                                        )}
                                    </IconButton>
                                )}
                                <IconButton style={{ padding: 5, margin: '0 8px 0 8px' }}>
                                    <Icon icon='mage:next' size='1em' color='#FFF' />
                                </IconButton>
                            </div>

                            <div style={{ marginTop: 8 }} className='time'>
                                <time id='time-elapsed'>{`${formatTimeShow(timeFilter.start_time)}`}</time>
                                <span>{`/${formatTimeShow(timeFilter.end_time)}`}</span>
                            </div>
                        </div>
                        <div className='slidecontainer-2'>
                            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                                <IconButton
                                    style={{ padding: 5 }}
                                    onClick={() => {
                                        setValueRange(valueRange * 2)
                                        setTimeFilter({
                                            ...timeFilter,
                                            end_time: timeFilter.end_time + valueRange
                                        })
                                    }}
                                >
                                    <Icon icon='tabler:plus' size='1em' color='#FFF' />
                                </IconButton>
                                <IconButton
                                    onClick={() => {
                                        setValueRange(valueRange / 2)
                                        setTimeFilter({
                                            ...timeFilter,
                                            end_time: timeFilter.end_time - valueRange
                                        })
                                    }}
                                    style={{ padding: 5 }}
                                >
                                    <Icon icon='tabler:minus' size='1em' color='#FFF' />
                                </IconButton>
                                <Typography style={{ color: '#fff', fontWeight: 'bold' }}>
                                    {`${Math.floor(valueRange / (60 * 60 * 1000))} giờ -  ${(valueRange - 60 * 60 * 1000 * Math.floor(valueRange / (60 * 60 * 1000))) / (60 * 1000)
                                        } phút `}
                                </Typography>
                            </Box>
                            <Box className='w-100'>
                                <Slider
                                    defaultValue={0}
                                    color='secondary'
                                    step={2000}
                                    min={0}
                                    max={valueRange}
                                    valueLabelDisplay='on'
                                    onChange={handleSeekChange}
                                    value={timePlay - timeFilter?.start_time + currentTime}
                                    getAriaValueText={valuetext}
                                    valueLabelFormat={valuetext}
                                    marks={renderMarks()}
                                    aria-labelledby='custom-marks-slider'
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            width: 20,
                                            height: 20,
                                            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                            '&::before': {
                                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)'
                                            },
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`
                                            },
                                            '&.Mui-active': {
                                                width: 20,
                                                height: 20
                                            }
                                        },
                                        '& .MuiSlider-track': {
                                            opacity: 0,
                                            backgroundColor: '#fff'
                                        },
                                        '& .MuiSlider-rail': {
                                            opacity: 0.28,
                                            backgroundColor: '#fff'
                                        },
                                        '& .MuiSlider-markLabel': {
                                            color: '#fff'
                                        }
                                    }}
                                />
                            </Box>
                        </div>
                        <div className='right-controls'>
                            <Stack spacing={4} direction='row' sx={{ mb: 1, px: 1 }} alignItems='center'>
                                <Icon icon='formkit:volumedown' size='1rem' color='#fff' />

                                <Slider
                                    aria-label='Volume'
                                    defaultValue={30}
                                    min={0}
                                    max={100}
                                    onChange={(event, vol) => {
                                        setVolume(vol)
                                    }}
                                    color='secondary'
                                    sx={{
                                        '& .MuiSlider-track': {
                                            border: 'none'
                                        },
                                        '& .MuiSlider-thumb': {
                                            width: 20,
                                            height: 20,
                                            backgroundColor: '#fff',
                                            '&::before': {
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
                                            },
                                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                                boxShadow: 'none'
                                            }
                                        }
                                    }}
                                />
                                <Icon icon='formkit:volumeup' size='1rem' color='#fff' />
                            </Stack>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Card>
    )
}

export default Review