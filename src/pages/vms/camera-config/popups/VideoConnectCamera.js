import { useEffect, useState } from 'react'
import { Grid, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import Quet from './Quet'
import Nhap from './Nhap'
import Port from './Port'
import NTP from './NTP'

import {
  Autocomplete,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material'

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))
import Swal from 'sweetalert2'

const RolePopup = ({ open, onClose, onSelect, nvr }) => {
  const [selectedRole, setSelectedRole] = useState(null)
  const [groupName, setGroupName] = useState([])
  const [defaultGroup, setDefaultGroup] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null) // Thêm trạng thái để lưu trữ id của nhóm được chọn
  const [nvrs, setNvrs] = useState([])
  const [groupCode, setGroupCode] = useState([])
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Storage configuration</DialogTitle>
      <DialogContent>
        <Grid> Xem truc tiep</Grid>
        <video width='320' height='240' controls>
          <source src='path/to/your/video.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
      <DialogActions>
        <Button>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RolePopup
