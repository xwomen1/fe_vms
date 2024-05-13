import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, CircularProgress, DialogActions, Grid } from '@mui/material'
import { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import authConfig from 'src/configs/auth'

const UserDetails = ({ cameras, onClose }) => {
  console.log(cameras)
  const [http, setHttp] = useState(cameras?.http)
  const [rtsp, SetRtsp] = useState(cameras?.rtsp)
  const [https, setHttps] = useState(cameras?.https)
  const [server, setServer] = useState(cameras?.server)
  const [loading, setLoading] = useState(false)

  const handleHttpChange = event => {
    setHttp(event.target.value)
  }

  const handleRtspChange = event => {
    SetRtsp(event.target.value)
  }

  const handleHttpsChange = event => {
    setHttps(event.target.value)
  }

  const handleServerhange = event => {
    setServer(event.target.value)
  }

  const handleSaveClick = async () => {
    handleSave() // Gọi hàm handleSave truyền từ props
  }

  const handleSave = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const data = {
        http: http || cameras?.http,
        rtsp: rtsp || cameras?.rtsp,
        https: https || cameras?.https,
        server: server || cameras?.server
      }

      await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/cameras/config/networkconfig/{idNetWorkConfig}?idNetWorkConfig=${cameras.id}&NetWorkConfigType=tcpip`,
        data,
        config
      )
      setLoading(false)
      Swal.fire('Lưu thành công!', '', 'success')

      onClose()
    } catch (error) {
      console.error(error)
      setLoading(false)
      onClose()

      Swal.fire('Đã xảy ra lỗi', error.message, error.response?.data?.message)
      console.log(error.response?.data?.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {loading && <CircularProgress />}

      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <CustomTextField label='HTTP Port' value={http} onChange={handleHttpChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='RTSP Port' value={rtsp} onChange={handleRtspChange} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='HTTPS Port' value={https} onChange={handleHttpsChange} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Server Port' value={server} onChange={handleServerhange} fullWidth />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button type='submit' variant='contained' onClick={handleSaveClick}>
              Lưu
            </Button>
            <Button onClick={onClose}>Đóng</Button>
          </DialogActions>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default UserDetails
