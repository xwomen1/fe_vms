import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Switch } from '@mui/material'

const ImageCamera = ({}) => {
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <img height='200' alt='error-illustration' src='/images/avatars/1.png' />
        </Grid>
        <Grid item xs={6}>
          <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid>Camera Name</Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Camera Name</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid item xs={12}>
              Display Name
              <Switch color='primary' />
            </Grid>
            <Grid item xs={12}>
              Display Date
              <Switch color='primary' />
            </Grid>
            <Grid item xs={12}>
              Display Week
              <Switch color='primary' />
            </Grid>
          </Grid>
          <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid>Date format</Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Date format</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid>Time format</Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Time format</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid>Display Mode</Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='time-validity-label'>Display Mode</InputLabel>
                <Select labelId='time-validity-label' id='time-validity-select'>
                  <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                  <MenuItem value='Undefined'>Không xác định</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default ImageCamera
