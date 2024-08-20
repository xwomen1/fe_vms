import React, { useEffect, useState, useRef } from 'react'

import { Grid, Typography } from '@mui/material'

// import TableStickyHeader from './table'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import ViewCamera from 'src/@core/components/camera/playbackpause'
import Settings from 'src/@core/components/camera/settings'
import { getApi } from 'src/@core/utils/requestUltils'
import { CAMERA_API } from 'src/@core/components/api-url'
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

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const DivStyle = styled('div')(({ theme }) => ({
  margin: '-1.2rem -1.5rem'
}))

const valueFilterInit = {
  page: 1,
  limit: 50,
  deviceTypes: 'NVR'
}

const Caller = () => {
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
  const datePickerRef = useRef(null)
  const [sizeScreen, setSizeScreen] = useState('3x2')
  const [reload, setReload] = useState(0)
  const [numberShow, setNumberShow] = useState(6)
  const [volume, setVolume] = useState(30)

  const [valueFilter, setValueFilter] = useState(valueFilterInit)

  const [cameraGroup, setCameraGroup] = useState([])
  const [cameraList, setCameraList] = useState([])
  const [selectIndex, setSelectIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [play, setPlay] = useState(true)
  const [valueRange, setValueRange] = useState(60 * 60 * 1000)
  const [currentTime, setCurrentTime] = useState(0)
  const [timePlay, setTimePlay] = useState(time_start)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const debouncedSearch = useDebounce(valueRange, 700)

  const onClickPlay = v => {
    if (v) {
      setPlay(v)
      setTimePlay(timePlay + currentTime)
      setCurrentTime(0)
      setCameraGroup([])
      setReload(reload + 1)
    } else {
      setPlay(v)
    }
  }

  const handleSeekChange = (event, newValue) => {
    setCurrentTime(0)
    setTimePlay(timeFilter.start_time + newValue)
    setCameraGroup([])
    setReload(reload + 1)
  }

  const fetchCameraGroup = async () => {
    try {
      const res = await getApi(
        `${CAMERA_API.CAMERA_GROUP}?deviceTypes=${valueFilter.deviceTypes}&limit=${valueFilter.limit}&page=${valueFilter.page}`
      )
      let listCamera = []
      setCameraList(res?.data)
      if (res.data.length > 0) {
        res.data[selectIndex]?.cameras.map((camera, index) => {
          if (index < page * numberShow && index >= (page - 1) * numberShow) {
            listCamera.push({
              ...camera,
              channel: 'Sub'
            })
          }
        })
      }
      console.log(listCamera)
      setCameraGroup(listCamera)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    fetchCameraGroup()
  }, [reload, page, selectIndex, sizeScreen])

  const handSetChanel = (id, channel) => {
    let newCamera = cameraGroup.map(item => {
      if (item.id === id) {
        return {
          ...item,
          channel: channel
        }
      }

      return item
    })
    setCameraGroup(newCamera)
  }
  function timeDisplay(time) {
    if (time < 10) return '0' + time

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
      timeDisplay(timeCurrent.getMinutes()) +
      ':' +
      timeDisplay(timeCurrent.getSeconds())
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

  return (
    <DivStyle
      style={{ backgroundColor: 'black', width: '100%', minHeight: '90vh', color: 'white', position: 'relative' }}
    >
      <Grid container spacing={0}>
        {cameraGroup.length > 0 &&
          cameraGroup.map((camera, index) => (
            <Grid item xs={Math.floor(12 / sizeScreen.split('x')[0])} key={index}>
              <ViewCamera
                name={camera?.deviceName}
                id={camera.id}
                play={play}
                onChangeCurrentTime={time => {
                  setCurrentTime(1000 * time)
                }}
                duration={duration}
                onChangeDuration={setDuration}
                channel={camera.channel}
                status={camera.status}
                startTime={timePlay || time_start}
                endTime={timeFilter?.endTime || time_end}
                sizeScreen={sizeScreen}
                handSetChanel={handSetChanel}
                volume={volume}
              />
            </Grid>
          ))}
        <div className='video-controls'>
          <div
            style={{
              width: '100%'
            }}
          >
            <div className='bottom-controls'>
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
                    {`${Math.floor(valueRange / (60 * 60 * 1000))} Hour -  ${(valueRange - 60 * 60 * 1000 * Math.floor(valueRange / (60 * 60 * 1000))) / (60 * 1000)
                      } Minute `}
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
                        setCameraGroup([])
                        setReload(reload + 1)
                      }}
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
          </div>
        </div>
      </Grid>
      <Settings
        page={page}
        onSetPage={setPage}
        selectIndex={selectIndex}
        onSetSelectIndex={setSelectIndex}
        cameraList={cameraList}
        sizeScreen={sizeScreen}
        setSizeScreen={size => {
          setSizeScreen(size)
          setNumberShow(size.split('x')[0] * size.split('x')[1])
        }}
      />
    </DivStyle>
  )
}

export default Caller
