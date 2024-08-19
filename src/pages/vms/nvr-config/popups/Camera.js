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
import { FormControl, IconButton, InputLabel, Paper, Select } from '@mui/material'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/asset/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'

import Daily from 'src/pages/pages/access-rights/mocdata/daily'

const dataDailyDefault = [
  {
    label: '',
    value: 1
  },
  {
    label: 'Thứ 2',
    dayOfWeek: 'MONDAY',
    value: 2
  },
  {
    label: 'Thứ 3',
    dayOfWeek: 'TUESDAY',
    value: 3
  },
  {
    label: 'Thứ 4',
    dayOfWeek: 'WEDNESDAY',
    value: 4
  },
  {
    label: 'Thứ 5',
    dayOfWeek: 'THURSDAY',
    value: 5
  },
  {
    label: 'Thứ 6',
    dayOfWeek: 'FRIDAY',
    value: 6
  },
  {
    label: 'Thứ 7',
    dayOfWeek: 'SATURDAY',
    value: 7
  },
  {
    label: 'CN',
    dayOfWeek: 'SUNDAY',
    value: 8
  }
]

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [dataDaily, setDataDaily] = useState([])
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)

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

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Grid container spacing={2} style={{ minWidth: 500 }}>
      <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
        <Grid item xs={5.8}>
          <FormControl fullWidth>
            <InputLabel id='time-validity-label'>Camera</InputLabel>
            <Select labelId='time-validity-label' id='time-validity-select'>
              <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
              <MenuItem value='Undefined'>Không xác định</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={0.4}></Grid>
        <Grid item xs={5.8}>
          <FormControl fullWidth>
            <InputLabel id='time-validity-label'>Channel</InputLabel>
            <Select labelId='time-validity-label' id='time-validity-select'>
              <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
              <MenuItem value='Undefined'>Không xác định</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>Time configuration table</Grid>
        <Daily
          callbackOfDaily={v => {
            setDataDaily(v)
            setDataDailyState(v)
          }}
          dataDailyProps={dataDailyState}
        />
      </Grid>
    </Grid>
  )
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
