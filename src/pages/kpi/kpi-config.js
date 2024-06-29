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
    label: 'Tên KPI'
  },
  {
    id: 2,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'type',
    label: 'Mô tả'
  },
  {
    id: 3,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'username',
    label: 'Người tạo'
  },
  {
    id: 4,
    flex: 0.15,
    maxWidth: 30,
    align: 'center',
    field: 'time',
    label: 'Ngày tạo',
    renderCell: value => new Date(value).toLocaleString()
  },
  {
    id: 5,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'updatedBy',
    label: 'Người cập nhật'
  },
  {
    id: 6,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'updateTime',
    label: 'Ngày cập nhật',
    renderCell: value => new Date(value).toLocaleString()
  },
  {
    id: 7,
    flex: 0.15,
    maxWidth: 50,
    align: 'center',
    field: 'status',
    label: 'Trạng thái'
  }
]

// ** Hàm tạo dữ liệu giả
const generateFakeData = () => {
  const fakeData = [
    {
      name: 'Nhân viên kỹ thuật',
      type: 'Type 1',
      username: 'User 1',
      time: new Date().toISOString(),
      updatedBy: 'User 2',
      updateTime: new Date().toISOString(),
      status: 'Active'
    },
    {
      name: 'Nhân viên kinh doanh',
      type: 'Type 2',
      username: 'User 3',
      time: new Date().toISOString(),
      updatedBy: 'User 4',
      updateTime: new Date().toISOString(),
      status: 'Inactive'
    },
    {
      name: 'Nhân viên bảo hiểm',
      type: 'Type 3',
      username: 'User 5',
      time: new Date().toISOString(),
      updatedBy: 'User 6',
      updateTime: new Date().toISOString(),
      status: 'Pending'
    },
    {
      name: 'Nhân viên kế toán',
      type: 'Type 4',
      username: 'User 7',
      time: new Date().toISOString(),
      updatedBy: 'User 8',
      updateTime: new Date().toISOString(),
      status: 'Completed'
    },
    {
      name: 'Nhân viên logistic',
      type: 'Type 5',
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

  useEffect(() => {
    // Gán dữ liệu giả khi component được mount
    setFakeData(generateFakeData())
  }, [])

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
          alignItems: ['flex-start', 'center']
        }}
        action={
          <Grid item xs={8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
            <Button variant='contained' component={Link} href={`/kpi/adds`}>
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
                          {renderCell ? renderCell(value) : value}
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
    </Grid>
  )
}

export default AutocompleteAsynchronousRequest
