import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Typography,
  Box,
  Card
} from '@mui/material'
import { styled } from '@mui/material/styles'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

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

const Filter = ({ open, onClose, valueFilter, callback }) => {
  const [vehicleType, setVehicleType] = useState([])
  const [paking, setPaking] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const defaultValues = {
    brandId: null,
    parkingId: null,
    status: ''
  }

  const doorStatuses = [
    { name: 'ACTIVE', id: 'ACTIVE' },
    { name: 'INACTIVE', id: 'INACTIVE' }
  ]

  useEffect(() => {
    fetchDataPaking()
    fetchVehicleTypes()
  }, [])

  const fetchDataPaking = async () => {
    try {
      const response = await axios.get(`https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/parking/`, config)
      console.log(response, 'paking')
      setPaking(response.data.rows)
    } catch (error) {
      console.error('Error fetching vehicle data:', error)
    }
  }

  const fetchVehicleTypes = async () => {
    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/camnet/camnet_parking/api/v0/vehicle/type/`,
        config
      )
      setVehicleType(response.data.rows)
    } catch (error) {
      console.error('Error fetching vehicle types:', error)
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  useEffect(() => {
    reset(valueFilter)
  }, [valueFilter, reset])

  const onSubmit = values => {
    var detail = { ...values }
    callback(detail)
    onClose()
  }

  const handleClear = onChange => {
    onChange(null)
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
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
              Bộ lọc
            </Typography>
          </Box>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='status'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box position='relative'>
                      <CustomTextField
                        select
                        fullWidth
                        label='Trạng thái kích hoạt'
                        SelectProps={{
                          value: value ?? '',
                          onChange: e => onChange(e.target.value)
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.status)}
                        aria-describedby='validation-basic-select'
                        {...(errors.status && { helperText: 'This field is required' })}
                      >
                        {doorStatuses.map(door => (
                          <MenuItem key={door.id} value={door.id}>
                            {door.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                      {value && (
                        <IconButton
                          size='small'
                          style={{ position: 'absolute', right: 25, top: 25 }}
                          onClick={() => handleClear(onChange)}
                        >
                          <Icon icon='tabler:x' fontSize='1rem' />
                        </IconButton>
                      )}
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='vehicleType'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    console.log(value),
                    (
                      <Box position='relative'>
                        <CustomTextField
                          select
                          fullWidth
                          label='Loại phương tiện'
                          SelectProps={{
                            value: value ?? '',
                            onChange: e => onChange(e.target.value)
                          }}
                          id='validation-basic-select'
                          error={Boolean(errors.vehicleType)}
                          aria-describedby='validation-basic-select'
                          {...(errors.vehicleType && { helperText: 'This field is required' })}
                        >
                          {vehicleType.map(door => (
                            <MenuItem key={door.id} value={door.id}>
                              {door.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                        {value && (
                          <IconButton
                            size='small'
                            style={{ position: 'absolute', right: 25, top: 25 }}
                            onClick={() => handleClear(onChange)}
                          >
                            <Icon icon='tabler:x' fontSize='1rem' />
                          </IconButton>
                        )}
                      </Box>
                    )
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='parkingId'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    console.log(value),
                    (
                      <Box position='relative'>
                        <CustomTextField
                          select
                          fullWidth
                          label='Bãi đỗ xe'
                          SelectProps={{
                            value: value ?? '',
                            onChange: e => onChange(e.target.value)
                          }}
                          id='validation-basic-select'
                          error={Boolean(errors.paking)}
                          aria-describedby='validation-basic-select'
                          {...(errors.paking && { helperText: 'This field is required' })}
                        >
                          {paking.map(door => (
                            <MenuItem key={door.id} value={door.id}>
                              {door.name}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                        {value && (
                          <IconButton
                            size='small'
                            style={{ position: 'absolute', right: 25, top: 25 }}
                            onClick={() => handleClear(onChange)}
                          >
                            <Icon icon='tabler:x' fontSize='1rem' />
                          </IconButton>
                        )}
                      </Box>
                    )
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                    Lọc
                  </Button>
                  <Button variant='tonal' color='secondary' onClick={onClose}>
                    Hủy
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
