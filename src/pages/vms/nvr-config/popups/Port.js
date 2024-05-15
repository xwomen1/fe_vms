import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, CircularProgress, DialogActions, Grid } from '@mui/material'
import { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { makeStyles } from '@material-ui/core/styles'

const UserDetails = ({ nvr, onClose }) => {
  console.log(nvr)
  const [http, setHttp] = useState(nvr?.http)
  const [rtsp, SetRtsp] = useState(nvr?.rtsp)
  const [https, setHttps] = useState(nvr?.https)
  const [server, setServer] = useState(nvr?.server)
  const [loading, setLoading] = useState(false)
  const classes = useStyles()

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
        http: http || nvr?.http,
        rtsp: rtsp || nvr?.rtsp,
        https: https || nvr?.https,
        server: server || nvr?.server
      }

      await axios.put(
        `https://sbs.basesystem.one/ivis/vms/api/v0/nvrs/config/networkconfig/{idNetWorkConfig}?idNetWorkConfig=${nvr.id}&NetWorkConfigType=port`,
        data,
        config
      )
      console.log(nvr)
      setLoading(false)
      Swal.fire('Lưu thành công!', '', 'success')

      onClose()
    } catch (error) {
      console.error(error)
      setLoading(false)
      onClose()

      Swal.fire('Đã xảy ra lỗi', error.message, error.response?.data?.message)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <div style={{ width: '100%' }} className={classes.loadingContainer}>
      {loading && <CircularProgress className={classes.circularProgress} />}

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
            <Button onClick={onClose}>Đóng</Button>

            <Button type='submit' variant='contained' onClick={handleSaveClick}>
              Lưu
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px', // Đặt độ cao tùy ý
    zIndex: 0
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999 // Đặt z-index cao hơn so với Grid container
  }
}))

export default UserDetails
