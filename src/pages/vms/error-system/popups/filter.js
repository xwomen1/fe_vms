import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  styled
} from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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

const initValueFilter = {
  device_type: null,
  type: null,
  keyword: '',
  limit: 25,
  page: 1
}

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const deviceTypes = [
    { id: 1, name: 'nvr' },
    { id: 2, name: 'camera' }
  ]

  const statuses = [
    { id: 1, name: 'active' },
    { id: 2, name: 'Inactive' }
  ]

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues: initValueFilter })
  useEffect(() => {
    reset(valueFilter) // Cập nhật giá trị mặc định mỗi khi valueFilter thay đổi
  }, [valueFilter, reset])

  const onReset = () => {
    const detail = {
      device_type: null,
      type: null
    }
    callback(detail)
    onClose()
  }

  const onSubmit = async values => {
    try {
      setLoading(true)
      const detail = { ...values }
      callback(detail)
      console.log(detail, 'detail')
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={onClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Filter
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={0}>
              <Grid item xs={12} sx={{ marginLeft: '8%' }} sm={4}>
                <Controller
                  name='device_type'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Device type'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.device_type)}
                      aria-describedby='validation-basic-select'
                      helperText={errors.device_type ? 'This field is required' : ''}
                    >
                      {deviceTypes.map(item => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='type'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Status'
                      SelectProps={{
                        value: value,
                        onChange: e => onChange(e)
                      }}
                      id='validation-basic-select'
                      error={Boolean(errors.type)}
                      aria-describedby='validation-basic-select'
                      helperText={errors.type ? 'This field is required' : ''}
                    >
                      {statuses.map(item => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={12} sx={{ marginTop: '10%' }}>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <Button type='submit' variant='contained' disabled={loading}>
                    {loading ? 'Loading...' : 'Filter'}
                  </Button>
                  <Button variant='tonal' onClick={onReset}>
                    Reset
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={onClose}>
                    Cancel
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default Filter
