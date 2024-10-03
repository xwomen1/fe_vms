import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Menu,
  MenuItem,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Table,
  InputAdornment,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import Link from 'next/link'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import CustomTextField from 'src/@core/components/mui/text-field'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import toast from 'react-hot-toast'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import DayOfWeek from '../../scheduling/popups/dayOfWeek'
import { add, eachDayOfInterval, format, isAfter, startOfDay } from 'date-fns'
import { uniq } from 'lodash'
import { callApiWithConfig, getApi, METHODS, postApi } from 'src/@core/utils/requestUltils'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const DetailGuest = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentTab, setCurrentTab] = useState('1')
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [card, setCard] = useState([])
  const [events, setEvents] = useState([])
  const [guests, setGuests] = useState([])
  const [pageSize, setPageSize] = useState(25)
  const [anchorEl, setAnchorEl] = useState(null)
  const pageSizeOptions = [25, 50, 100]
  const [total, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

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

  const [formValues, setFormValues] = useState({
    fullName: '',
    phoneNumber: '',
    identityNumber: '',
    email: '',
    address: ''
  })
  const router = useRouter()
  const id = router.query.detailGuest
  console.log(id)

  useEffect(() => {
    if (id) {
      fetchDataListGuest()
    }
  }, [id, keyword])

  useEffect(() => {
    fetchDataList()
  }, [id])

  const fetchDataList = async () => {
    if (!id) return
    setLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/guests/${id}`, config)
      const data = response.data
      setData(data)
      setFormValues({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        identityNumber: data.identityNumber,
        email: data.email,
        address: data.address,
        gender: data.gender,
        accessCode: data.accessCode
      })
      console.log(data, 'data')
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  console.log(formValues, 'formValues')

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

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const fetchDataListGuest = async () => {
    if (!id) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          guestIds: id,
          keyword: keyword
        }
      }

      const response = await axios.get(`https://dev-ivi.basesystem.one/smc/access-control/api/v0/registrations`, config)

      const data = response.data?.rows
      setGuests(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  console.log(guests, 'guest')

  const formatTimestamp = timestamp => {
    if (!timestamp) return ''

    return format(new Date(timestamp), 'HH:mm:ss dd/MM/yyyy')
  }

  const onSubmit = async () => {
    try {
      setLoading(true)

      const payload = {
        fullName: formValues.fullName,
        phoneNumber: formValues.phoneNumber,
        identityNumber: formValues.identityNumber,
        email: formValues.email,
        address: formValues.address,
        isUpdateIdentity: formValues.identityNumber !== data.identityNumber
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      await axios.put(`https://dev-ivi.basesystem.one/smc/iam/api/v0/guests/${id}/update`, payload, config)

      toast.success('Update success ...!')
      setIsEditing(false) // Đặt lại chế độ chỉnh sửa sau khi cập nhật thành công
    } catch (error) {
      console.error('Error Update: ', error)
      toast.error(error.response?.data?.message || 'Error Update')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = event => {
    const { name, value } = event.target
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const guestsCol = [
    {
      dataField: 'code',
      label: 'Code',
      minWidth: 120,
      align: 'center'
    },
    {
      dataField: 'createdUsername',
      label: 'Subscribers',
      minWidth: 120,
      align: 'center',
      required: true
    },
    {
      dataField: 'groupName',
      label: 'Work Area',
      minWidth: 160,
      align: 'center',
      required: true
    },
    {
      dataField: 'areaName',
      label: 'Address/Company',
      minWidth: 140,
      align: 'center'
    },
    {
      dataField: 'startDate',
      label: 'Start Date',
      minWidth: 140,
      align: 'center'
    },
    {
      dataField: 'endDate',
      label: 'End Date',
      minWidth: 140,
      align: 'center'
    },
    {
      dataField: 'repeatType',
      label: 'Request Type',
      minWidth: 140,
      align: 'center'
    }
  ]

  const historycol = [
    {
      label: 'Time',
      minWidth: 120,
      align: 'center'
    },
    {
      label: 'Door',
      minWidth: 120,
      align: 'center',
      required: true
    },
    {
      label: 'ID Device',
      minWidth: 160,
      align: 'center',
      required: true
    },
    {
      label: 'Device',
      minWidth: 140,
      align: 'center'
    },
    ,
    {
      label: 'Event',
      minWidth: 140,
      align: 'center'
    }
  ]

  const cardcol = [
    {
      label: 'Code Card',
      minWidth: 120,
      align: 'center'
    },
    {
      label: 'Type Card',
      minWidth: 120,
      align: 'center',
      required: true
    },
    {
      label: 'Time',
      minWidth: 160,
      align: 'center',
      required: true
    },
    {
      label: 'Status',
      minWidth: 140,
      align: 'center'
    }
  ]

  return (
    <>
      <Box sx={{ marginBottom: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box display={'flex'}>
          <IconButton component={Link} href={`/pages/scheduling`}>
            <Icon icon='tabler:arrow-back' />
          </IconButton>
          <Typography variant='h5' fontWeight={550}>
            Guest details
          </Typography>
        </Box>

        <Box>
          {isEditing ? (
            <>
              <Button variant='contained' color='secondary' onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant='contained' color='primary' onClick={onSubmit} sx={{ margin: '0 10px' }}>
                Edit
              </Button>
            </>
          ) : (
            <Button variant='contained' color='primary' onClick={() => setIsEditing(true)}>
              Update
            </Button>
          )}
        </Box>
      </Box>
      {loading === true && (
        <Box
          sx={{
            width: '100%',
            height: ' 100%',
            position: 'absolute',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Card sx={{ margin: 2 }}>
        <CardHeader title={'General Information'} />
        <CardContent>
          <Grid container spacing={0} style={{ marginTop: '2%' }}>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Name'
                name='fullName'
                value={formValues.fullName} // Thay đổi ở đây
                disabled={!isEditing}
                onChange={handleChange} // Đảm bảo hàm này được truyền vào
                fullWidth
              />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                name='phoneNumber'
                label='Phone Number'
                value={formValues.phoneNumber}
                disabled={!isEditing}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Papers'
                name='identityNumber'
                value={formValues.identityNumber}
                disabled={!isEditing}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField
                label='Email'
                name='email'
                value={formValues.email}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
              />
            </Grid>
            <Grid item xs={2.8} style={{ margin: '10px 0' }}>
              <CustomTextField
                label='Address/Company'
                name='address'
                value={formValues.address}
                disabled={!isEditing}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8} style={{ margin: '10px 0' }}>
              <CustomTextField name='gender' label='gender' value={formValues.gender} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8} style={{ margin: '10px 0' }}>
              <CustomTextField
                name='accessCode'
                label='Identity Number'
                value={formValues.accessCode}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8} style={{ margin: '10px 0' }}>
              <CustomTextField
                label='Update Time'
                value={data ? formatTimestamp(data?.updatedAt) : ''}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              {data.documentFileId && (
                <Grid item sm={12} md={6} lg={4}>
                  <div style={{ position: 'relative' }}>
                    <p
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        margin: '10px',
                        color: '#fff',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        padding: '5px',
                        borderRadius: '5px'
                      }}
                    >
                      Ảnh giấy tờ
                    </p>
                    <img
                      alt='document-file'
                      src={`https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/public/download/${data.documentFileId}`}
                      style={{ width: '50%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <TabContext value={currentTab}>
        <TabList onChange={handleChangeTab}>
          <Tab label='Guest Registration' value='1' />
          <Tab label='Access history' value='2' />
          <Tab label='Identification' value='3' />
        </TabList>
        <TabPanel value='1'>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={1}>
              <Button variant='contained'>Guest</Button>
            </Grid>
            <Grid item xs={8}>
              <CustomTextField
                id='input-with-icon-adornment'
                fullWidth
                onChange={e => setKeyword(e.target.value)}
                placeholder='Search for registrant, name and ID of registrant, order number'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='tabler:search' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={3} sx={{ display: 'flex', marginTop: '-10px' }}>
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
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  {guestsCol.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {guests.length > 0 ? (
                  guests.map((row, index) => (
                    <TableRow hover tabIndex={-1} key={row.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      {guestsCol.map(col => {
                        const value = row[col.dataField]

                        return (
                          <TableCell key={`${row.id}-${col.dataField}`} align={col.align}>
                            {col?.renderCell ? col.renderCell(row) : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={guestsCol.length + 1} align='center'>
                      No guests available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value='2'>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={2}>
              <Button variant='contained'>History Access</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  {historycol.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length > 0 ? (
                  events.map((row, index) => (
                    <TableRow hover tabIndex={-1} key={row.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      {historycol.map(col => {
                        const value = row[col.dataField]

                        return (
                          <TableCell key={`${row.id}-${col.dataField}`} align={col.align}>
                            {col?.renderCell ? col.renderCell(row) : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={historycol.length + 1} align='center'>
                      No history available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value='3'>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={2}>
              <Button variant='contained'>Face</Button>
            </Grid>
          </Grid>
          <Grid container spacing={0} sx={{ margin: '20px 0' }}>
            <Grid item xs={5.5}>
              <CustomTextField label='Type Update' placeholder='Not yet identified' disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>

            <Grid item xs={5.5}>
              <CustomTextField label='Status' placeholder='Not yet identified' disabled fullWidth />
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={2}>
              <Button variant='contained'>Fingerprints</Button>
            </Grid>
          </Grid>
          <Grid container spacing={0} sx={{ margin: '20px 0' }}>
            <Grid item xs={5.5}>
              <CustomTextField label='Type Update' placeholder='Not yet identified' disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={5.5}>
              <CustomTextField label='Status' placeholder='Not yet identified' disabled fullWidth />
            </Grid>
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={2}>
              <Button variant='contained'>Card</Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper} sx={{ margin: '20px 0' }}>
            <Table stickyHeader aria-label='sticky table' sx={{ overflow: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  {cardcol.map(column => (
                    <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {card.length > 0 ? (
                  card.map((row, index) => (
                    <TableRow hover tabIndex={-1} key={row.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      {cardcol.map(col => {
                        const value = row[col.dataField]

                        return (
                          <TableCell key={`${row.id}-${col.dataField}`} align={col.align}>
                            {col?.renderCell ? col.renderCell(row) : value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={cardcol.length + 1} align='center'>
                      No card available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabContext>
    </>
  )
}

export default DetailGuest
