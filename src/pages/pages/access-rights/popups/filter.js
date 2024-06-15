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
import toast from 'react-hot-toast'
import { TreeItem, TreeView } from '@mui/lab'

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
  groupId: null,
  doorInId: null,
  doorOutId: null
}

const Filter = ({ show, onClose, valueFilter, callback, direction }) => {
  const [loading, setLoading] = useState(false)
  const API_ENDPOINT = 'https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups'
  const API_POST_URL = `https://dev-ivi.basesystem.one/smc/access-control/api/v0/user-groups`
  const ExpandIcon = direction === 'rtl' ? 'tabler:chevron-left' : 'tabler:chevron-right'
  const [doorList, setDoorList] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroupName, setSelectedGroupName] = useState('')
  const [groupName, setGroupName] = useState([])
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

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

  const fetchDoorList = async () => {
    try {
      const res = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/doors
            `,
        config
      )
      setDoorList(res.data.rows)
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const fetchDepartment = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_ENDPOINT)
      const group = res.data.rows
      setGroupName(group)

      // Loop through each group and fetch its children if it's a parent

      group.forEach(item => {
        if (item.type === 'USER') {
          fetchDepartmentChildren(item.id)
        }
      })
    } catch (error) {
      console.error('Error fetching data: ', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartmentChildren = async idParent => {
    try {
      const res = await axios.get(API_ENDPOINT, {
        params: {
          parentId: idParent
        }
      })
      const groupChildren = res.data.data.rows
      setGroupName(prevState => [...prevState, ...groupChildren])
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  useEffect(() => {
    reset(valueFilter) // Cập nhật giá trị mặc định mỗi khi valueFilter thay đổi
  }, [valueFilter, reset])

  useEffect(() => {
    fetchDoorList()
    fetchDepartment()
  }, [])

  const onReset = values => {
    var detail = {
      doorInId: '',
      doorOutId: '',
      groupId: ''
    }
    callback(detail)
    onClose()
  }

  const onSubmit = values => {
    var detail = { ...values } // Thêm selectedGroupId vào object detail trước khi callback
    callback(detail)
    onClose()
  }

  const handleClear = (onChange, field) => {
    onChange('')
    if (field === 'groupId') {
      setSelectedGroupId('')
    } else if (field === 'doorInId') {
      // Handle doorInId clear
    } else if (field === 'doorOutId') {
      // Handle doorOutId clear
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
              Bộ lọc
            </Typography>
          </Box>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='groupId'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box position='relative'>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        label='Công ty'
                        SelectProps={{
                          value: value,
                          onChange: e => {
                            onChange(e)
                            setSelectedGroupId(e.target.value)
                          },
                          MenuProps: {
                            PaperProps: {
                              style: {
                                maxHeight: 200 // Đặt chiều cao tối đa của menu
                              }
                            }
                          }
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.groupId)}
                        aria-describedby='validation-basic-select'
                        {...(errors.groupId && { helperText: 'This field is required' })}
                      >
                        {groupName.map(item => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                      {value && (
                        <IconButton
                          size='small'
                          style={{ position: 'absolute', right: 25, top: 25 }}
                          onClick={() => handleClear(onChange, 'groupId')}
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
                  name='doorInId'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box position='relative'>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        label='Cửa vào'
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e)
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.doorInId)}
                        aria-describedby='validation-basic-select'
                        {...(errors.doorInId && { helperText: 'This field is required' })}
                      >
                        {doorList.map(door => (
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
              <Grid item xs={12} sm={4}>
                <Controller
                  name='doorOutId'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box position='relative'>
                      <CustomTextField
                        select
                        fullWidth
                        defaultValue=''
                        label='Cửa ra'
                        SelectProps={{
                          value: value,
                          onChange: e => onChange(e)
                        }}
                        id='validation-basic-select'
                        error={Boolean(errors.doorOutId)}
                        aria-describedby='validation-basic-select'
                        {...(errors.doorOutId && { helperText: 'This field is required' })}
                      >
                        {doorList.map(door => (
                          <MenuItem key={door.id} value={door.id}>
                            {door.name}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                      {value && (
                        <IconButton
                          size='small'
                          style={{ position: 'absolute', right: 25, top: 25 }}
                          onClick={() => handleClear(onChange, 'doorOutId')}
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
