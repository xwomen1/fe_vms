import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid } from '@mui/material'

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
      </Grid>
      <br />
    </div>
  )
}

export default UserDetails
