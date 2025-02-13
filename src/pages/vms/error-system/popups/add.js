import { useState, forwardRef, useEffect } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
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
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import CustomAvatar from 'src/@core/components/mui/avatar'
import moment from 'moment'

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

const initValues = {
  imageObject: null,
  camName: null,
  description: '',
  timestamp: null,
  location: null,
  imageResult: null
}

const format_form = [
  {
    name: 'imageObject',
    label: 'Image',
    placeholder: 'Image',
    type: 'ImageObject',
    data: [],
    require: true,
    width: 12
  },
  {
    name: 'description',
    label: 'Object',
    placeholder: 'Object',
    type: 'TextField',
    data: [],
    require: true,
    width: 12
  },
  {
    name: 'timestamp',
    label: 'Time ',
    placeholder: 'Time',
    type: 'TextField',
    data: [],
    require: true,
    width: 12
  },
  {
    name: 'camName',
    label: 'Camera',
    placeholder: 'Camera',
    type: 'VAutocomplete',
    data: [],
    require: true,
    width: 12
  },
  {
    name: 'location',
    label: 'Location',
    placeholder: 'Location',
    type: 'VAutocomplete',
    data: [],
    require: true,
    width: 12
  },
  {
    name: 'imageResult',
    label: 'Image Result',
    placeholder: 'Image Result',
    type: 'ImageResult',
    data: [],
    require: true,
    width: 12
  }
]

const Add = ({ show, onClose, id, data, setReload, filter }) => {
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(null)
  const [cameraList, setCameraList] = useState([])
  const [locationList, setLocationList] = useState([])
  const API_REGIONS = `https://dev-ivi.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/me/`
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(format_form)

  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: initValues
  })

  const fetchCameraList = async () => {
    try {
      const res = await axios.get(`https://votv.ivms.vn/votv/vms/api/v0/cameras?sort=%2Bcreated_at`, config)
      setCameraList(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const fetchLocationList = async () => {
    try {
      const res = await axios.get(`${API_REGIONS}/?parentId=7cac40af-6b9e-47e6-9aba-8d458722d5a4`, config)
      setLocationList(res.data)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    if (detail) {
      setDetailFormValue()
    }
  }, [detail])

  const setDetailFormValue = () => {
    reset(detail)
  }

  useEffect(() => {
    setDetail(data)
    fetchCameraList()
    fetchLocationList()
  }, [])

  const onSubmit = values => {
    handleUpdate(values)
  }

  const handleAdd = values => {}

  const handleUpdate = values => {
    const params = {
      ...values
    }

    setLoading(true)
    axios
      .put(`https://sbs.basesystem.one/ivis/cmsgo/api/v0/aievents/update/${data.id}`, { ...params }, config)
      .then(() => {
        toast.success('Updated successfully')
        setReload()
        onClose()
      })
      .catch(err => {
        console.error('Error fetching data: ', err)
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Card>
      <form>
        <Dialog
          open={show}
          maxWidth='lg'
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
                Details
              </Typography>
            </Box>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Grid container spacing={2}>
                    {form.map((item, index) => {
                      if (item.type == 'ImageObject') {
                        return (
                          <Grid item xs={12} key={index}>
                            <Controller
                              name={item.name}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Box>
                                  <Typography sx={{ mb: 1 }}>{item?.label}</Typography>
                                  <CustomAvatar
                                    src={value}
                                    variant='rounded'
                                    alt={''}
                                    sx={{ width: '100%', height: '100%', mb: 4 }}
                                  />
                                </Box>
                              )}
                            />
                          </Grid>
                        )
                      }
                      if (item.type == 'TextField') {
                        return (
                          <Grid item xs={12} key={index}>
                            <Controller
                              name={item.name}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomTextField
                                  fullWidth
                                  disabled={item.name == 'timestamp' ? true : false}
                                  value={
                                    item.name == 'timestamp'
                                      ? moment(new Date(value)).format('DD/MM/YYYY HH:mm:ss')
                                      : value
                                  }
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
                      if (item.type == 'VAutocomplete') {
                        return (
                          <Grid item xs={12} key={index}>
                            <Controller
                              name={item.name}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => {
                                return (
                                  <CustomTextField
                                    select
                                    fullWidth
                                    label={item.label}
                                    SelectProps={{
                                      value: value,
                                      onChange: e => onChange(e)
                                    }}
                                    id='validation-basic-select'
                                    error={Boolean(errors[item.name])}
                                    aria-describedby='validation-basic-select'
                                    {...(errors[item.name] && { helperText: 'This field is required' })}
                                  >
                                    {item.name === 'camName' &&
                                      cameraList.map(x => (
                                        <MenuItem key={x.id} value={x.name}>
                                          {x.name}
                                        </MenuItem>
                                      ))}
                                    {item.name === 'location' &&
                                      locationList.map(x => (
                                        <MenuItem key={x.id} value={x.name}>
                                          {x.name}
                                        </MenuItem>
                                      ))}
                                  </CustomTextField>
                                )
                              }}
                            />
                          </Grid>
                        )
                      }
                    })}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Grid container spacing={0}>
                    {form.map((item, index) => {
                      if (item.type == 'ImageResult') {
                        return (
                          <Grid item xs={12} key={index}>
                            <Controller
                              name={item.name}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Box>
                                  <Typography sx={{ mb: 1 }}>{item.label}</Typography>
                                  <CustomAvatar
                                    src={value}
                                    variant='rounded'
                                    alt={''}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </Box>
                              )}
                            />
                          </Grid>
                        )
                      }
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'flex-end',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='tonal' color='secondary' onClick={onClose}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </Card>
  )
}

export default Add
