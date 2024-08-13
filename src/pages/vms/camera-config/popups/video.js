import { forwardRef, useEffect, useState } from 'react'
import { Box, Fade, Grid, IconButton, styled, Typography } from '@mui/material'
import { Autocomplete, Button, Dialog, DialogContent, DialogActions } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getApi, putApi } from 'src/@core/utils/requestUltils'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

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
      {
        id: '20',
        name: 'Lowest'
      },
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
    data: [
      { id: '3840x2160', name: '3840*2160' },
      { id: '3072x2048', name: '3072*2048' },
      { id: '2592*1944', name: '2592x1944' },
      { id: '2560*1440', name: '2560x1440' },
      { id: '2304*1296', name: '2304x1296' },
      { id: '1920*1080', name: '1920x1080' },
      { id: '1280*720', name: '1280x720' }
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


const VideoConfig = ({ open, onClose, camera }) => {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(format_form)
  const [streamType, setStreamType] = useState(null)
  const [bitrateType, setBitrateType] = useState(null)
  const [frameRate, setFrameRate] = useState(null)
  const [h265, setH265] = useState(null)
  const [videoQuality, setVideoQuality] = useState(null)
  const [resolution, setResolution] = useState(null)
  const [videoEncoding, setVideoEncoding] = useState(null)


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

  const handleCancel = () => {
    onClose()
  }

  const fetchData = async () => {
    setLoading(true)
    try {

      const response = await getApi(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/videoconfig/{idCamera}?idCamera=${camera}`
      )
      const videoConfig = response.data?.videoConfig
      setDetail(videoConfig)
      setStreamType(videoConfig?.streamType)
      setBitrateType(videoConfig?.bitrateType)
      setFrameRate(videoConfig?.frameRate)
      setH265(videoConfig?.h265)
      setVideoQuality(videoConfig?.videoQuality)
      setResolution(videoConfig?.resolution)
      setVideoEncoding(videoConfig?.videoEncoding)

    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      () => {
        setLoading(false)
      }
    }
  }

  const onSubmit = values => {

    const params = {
      ...values,
      dataStreamType: values?.dataStreamType?.id,
      bitrateType: values?.bitrateType?.id,
      frameRate: values?.frameRate?.id,
      h265: values?.h265?.id,
      videoQuality: values?.videoQuality?.id,
      resolution: values?.resolution?.id,
      videoEncoding: values?.videoEncoding?.id
    }

    if (camera) {
      handleUpdate(params)
    }
  }

  const handleUpdate = values => {
    const params = {
      ...values
    }

    putApi(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/videoconfig/{idCamera}?idCamera=${camera}`, { ...params })
      .then(() => {
        toast.success('Cập nhật thành công')
        setReload()
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      scroll='body'
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={onClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      <DialogContent>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant='h5' sx={{ mb: 3 }}>
            Cấu hình video
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {form.map((item, index) => {
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
                        {...(errors[item.name] && { helperText: 'Trường này bắt buộc' })}
                      />
                    )}
                  />
                </Grid>
              )
            }
            if (item.type === 'Autocomplete') {
              const result = item.name === 'dataStreamType' ? streamType :
                item?.name === 'bitrateType' ? bitrateType :
                  item?.name === 'frameRate' ? frameRate :
                    item?.name === 'h265' ? h265 :
                      item?.name === 'videoQuality' ? videoQuality :
                        item?.name === 'resolution' ? resolution :
                          item?.name === 'videoEncoding' ? videoEncoding
                            : ''

              return (
                <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Controller
                    name={item.name}
                    control={control}
                    rules={{ required: item.require }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        fullWidth
                        value={result || ''}
                        onChange={(event, selectedItem) => {
                          onChange(selectedItem)
                        }}
                        options={item.data}
                        getOptionLabel={option => option?.name || option}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label={item.label}
                            variant='outlined'
                            fullWidth
                            error={Boolean(errors[item.name])}
                            aria-describedby='validation-basic-last-name'
                            {...(errors[item.name] && { helperText: 'Trường này bắt buộc' })}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              )
            }
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={handleSubmit(onSubmit)}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default VideoConfig
