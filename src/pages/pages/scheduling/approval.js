import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import toast from 'react-hot-toast'
import { getApi } from 'src/@core/utils/requestUltils'

const statusAppointment = [
  {
    id: 'WAITING',
    color: 'primary'
  },
  {
    id: 'CANCELLED',
    color: 'Secondary'
  },
  {
    id: 'COMPLETE',
    color: 'success'
  },
  {
    id: 'APPROVED',
    color: 'info'
  },
  {
    id: 'UNSUCCESSFUL',
    color: 'error'
  },
  {
    id: 'OUT_OF_DATE',
    color: 'warning'
  },
]


const Approval = ({ keyword, valueFilter }) => {
  const [loading, setLoading] = useState(false)
  const [dataList, setDataList] = useState([])
  const [pageSize, setPageSize] = useState(25)
  const [anchorEl, setAnchorEl] = useState(null)
  const pageSizeOptions = [25, 50, 100]
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    fetchDataList(newPage, pageSize)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    fetchDataList(1, size)
    handleCloseMenu()
  }

  const convertMinutesToTime = minutes => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {
        keyword: keyword,
        page: page,
        limit: pageSize,
        ...valueFilter
      }

      const response = await getApi(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/registrations`,
        params
      )
      setDataList(response.data?.rows)
      setTotal(Math.ceil(response.data?.count / pageSize)) // Tính tổng số trang dựa trên tổng số mục và kích thước trang
    } catch (error) {
      if (error && error?.response?.data) {
        console.error('error', error)
        toast.error(error?.response?.data?.message)
      } else {
        console.error('Error fetching data:', error)
        toast.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [keyword, page, pageSize, valueFilter])


  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <CardContent sx={{ flex: 1, overflow: 'auto' }}>
          <Table>
            <TableHead style={{ background: '#F6F6F7' }}>
              <TableRow>
                <TableCell sx={{ padding: '16px' }}>NO.</TableCell>
                <TableCell sx={{ padding: '16px' }}>Order Code</TableCell>
                <TableCell sx={{ padding: '16px' }}>Appointment Date</TableCell>
                <TableCell sx={{ padding: '16px' }}>Time</TableCell>
                <TableCell sx={{ padding: '16px' }}>Work Area</TableCell>
                <TableCell sx={{ padding: '16px' }}>Arrival Unit</TableCell>
                <TableCell sx={{ padding: '16px' }}>Number of Guests</TableCell>
                <TableCell sx={{ padding: '16px' }}>Request Type</TableCell>
                <TableCell sx={{ padding: '16px' }}>Approver</TableCell>
                <TableCell sx={{ padding: '16px' }}>Document Number</TableCell>
                <TableCell sx={{ padding: '16px' }}>Status</TableCell>
                <TableCell sx={{ padding: '16px' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(dataList) && dataList.length > 0 ? (
                dataList.map((Guests, index) => {
                  const statusGuests = statusAppointment.find(status => status.id === Guests?.status)

                  return (
                    <TableRow key={Guests.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Button size='small' sx={{ color: 'blue' }}>
                          {Guests.code}
                        </Button>
                      </TableCell>
                      <TableCell>{Guests.startDate}</TableCell>
                      <TableCell>
                        {convertMinutesToTime(Guests.startTimeInMinute)} - {convertMinutesToTime(Guests.endTimeInMinute)}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>{Guests.guestInfo?.guestCount}</TableCell>
                      <TableCell>{Guests.repeatType}</TableCell>
                      <TableCell>{Guests.approverInfo?.fullName}</TableCell>
                      <TableCell>{Guests.guestInfo?.identityNumber}</TableCell>
                      <TableCell>
                        <CustomChip label={statusGuests.id} skin='light' color={statusGuests.color} />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          component={Link}
                          href={`/pages/scheduling/detail/${Guests.id}`}
                        >
                          <Icon icon='tabler:info-circle' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align='center'>
                    Data not available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardActions sx={{ backgroundColor: 'white', padding: '8px' }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'right', mb: 1 }}>
              <IconButton onClick={handleOpenMenu}>
                <Icon icon='tabler:selector' />
                <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                {pageSizeOptions.map(size => (
                  <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                    {size}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Pagination
                count={total}
                color='primary'
                page={page}
                onChange={(event, newPage) => handlePageChange(event, newPage)}
                sx={{ display: 'flex', justifyContent: 'center' }}
              />
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  )
}

export default Approval
