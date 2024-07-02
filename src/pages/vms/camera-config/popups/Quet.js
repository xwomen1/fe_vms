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

const ScanDevice = ({ apiData, response }) => {
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
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      },
      confirmButtonColor: '#FF9F43'
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const createData = (name, type, ip, aibox, mac, vitri, status) => {
    return { name, type, ip, aibox, mac, vitri, status }
  }

  const assetTypes = [
    createData('Cam POC1', '', '192.168.1.1', '', '', 'Ha Noi', 'Khong hoat dong'),
    createData('Cam POC2', '', '192.168.1.1', '', '', 'Ha Noi', 'Khong hoat dong'),
    createData('Cam POC3', '', '192.168.1.1', '', '', 'Ha Noi', 'Khong hoat dong'),
    createData('Cam POC4', '', '192.168.1.1', '', '', 'Ha Noi', 'Khong hoat dong'),
    createData('Cam POC5', '', '192.168.1.1', '', '', 'Ha Noi', 'Khong hoat dong')
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên Camera</TableCell>
              <TableCell>Loai</TableCell>
              <TableCell>Dia chi IP</TableCell>
              <TableCell>Ket noi NVR/AIBOX</TableCell>
              <TableCell>Dia chi Mac</TableCell>
              <TableCell>Vi tri</TableCell>
              <TableCell>Trang thai</TableCell>
              <TableCell>Thao tac</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assetTypes.map((assetType, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{assetType.name}</TableCell>
                <TableCell>{assetType.type}</TableCell>
                <TableCell>{assetType.ip}</TableCell>
                <TableCell>{assetType.aibox}</TableCell> <TableCell>{assetType.mac}</TableCell>{' '}
                <TableCell>{assetType.vitri}</TableCell> <TableCell>{assetType.status}</TableCell>
                <TableCell sx={{ padding: '16px' }}>
                  <Grid container spacing={2}>
                    <IconButton>
                      <Icon icon='tabler:plus' />
                    </IconButton>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

export default ScanDevice
