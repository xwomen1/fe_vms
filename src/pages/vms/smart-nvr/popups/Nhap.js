import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { FormControl, IconButton, InputLabel, Select } from '@mui/material'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/asset/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [assettype, setAssetType] = useState([])

  const [total, setTotal] = useState([1])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Accept',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Agree',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Cancel',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#002060'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const createData = (name, ch1, ch2) => {
    return { name, ch1, ch2 }
  }

  const assetTypes = [
    createData('Frozen Encoding Paramenter	    ', 'Main Stream(Continuous)    ', 'Main Stream(Event)    '),
    createData(
      'Stream Type	    ',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Video & Audio</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Video & Audio</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    ),
    createData(
      'Resolution',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>1920'1090(1080P)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>1920'1080(1080P)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    ),
    createData(
      'Bitrate Type',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Constant</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Constant</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    ),
    createData(
      'Max. Bitrate Range Reacommender',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>3840~6400(kbps)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>3840~6400(kbps)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    )
  ]

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  console.log(total, 'totalpage')

  return <Grid container spacing={2}></Grid>
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
