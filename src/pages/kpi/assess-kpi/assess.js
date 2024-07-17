import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

// ** MUI Import
import {
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import Link from 'next/link'

// ** Third Party Imports
import axios from 'axios'
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import AddPopup from './../popup/addAssign'

const sleep = (delay = 0) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

const columns = [
  {
    id: 1,
    flex: 0.25,
    maxWidth: 50,
    align: 'center',
    field: 'name',
    label: 'Tên phiếu'
  },
  {
    id: 2,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'type',
    label: 'Tên bộ KPI'
  },
  {
    id: 3,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'status',
    label: 'Trạng thái'
  },
  {
    id: 32,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'year',
    label: 'Năm đánh giá'
  },
  {
    id: 31,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'userreport',
    label: 'Người báo cáo'
  },
  {
    id: 34,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'username',
    label: 'Người thẩm định'
  }
]

// ** Hàm tạo dữ liệu giả
const generateFakeData = () => {
  const fakeData = [
    {
      name: 'Nhân viên kỹ thuật',
      type: 'NV kỹ thuật',
      username: 'Giám đốc điều hành',
      updatedBy: 'User 2',
      userreport: 'Quản lý dự án',
      year: '2024',
      status: 'Đang áp dụng'
    },
    {
      name: 'Nhân viên kinh doanh',
      type: 'NV kinh doanh',
      username: 'User 3',
      userreport: 'Quản lý dự án',
      year: '2024',
      time: new Date().toISOString(),
      updatedBy: 'User 4',
      updateTime: new Date().toISOString(),
      status: 'Inactive'
    },
    {
      name: 'Nhân viên bảo hiểm',
      type: 'NV bảo hiểm',
      userreport: 'Quản lý dự án',
      year: '2024',
      username: 'User 5',
      time: new Date().toISOString(),
      updatedBy: 'User 6',
      updateTime: new Date().toISOString(),
      status: 'Pending'
    },
    {
      name: 'Nhân viên kế toán',
      type: 'NV kế toán',
      userreport: 'Quản lý dự án',
      year: '2022',
      username: 'User 7',
      time: new Date().toISOString(),
      updatedBy: 'User 8',
      updateTime: new Date().toISOString(),
      status: 'Completed'
    },
    {
      name: 'Nhân viên logistic',
      type: 'NV logistic',
      userreport: 'Quản lý dự án',
      year: '2024',
      username: 'User 9',
      time: new Date().toISOString(),
      updatedBy: 'User 10',
      updateTime: new Date().toISOString(),
      status: 'Cancelled'
    }
  ]

  return fakeData
}

const AutocompleteAsynchronousRequest = () => {
  // ** States
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [fakeData, setFakeData] = useState([]) // Sửa lại để khởi tạo với mảng rỗng
  const loading = open && options.length === 0
  const [openPopupAdd, setOpenPopupAdd] = useState(false)

  const handleOpenAdd = () => {
    setOpenPopupAdd(true)
  }

  const handleCloseAdd = () => {
    setOpenPopupAdd(false)
  }

  useEffect(() => {
    // Gán dữ liệu giả khi component được mount
    setFakeData(generateFakeData())
  }, [])

  const handleAddNewKpi = newKpi => {
    setKpiData([...kpiData, { ...newKpi, stt: kpiData.length + 1 }])
    handleCloseAdd()
  }

  useEffect(() => {
    let active = true
    if (!loading) {
      return undefined
    }

    const fetchData = async () => {
      const response = await axios.get('/forms/autocomplete')
      await sleep(1000)
      const top100Films = await response.data
      if (active) {
        setOptions(Object.keys(top100Films).map(key => top100Films[key]))
      }
    }
    fetchData()

    return () => {
      active = false
    }
  }, [loading])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <Grid item xs={12} component={Paper}>
      <CardHeader
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 4,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center'],
          justifyContent: 'space-between'
        }}
        action={
          <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <CustomTextField
              sx={{ mr: 2 }}
              placeholder='Tìm kiếm'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <IconButton>
                      <Icon icon='tabler:search' />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={e => handleFilter(e.target.value)}
            />
            <Button variant='contained' onClick={() => handleOpenAdd()}>
              Thêm mới
            </Button>
          </Grid>
        }
      />
      <Grid item xs={11.5} style={{ marginTop: '16px' }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>STT</TableCell> {/* Căn giữa cột STT */}
                {columns.map(({ id, label, field, renderCell, align, maxWidth }) => (
                  <TableCell key={id} align={align} sx={{ maxWidth }}>
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {fakeData.map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell align='center'>{index + 1}</TableCell> {/* Căn giữa cột STT */}
                    {columns.map(({ field, renderCell, align, maxWidth }) => {
                      const value = row[field]

                      return (
                        <TableCell
                          key={field}
                          align={align}
                          sx={{ maxWidth, wordBreak: 'break-word', flexWrap: 'wrap' }}
                        >
                          {field === 'name' ? (
                            <a component={Link} href={`/kpi/assess-kpi/assess-info`}>
                              {value}
                            </a>
                          ) : renderCell ? (
                            renderCell(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {openPopupAdd && <AddPopup open={openPopupAdd} onClose={handleCloseAdd} onAddNewKpi={handleAddNewKpi} />}
    </Grid>
  )
}

export default AutocompleteAsynchronousRequest
