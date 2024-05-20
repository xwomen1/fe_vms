import { useEffect, useState, useCallback } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Input,
  Autocomplete,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { padding } from '@mui/system'

const InforAll = ({ idInfor }) => {
  const [device, setDevice] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  const directionOptions = [
    { label: 'Chiều vào', value: 'IN' },
    { label: 'Chiều ra', value: 'OUT' }
  ]

  const deviceTypeOptions = [
    { label: 'ACCESS CONTROL', value: 'ACCESS_CONTROL' },
    { label: 'ENROLL', value: 'ENROLL' },
    { label: 'BUS', value: 'BUS' }
  ]

  const fetchDataList1 = async () => {
    if (!idInfor) return

    // Check if idInfor is available before making the API call

    setLoading(true)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          keyword: '',
          page: 1,
          limit: 25
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/vf/ac-adapters/v1/devices?deviceGroupId=${idInfor}`,
        config
      )
      console.log(response.data.results, 'data')
      setDevice(response.data.results[0])

      // Process the data here, e.g., setDevice(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (idInfor) {
      fetchDataList1()
    }
  }, [idInfor]) // Add idInfor as a dependency

  console.log(idInfor, 'infor')

  return (
    <>
      <div>
        <Card>
          <CardHeader
            title='Thông tin thiết bị'
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            sx={{
              py: 4,
              flexDirection: ['column', 'row'],
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center']
            }}
            action={
              <Grid container spacing={2}>
                <Grid item>
                  <Box sx={{ float: 'right' }}>
                    <Button aria-label='Bộ lọc'>Hủy</Button>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ float: 'right', marginLeft: '2%' }}>
                    <Button aria-label='Bộ lọc' variant='contained'>
                      Lưu
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            }
          />
        </Card>
        <Grid style={{ margin: '0.3rem' }}></Grid>
        <Grid container spacing={0}>
          <Grid
            container
            item
            component={Paper}
            style={{ backgroundColor: 'white', width: '100%', padding: '10px', maxHeight: 600, paddingTop: '50px' }}
          >
            <Grid item xs={2.8}>
              <CustomTextField label='Tên' value={device ? device.name : ''} fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <Autocomplete
                getOptionLabel={option => option.label}
                renderInput={params => <CustomTextField {...params} label='Nhóm thiết bị' fullWidth />}

                // onFocus={handleComboboxFocus}

                // loading={loading}
              />{' '}
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='ID thiết bị ' value={device ? device.serialNumber : ''} fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8}>
              <Autocomplete
                options={deviceTypeOptions}
                getOptionLabel={option => option.label}
                value={deviceTypeOptions.find(option => option.value === (device ? device.deviceType : '')) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setDevice(prevDevice => ({ ...prevDevice, deviceType: newValue.value }))
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='loại thiết bị' fullWidth />}
              />{' '}
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField label='Nâng cấp phiên bản app' value={device ? device.firmware : ''} fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField label='Tên sản phẩm ' value={device ? device.model : ''} fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <Autocomplete
                options={directionOptions}
                getOptionLabel={option => option.label}
                value={directionOptions.find(option => option.value === (device ? device.direction : '')) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setDevice(prevDevice => ({ ...prevDevice, direction: newValue.value }))
                  }
                }}
                renderInput={params => <CustomTextField {...params} label='Chiều định danh' fullWidth />}
              />{' '}
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField
                placeholder='  Nhập loại Hardware Version...'
                disabled
                label='Hardware Version'
                fullWidth
              />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField placeholder='  Nhập loại năng lượng...' disabled label='Loại năng lượng' fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <Autocomplete
                getOptionLabel={option => option.label}
                renderInput={params => <CustomTextField {...params} label='Vị trí' fullWidth />}

                // onFocus={handleComboboxFocus}

                // loading={loading}
              />{' '}
            </Grid>
            <Grid item xs={0.1}></Grid>
            <Grid item xs={2.8} style={{ marginTop: 20 }}>
              <CustomTextField value={device ? device.description : ''} label='Ghi chú' fullWidth />
            </Grid>
            <Grid item xs={0.1}></Grid>
            <p style={{ fontSize: '0.8rem' }}>Khôi phục cài đặt thiết bị</p>
            <Grid item xs={2.8} style={{ marginTop: 39, display: 'inline-flex', marginLeft: '-145px' }}>
              <Grid>
                <Button fullWidth variant='contained'>
                  Toàn bộ
                </Button>
              </Grid>
              <Grid fullWidth style={{ marginLeft: '3%' }}>
                <Button variant='contained'>Khôi phục cài đặt mạng </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default InforAll
