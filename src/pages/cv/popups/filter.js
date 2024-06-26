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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
  location: null,
  cameraName: null,
  startTime: null,
  endTime: null,
  keyword: '',
  limit: 25,
  page: 1
}

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
  const [loading, setLoading] = useState(false)
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [locations, setLocations] = useState([])
  const [cameras, setCameras] = useState([])

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {}
  }

  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        `https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/?parentId=7cac40af-6b9e-47e6-9aba-8d458722d5a4
            `,
        config
      )
      setLocations(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const fetchCameras = async () => {
    try {
      const res = await axios.get(`https://sbs.basesystem.one/ivis/vms/api/v0/cameras`, config)
      setCameras(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: initValueFilter })

  useEffect(() => {
    fetchLocations()
    fetchCameras()
  }, [])

  const onReset = values => {
    var detail = {
      location: '',
      cameraName: '',
      startTime: null,
      endTime: null
    }
    callback(detail)
    onClose()
  }

  const onSubmit = values => {
    var detail = { ...values }
    detail['startTime'] = startTime.getTime()
    detail['endTime'] = endTime.getTime()
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
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Bộ lọc
            </Typography>
          </Box>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='time-validity-label'>Loại hợp đồng</InputLabel>
                  <Select labelId='time-validity-label' id='time-validity-select'>
                    <MenuItem value='Custom'>10 năm</MenuItem>
                    <MenuItem value='Undefine'>5 năm</MenuItem>
                    <MenuItem value='Undefined'>3 tháng</MenuItem>
                    <MenuItem value='Undefineds'>6 tháng</MenuItem>

                    <MenuItem value='Undefiness'>Không thời hạn</MenuItem>
                  </Select>
                </FormControl>
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
                  <Button variant='tonal' onClick={handleSubmit(onReset)}>
                    Mặc định
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
