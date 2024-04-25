import { useState, forwardRef, useEffect } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, MenuItem, Typography, styled } from '@mui/material'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import Daily from '../mocdata/daily'

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

const dataDailyDefault = [
  {
    label: '',
    value: 1,
  },
  {
    label: 'Thứ 2',
    StringValue: 'MONDAY',
    value: 2,
  },
  {
    label: 'Thứ 3',
    StringValue: 'TUESDAY',
    value: 3,
  },
  {
    label: 'Thứ 4',
    StringValue: 'WEDNESDAY',
    value: 4,
  },
  {
    label: 'Thứ 5',
    StringValue: 'THURSDAY',
    value: 5,
  },
  {
    label: 'Thứ 6',
    StringValue: 'FRIDAY',
    value: 6,
  },
  {
    label: 'Thứ 7',
    StringValue: 'SATURDAY',
    value: 7,
  },
  {
    label: 'CN',
    StringValue: 'SUNDAY',
    value: 8,
  },
]

const Schedule = ({ show, onClose, valueFilter, callback, direction }) => {
  const [loading, setLoading] = useState(false)
  const [dataDaily, setDataDaily] = useState([])
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({})

  const onReset = (values) => {
    var detail = {}
    callback(detail)
    onClose()
  }

  const onSubmit = (values) => {
    var detail = { ...values }
    callback(detail)
    onClose()
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
          <Box sx={{ mb: 8, textAlign: 'left' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Cấu hình lịch
            </Typography>
          </Box>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name='calendarDays'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Daily
                      callbackOfDaily={(v) => {
                        onChange(v)
                        setDataDaily(v)
                        setDataDailyState(v)
                      }}
                      dataDailyProps={dataDailyState}
                      error={Boolean(errors.calendarDays)}
                      aria-describedby='validation-basic-last-name'
                      {...(errors.calendarDays && { helperText: 'Trường này bắt buộc' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <DialogActions
                  sx={{
                    justifyContent: 'right',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  <Button variant='tonal' color='secondary' onClick={onClose}>
                    Hủy
                  </Button>
                  <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                    Thêm
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

export default Schedule