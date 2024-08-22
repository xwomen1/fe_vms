import { Autocomplete, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, Fade, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, styled, Switch } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getApi, putApi } from 'src/@core/utils/requestUltils'
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
    name: 'cameraName',
    label: 'Camera Name',
    placeholder: 'Camera Name',
    type: 'TextField',
    data: [],
    disabled: false,
    require: false,
    width: 12
  },
  {
    name: 'disableName',
    label: 'Disable Name',
    placeholder: 'Disable Name',
    type: 'Switch',
    data: [],
    disabled: false,
    require: true,
    width: 12
  },
  {
    name: 'disableDate',
    label: 'Disable Date',
    placeholder: 'Disable Date',
    type: 'Switch',
    data: [],
    disabled: false,
    require: true,
    width: 12
  },
  {
    name: 'disableWeek',
    label: 'Disable Week',
    placeholder: 'Disable Week',
    type: 'Switch',
    data: [],
    disabled: true,
    require: true,
    width: 12
  },
  {
    name: 'dateFormat',
    label: 'Date Format',
    placeholder: 'Date Format',
    type: 'Autocomplete',
    data: [
      { id: 'YYYY-MM-DD', name: 'YYYY-MM-DD' },
      { id: 'YYYY/MM/DD', name: 'YYYY/MM/DD' },
      { id: 'MM/DD/YYYY', name: 'MM/DD/YYYY' },
      { id: 'DD/MM/YYYY', name: 'DD/MM/YYYY' }
    ],
    disabled: false,
    require: true,
    width: 12
  },
  {
    name: 'timeFormat',
    label: 'Time Format',
    placeholder: 'Time Format',
    type: 'Autocomplete',
    data: [
      { id: '12-hour', name: '12-hour' },
      { id: '24-hour', name: '24-hour' }
    ],
    disabled: false,
    require: true,
    width: 12
  },
]

const ImageCamera = ({ cameraId, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [disableDate, setDisableDate] = useState(false)
  const [disableWeek, setDisableWeek] = useState(false)
  const [disableName, setDisableName] = useState(false)
  const [form, setForm] = useState(format_form)

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getApi(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/imageconfig/${cameraId}?channel=1&protocolType=HIKVISION`
      )

      const data = response.data
      setDetail(data)
      setDisableName(data?.disableName)
      setDisableDate(data?.disableDate)
      setDisableWeek(data?.disableWeek)
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

  const handleCancel = () => {
    onClose()
  }

  const onSubmit = values => {
    const params = {
      ...values,
      dateFormat: values?.dateFormat?.id ? values?.dateFormat?.id : detail.dateFormat,
      timeFormat: values?.timeFormat?.id ? values?.timeFormat?.id : detail.timeFormat,
      disableDate: disableDate,
      disableWeek: disableWeek,
      disableName: disableName,
    }

    if (cameraId) {
      handleUpdate(params)
    }
  }

  const handleUpdate = values => {
    setLoading(true)

    const params = {
      ...values
    }

    putApi(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/imageconfig/${cameraId}?channel=1&protocolType=HIKVISION`, { ...params })
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
        <div style={{ width: '100%' }}>
          {loading === true && (
            <Box
              sx={{ width: '100%', height: ' 100%', position: 'absolute', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <CircularProgress />
            </Box>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img height='200' alt='error-illustration' src='/images/avatars/1.png' />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={2}>
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
                                disabled={
                                  item.name === 'cameraName' && disableName === false ? true : false
                                }
                                error={Boolean(errors[item.name])}
                                aria-describedby='validation-basic-last-name'
                                {...(errors[item.name] && { helperText: 'This field is required' })}
                              />
                            )}
                          />
                        </Grid>
                      )
                    }
                    if (item.type === 'Switch') {
                      return (
                        <Grid item xs={item.width} key={item.name} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Controller
                            name={item.name}
                            control={control}
                            label={item.label}
                            rules={{ required: item.require }}
                            render={({ field: { value, onChange } }) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        item.name === 'disableDate' ? disableDate :
                                          item.name === 'disableWeek' ? disableWeek :
                                            item.name === 'disableName' ? disableName :
                                              value}
                                      onChange={event => {
                                        item.name === 'disableDate' ? setDisableDate(event.target.checked) :
                                          item.name === 'disableWeek' ? setDisableWeek(event.target.checked) :
                                            item.name === 'disableName' ? setDisableName(event.target.checked) : onChange
                                      }}
                                      disabled={item.disabled}
                                    />}
                                  label={item.label}
                                />
                              )
                            }} />
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
                                value={value || null}
                                onChange={(event, selectedItem) => {
                                  onChange(selectedItem)
                                }}
                                disabled={
                                  item.name === 'dateFormat' && disableDate === false ? true
                                    : false
                                }
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
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' color='primary' onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageCamera
