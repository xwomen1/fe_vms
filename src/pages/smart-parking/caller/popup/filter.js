import { forwardRef, useState, useEffect } from 'react'
import {
  Autocomplete,
  Button,
  DialogActions,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'

import { Dialog, DialogTitle, DialogContent } from '@mui/material'

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

const Filter = ({ open, onClose, fetchGroupData }) => {
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [activationStatus, setActivationStatus] = useState('')

  useEffect(() => {
    fetchGroups()
    fetchServices()
  }, [])

  const fetchGroups = () => {
    axios
      .get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=dv')
      .then(response => {
        setGroups(response.data)
      })
      .catch(error => {
        console.error('Error fetching groups:', error)
      })
  }

  const fetchServices = () => {
    axios
      .get('https://sbs.basesystem.one/ivis/infrares/api/v0/regions/children-lv1/children/code?parentCode=dichvu')
      .then(response => {
        setServices(response.data)
      })
      .catch(error => {
        console.error('Error fetching services:', error)
      })
  }

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    if (selectedGroup && selectedService) {
      const params = {
        serviceParkingId: selectedService.id || '',
        sort: '',
        status: activationStatus === 'Yes' ? 'YES' : 'NO'
      }

      fetchGroupData(params)
      onClose()
      toast.success('Lọc thành công')
    }
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
      <Button>Lọc loại thuê bao</Button>
      <DialogContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id='activation-status-label'>Trạng thái kích hoạt</InputLabel>
              <Select
                labelId='activation-status-label'
                id='activation-status-select'
                value={activationStatus}
                onChange={event => setActivationStatus(event.target.value)}
              >
                <MenuItem value='Yes'>Đã kích hoạt</MenuItem>
                <MenuItem value='No'>Chưa kích hoạt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={selectedGroup}
              onChange={(event, newValue) => {
                setSelectedGroup(newValue)
              }}
              options={groups}
              getOptionLabel={option => option.name}
              renderInput={params => <TextField {...params} label='Đơn vị đang sử dụng' variant='outlined' fullWidth />}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              value={selectedService}
              onChange={(event, newValue) => {
                setSelectedService(newValue)
              }}
              options={services}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField {...params} label='Dịch vụ đang sử dụng' variant='outlined' fullWidth />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button variant='contained' onClick={handleOk}>
          Lọc
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Filter
