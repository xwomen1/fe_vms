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

const defaultValues = {
  doorStatuses: ''
}

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const doorStatuses = [
    { name: 'ACTIVE', id: 'ACTIVE' },
    { name: 'FREE', id: 'FREE' },
    { name: 'DISCONNECTED', id: 'DISCONNECTED' },
    { name: 'UNASSIGN', id: 'UNASSIGN' },
    { name: 'LOCKED', id: 'LOCKED' }
  ]

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
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

  const onReset = values => {
    var detail = {
      doorStatuses: ''
    }
    callback(detail)
    onClose()
    console.log(detail)
  }

  const onSubmit = values => {
    var detail = { ...values }
    callback(detail)
    onClose()
  }

  const handleClear = (onChange, field) => {
    onChange('')
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
          <form>
            <Grid container>
              <Grid item xs={12}>
                <Controller
                  name='doorStatuses'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box position='relative'>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        label='Status'
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e)
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.doorStatuses)}
                        aria-describedby='validation-basic-select'
                        {...(errors.doorStatuses && { helperText: 'This field is required' })}
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
                          onClick={() => handleClear(onChange, 'doorInId')}
                        >
                          <Icon icon='tabler:x' fontSize='1rem' />
                        </IconButton>
                      )}
                    </Box>
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
                    Filter
                  </Button>
                  <Button variant='tonal' onClick={handleSubmit(onReset)}>
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
