import { useEffect, useState } from 'react'
import { Box, CircularProgress, Grid } from '@mui/material'
import { Autocomplete, Button } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getApi, putApi } from 'src/@core/utils/requestUltils'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'

const VideoCamera = ({ camera, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [streamType, setStreamType] = useState('main')
  const [bitrateType, setBitrateType] = useState(null)
  const [frameRate, setFrameRate] = useState(null)
  const [h265, setH265] = useState(null)
  const [videoQuality, setVideoQuality] = useState(null)
  const [resolution, setResolution] = useState(null)
  const [videoEncoding, setVideoEncoding] = useState(null)
  const [videoConfig, setVideoConfig] = useState([])

  const format_form = [
    {
      name: 'dataStreamType',
      label: 'Stream type',
      placeholder: 'Stream type',
      type: 'Autocomplete',
      data: [
        { id: 'main', name: 'Main Stream(Normal)' },
        { id: 'sub', name: 'Sub Stream' }
      ],
      disabled: false,
      require: true,
      width: 4
    },
    {
      name: 'bitrateType',
      label: 'Bitrate type',
      placeholder: 'Bitrate type',
      type: 'Autocomplete',
      data: [
        { id: 'vbr', name: 'Variable' },
      ],
      disabled: true,
      require: true,
      width: 4
    },
    {
      name: 'frameRate',
      label: 'Frame rate',
      placeholder: 'Frame rate',
      type: 'Autocomplete',
      data: [
        { id: '20', name: '20' },
      ],
      disabled: false,
      require: true,
      width: 4
    },
    {
      name: 'h265',
      label: 'h265',
      placeholder: 'h265',
      type: 'Autocomplete',
      data: [
        { id: 'Main', name: 'Main' },
        { id: 'Sub', name: 'Sub' }
      ],
      disabled: false,
      require: true,
      width: 4
    },
    {
      name: 'maxBitrate',
      label: 'Max bitrate',
      placeholder: 'Max bitrate',
      type: 'TextField',
      data: [],
      disabled: false,
      require: true,
      width: 4
    },
    {
      name: 'videoQuality',
      label: 'Video quality',
      placeholder: 'Video quality',
      type: 'Autocomplete',
      data: [
        { id: '20', name: 'Lowest' },
        { id: '30', name: 'Lower' },
        { id: '45', name: 'Low' },
        { id: '60', name: 'Medium' },
        { id: '75', name: 'High' },
        { id: '90', name: 'Highest' }
      ],
      disabled: false,
      require: true,
      width: 4
    },
    {
      name: 'resolution',
      label: 'Resolution',
      placeholder: 'Resolution',
      type: 'Autocomplete',
      dataOfMain: [
        { id: '3840x2160', name: '3840x2160' },
        { id: '3072x2048', name: '3072x2048' },
        { id: '2592x1944', name: '2592x1944' },
        { id: '2560x1440', name: '2560x1440' },
        { id: '2304x1296', name: '2304x1296' },
        { id: '1920x1080', name: '1920x1080' },
        { id: '1280x720', name: '1280x720' },
      ],
      dataOfSub: [
        { id: '720x480', name: '720x480' },
        { id: '640x480', name: '640x480' },
        { id: '640x360', name: '640x360' },
        { id: '480x360', name: '480x360' },
        { id: '352x288', name: '352x288' }
      ],
      disabled: false,
      require: true,
      width: 4
    },
    {
      name: 'videoEncoding',
      label: 'Video encoding',
      placeholder: 'Video encoding',
      type: 'Autocomplete',
      data: [
        { id: 'H264', name: 'H264' },
        { id: 'H265', name: 'H265' }
      ],
      disabled: false,
      require: true,
      width: 4
    },
  ]

  const [form, setForm] = useState(format_form)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  // useEffect(() => {
  //   if (streamType === 'main') {
  //     const videoConfigMain = videoConfig?.find(item => item?.dataStreamType === 'main')
  //     setDetail(videoConfigMain)
  //     setBitrateType(videoConfigMain?.bitrateType)
  //     setFrameRate(videoConfigMain?.frameRate)
  //     setH265(videoConfigMain?.h265)
  //     setVideoQuality(videoConfigMain?.videoQuality)
  //     setResolution(videoConfigMain?.resolution)
  //     setVideoEncoding(videoConfigMain?.videoEncoding)
  //   }
  //   if (streamType === 'sub') {
  //     const videoConfigSub = videoConfig?.find(item => item?.dataStreamType === 'sub')
  //     setDetail(videoConfigSub)
  //     setBitrateType(videoConfigSub?.bitrateType)
  //     setFrameRate(videoConfigSub?.frameRate)
  //     setH265(videoConfigSub?.h265)
  //     setVideoQuality(videoConfigSub?.videoQuality)
  //     setResolution(videoConfigSub?.resolution)
  //     setVideoEncoding(videoConfigSub?.videoEncoding)
  //   }
  // }, [streamType, videoConfig])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getApi(
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/config/videoconfigNVR/07622a6c-7b6b-40d9-ba47-8a0f024521b7`
      )
      console.log('responsive', response.data);

      // setVideoConfig(response.data?.videoConfig)
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

  const onSubmit = values => {
    const valuesChange = {
      ...values,
      dataStreamType: streamType,
      bitrateType: bitrateType,
      frameRate: frameRate,
      h265: h265,
      videoQuality: videoQuality,
      resolution: resolution,
      videoEncoding: videoEncoding
    }

    const valuesNotChange = videoConfig.find(item => item?.dataStreamType != streamType)

    const params = {
      videoConfig: [
        valuesNotChange,
        valuesChange
      ]
    }

    if (camera) {
      handleUpdate(params)
    }
  }

  const handleUpdate = values => {
    setLoading(true)

    const params = {
      ...values
    }

    putApi(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/videoconfig/${camera}`, { ...params })
      .then(() => {
        toast.success('Data has been updated successfully ')
      })
      .catch(error => {
        if (error && error?.response?.data) {
          console.error('error', error)
          toast.error(error?.response?.data?.message)
        } else {
          console.error('Error fetching data:', error)
          toast.error(error)
        }
      })
      .finally(() => {
        setLoading(false)
        onClose()
      })
  }

  return (
    <div style={{ width: '100%' }}>
      {loading === true && (
        <Box
          sx={{ width: '100%', height: ' 100%', position: 'absolute', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={3}>
        {
          form.map((item, index) => {
            if (item.type === 'TextField') {
              return (
                <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Controller
                    name={item.name}
                    control={control}
                    rules={{ required: item.require }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        fullWidth
                        value={value || ''}
                        label={item.label}
                        onChange={onChange}
                        placeholder={item.placeholder}
                        error={Boolean(errors[item.name])}
                        aria-describedby='validation-basic-last-name'
                        {...(errors[item.name] && { helperText: 'This field is required' })}
                      />
                    )}
                  />
                </Grid>
              )
            }
            if (item.type === 'Autocomplete') {
              return (
                <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Controller
                    name={item.name}
                    control={control}
                    rules={{ required: item.require }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        fullWidth
                        value={
                          item.name === 'videoQuality' && value === '20' ? 'Lowest'
                            : item.name === 'videoQuality' && value === '30' ? 'Lower'
                              : item.name === 'videoQuality' && value === '45' ? 'Low'
                                : item.name === 'videoQuality' && value === '60' ? 'Medium'
                                  : item.name === 'videoQuality' && value === '75' ? 'High'
                                    : item.name === 'videoQuality' && value === '90' ? 'Highest'
                                      : value || null
                        }
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem)
                          if (item.name === 'dataStreamType') {
                            setStreamType(selectedItem.id)
                          }
                          if (item.name === 'bitrateType') {
                            setBitrateType(selectedItem.id)
                          }
                          if (item.name === 'frameRate') {
                            setFrameRate(selectedItem.id)
                          }
                          if (item.name === 'h265') {
                            setH265(selectedItem.id)
                          }
                          if (item.name === 'videoQuality') {
                            setVideoQuality(selectedItem.id)
                          }
                          if (item.name === 'resolution') {
                            setResolution(selectedItem.id)
                          }
                          if (item.name === 'videoEncoding') {
                            setVideoEncoding(selectedItem.id)
                          }
                        }}
                        options={
                          item.name === 'resolution' && streamType === 'main' ? item?.dataOfMain
                            : item.name === 'resolution' && streamType === 'sub' ? item?.dataOfSub
                              : item.data
                        }
                        getOptionLabel={option => option?.name || option}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label={item.label}
                            variant='outlined'
                            fullWidth
                            error={Boolean(errors[item.name])}
                            aria-describedby='validation-basic-last-name'
                            {...(errors[item.name] && { helperText: 'This field is required' })}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              )
            }
          })
        }

      </Grid>
      <Grid container item xs={12} display={'flex'} justifyContent={'flex-end'}>
        <Button variant='contained' color='secondary' onClick={onClose} sx={{ marginRight: '10px' }}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={handleSubmit(onSubmit)}>Save</Button>
      </Grid>
    </div>
  )
}

export default VideoCamera
