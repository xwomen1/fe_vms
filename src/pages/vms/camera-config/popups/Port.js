import CustomTextField from 'src/@core/components/mui/text-field'
import { Button, DialogActions, Grid } from '@mui/material'

const UserDetails = nvrs => {
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={5.8}>
            <CustomTextField label='HTTP Port' value={nvrs.nvrs.http} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='RTSP Port' value={nvrs.nvrs.rtsp} fullWidth />
          </Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='HTTPS Port' value={nvrs.nvrs.https} fullWidth />
          </Grid>
          <Grid item xs={0.4}></Grid>
          <Grid item xs={5.8}>
            <CustomTextField label='Server Port' value={nvrs.nvrs.server} fullWidth />
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
            <Button type='submit' variant='contained'>
              Lưu
            </Button>
            <Button variant='tonal'>Mặc định</Button>
            <Button variant='tonal' color='secondary'>
              Hủy
            </Button>
          </DialogActions>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default UserDetails
