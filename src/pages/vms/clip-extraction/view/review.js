import React, { useState, useRef, useEffect, useCallback } from 'react'
import { CardContent, CardHeader, Grid, Typography, styled } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import useDebounce from './useDebounce'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import { Stack } from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { formatTimeShow, formatDate, convertDateToString } from 'src/@core/utils/format'
import { Card } from "@mui/material"
import toast from 'react-hot-toast'
import { postApi } from 'src/@core/utils/requestUltils'
import { TreeItem, TreeView } from '@mui/lab'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import ViewCamera from 'src/@core/components/camera/playbackpause'
import _ from 'lodash'

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    '&:hover > .MuiTreeItem-content:not(.Mui-selected)': {
        backgroundColor: theme.palette.action.hover
    },
    '& .MuiTreeItem-content': {
        paddingRight: theme.spacing(3),
        borderTopRightRadius: theme.spacing(4),
        borderBottomRightRadius: theme.spacing(4),
        fontWeight: theme.typography.fontWeightMedium
    },
    '& .MuiTreeItem-label': {
        fontWeight: 'inherit',
        paddingRight: theme.spacing(3)
    },
    '& .MuiTreeItem-group': {
        marginLeft: 0,
        '& .MuiTreeItem-content': {
            paddingLeft: theme.spacing(4),
            fontWeight: theme.typography.fontWeightRegular
        }
    }
}))

const StyledTreeItem = props => {
    // ** Props
    const { labelText, labelIcon, labelInfo, color, ...other } = props

    return (
        <StyledTreeItemRoot
            {...other}
            label={
                <Box
                    sx={{ py: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                    <Icon icon={labelIcon} color={color} />
                    <Typography variant='body2' sx={{ flexGrow: 1, fontWeight: 500 }}>
                        {labelText}
                    </Typography>
                    {labelInfo ? (
                        <Typography variant='caption' color='inherit'>
                            {labelInfo}
                        </Typography>
                    ) : null}
                </Box>
            }
        />
    )
}

const Review = () => {
    const [keyword, setKeyword] = useState('')
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })
    const [cameraCurrent, setCameraCurrent] = useState({ id: '', name: '', channel: '' })
    const [cameraList, setCameraList] = useState([])
    const [loading, setLoading] = useState(false)
    const [monthOfYear, setMonthOfYear] = useState((new Date()).getMonth() + 1)
    const [year, setYear] = useState((new Date()).getFullYear())
    const [eventDates, setEventDates] = useState([])
    const [speed, setSpeed] = useState(1)

    const time_start = new Date().getTime() - 60 * 60 * 1000
    const time_end = new Date().getTime()

    const [dateTime, setDateTime] = useState(new Date())

    const [timeFilter, setTimeFilter] = useState({
        start_time: time_start,
        end_time: time_end
    })

    const [timePlay, setTimePlay] = useState(time_start)
    const [currentTime, setCurrentTime] = useState(0)
    const datePickerRef = useRef(null)
    const [play, setPlay] = useState(true)
    const [valueRange, setValueRange] = useState(60 * 60 * 1000)
    const debouncedSearch = useDebounce(valueRange, 700)
    const [duration, setDuration] = useState(0)
    const [reload, setReload] = useState(0)
    const [volume, setVolume] = useState(30)

    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const clientId = 'be571c00-41cf-4878-a1de-b782625da62a'
    const [eventsData, setEventData] = useState([])
    const [websocket, setWebsocket] = useState(null)
    const [rtcPeerConnection, setRtcPeerConnection] = useState(null)

    const configWs = {
        bundlePolicy: 'max-bundle',
        iceServers: [
            {
                urls: 'stun:dev-ivis-camera-api.basesystem.one:3478',
            },
            {
                urls: 'turn:dev-ivis-camera-api.basesystem.one:3478',
                username: 'demo',
                credential: 'demo',
            },
        ]
    }

    // create WebSocket connection
    const createWsConnection = () => {
        const ws = new WebSocket(`wss://sbs.basesystem.one/ivis/vms/api/v0/websocket/topic/cameraStatus/${clientId}`)

        setWebsocket(ws)

        //create RTCPeerConnection 
        const pc = new RTCPeerConnection(configWs)
        setRtcPeerConnection(pc)

        //listen for remote tracks and add them to remote stream

        pc.ontrack = (event) => {
            const stream = event.streams[0]
            if (
                !remoteVideoRef.current?.srcObject ||
                remoteVideoRef.current?.srcObject.id !== stream.id
            ) {
                setRemoteStream(stream)
                remoteVideoRef.current.srcObject = stream
            }
        }

        // close Websocket and RTCPeerConnection on component unmount

        return () => {
            if (websocket) {
                websocket.close()
            }
            if (rtcPeerConnection) {
                rtcPeerConnection.close()
            }
        }
    }

    const handleMessage = async (event) => {
        const message = JSON.parse(event.data)
        const newMessage = JSON.parse(message?.data)
        setEventData(newMessage)
    }

    const handleClose = async (event) => {
        if (websocket) {
            websocket.close()
        }
    }

    useEffect(() => {
        const cleanup = createWsConnection()

        return cleanup
    }, [])

    useEffect(() => {
        if (websocket) {
            websocket.addEventListener('open', (event) => { })

            websocket.addEventListener('message', handleMessage)

            websocket.addEventListener('error', (error) => {
                console.error('WebSocket error: ', error)
            })

            websocket.addEventListener('close', handleClose)
        }
    }, [websocket])

    useEffect(() => {
        if (cameraCurrent?.id !== '') {
            setCamera({ id: cameraCurrent.id, name: cameraCurrent.name, channel: cameraCurrent.channel })
        }
    }, [reload])

    useEffect(() => {
        setCamera({ id: '', name: '', channel: '' })
    }, [])

    useEffect(() => {
        fetchCameraList()
    }, [keyword])

    const fetchCameraList = async () => {
        try {
            const res = await axios.get(
                `https://sbs.basesystem.one/ivis/vms/api/v0/camera-groups?deviceTypes=NVR&keyword=${keyword}&limit=25&page=1`,
                config
            )
            if (Array.isArray(res?.data)) {
                setCameraList(res?.data)
            } else {
                setCameraList([])
            }

        } catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    const fetchEventDates = async () => {
        setLoading(true)

        const params = {
            monthOfYear: monthOfYear,
            year: year
        }

        try {
            const res = await postApi(`https://sbs.basesystem.one/ivis/vms/api/v0/playback/camera/${camera.id}`, params)
            const dataList = [...res.data.DayList?.Days]
            const dateList = []
            dataList.forEach((item) => {
                if (item.Record === true) {
                    dateList.push(new Date(`${year}-${monthOfYear}-${item?.DayOfMonth}`))
                }
            })

            setEventDates(dateList)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('Error 404: Not Found', error.response.data)
                setEventDates([])
            } else {
                console.error('Error fetching data:', error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const onClickPlay = v => {
        setCamera({ id: camera.id, name: camera.name, channel: camera.channel })
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

    const handSetChanel = (id, channel) => {
        setCamera({ id: camera.id, name: camera.name, channel: channel })
    }

    const handleSeekChange = (event, newValue) => {
        setCurrentTime(0)
        setReload(reload + 1)
        setTimePlay(timeFilter.start_time + newValue)
        setCameraCurrent({ id: camera.id, name: camera.name, channel: camera.channel })
        setCamera({ id: '', name: '', channel: '' })
    }

    const handleSetCamera = (camera) => {
        setCamera({ id: camera?.id, name: camera?.deviceName, channel: 'Sub' })
    }

    const handleSearch = e => {
        setKeyword(e.target.value)
    }

    const renderTree = group => {
        return (
            <StyledTreeItem key={group.id} nodeId={group.id} labelText={group.name} labelIcon='tabler:folder'>
                {group.cameras && group.cameras.length > 0
                    ? group.cameras.map(camera => {
                        const matchedEvent = eventsData.find(event => event.id === camera.id)
                        const status = matchedEvent?.status

                        return (
                            <StyledTreeItem
                                key={camera.id}
                                nodeId={camera.id}
                                color={status == true ? '#28c76f' : ''}
                                labelText={camera.deviceName}
                                labelIcon='tabler:camera'
                                onClick={() => handleSetCamera(camera)}
                            />
                        )
                    })
                    : null}
            </StyledTreeItem>
        )
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4} lg={2}>
                <Card>
                    <CardHeader title='Danh sách Camera' />
                    <CardContent>
                        <CustomTextField
                            value={keyword}
                            placeholder='Search…'
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 2, display: 'flex' }}>
                                        <Icon fontSize='1.25rem' icon='tabler:search' />
                                    </Box>
                                ),
                                endAdornment: (
                                    <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                                        <Icon fontSize='1.25rem' icon='tabler:x' />
                                    </IconButton>
                                )
                            }}
                            onChange={handleSearch}
                            sx={{
                                width: {
                                    xs: 1,
                                    sm: 'auto'
                                },
                                '& .MuiInputBase-root > svg': {
                                    mr: 2
                                }
                            }}
                        />
                        <Box sx={{
                            height: {
                                xs: '300px',
                                sm: '300px',
                                lg: '400px',
                            },
                            overflow: 'auto',
                            marginTop: '10px'
                        }}>
                            <TreeView
                                sx={{ minHeight: 240 }}
                                defaultExpanded={['root']}
                                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
                            >
                                {cameraList.map(group => renderTree(group))}
                            </TreeView>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={8} lg={10}>
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
                                    {/* <Box className='w-100' sx={{ px: 2 }}>
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
                                </Box> */}
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
                                            <IconButton
                                                onClick={() => {
                                                    onClickPlay(!play)
                                                }}
                                                style={{ padding: 5, margin: '0 8px 0 8px' }}
                                            >
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
                                            value={volume}
                                            onChange={(event, vol) => {
                                                setVolume(vol)
                                            }}
                                            color='secondary'
                                            sx={{
                                                '& .MuiSlider-track': {
                                                    border: 'none'
                                                },
                                                '& .MuiSlider-thumb': {
                                                    width: 10,
                                                    height: 10,
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
                                    <Box sx={{ mt: 1, ml: 4, display: 'flex', alignItems: 'center' }}>
                                        <IconButton size='small' title='date' onClick={handleIconClick}>
                                            <Icon color='#fff' fontSize='1.5rem' icon='fluent-mdl2:date-time-12' />
                                        </IconButton>
                                        <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
                                            <DatePicker
                                                ref={datePickerRef}
                                                showTimeSelect
                                                timeFormat='HH:mm'
                                                timeIntervals={15}
                                                selected={dateTime}
                                                id='date-time-picker'
                                                dateFormat='MM/dd/yyyy h:mm aa'
                                                onChange={date => {
                                                    setDateTime(date)
                                                    setTimeFilter({
                                                        ...timeFilter,
                                                        start_time: new Date(date).getTime() - valueRange,
                                                        end_time: new Date(date).getTime()
                                                    })
                                                    setCurrentTime(0)
                                                    setTimePlay(new Date(date).getTime() - valueRange)
                                                    setReload(reload + 1)
                                                }}
                                                onInputClick={fetchEventDates}
                                                highlightDates={eventDates}
                                                popperPlacement='bottom-start'
                                                customInput={
                                                    <CustomInput
                                                        sx={{
                                                            '& .MuiInputBase-input': {
                                                                color: '#fff',
                                                                fontWeight: 'bold'
                                                            }
                                                        }}
                                                    />
                                                }
                                            />
                                        </DatePickerWrapper>
                                    </Box>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Review