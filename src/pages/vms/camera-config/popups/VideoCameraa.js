import { FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'

const VideoCamera = ({}) => {
  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Camera</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Stream type</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Video type</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Resolution</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Bitrate type</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Video Quality</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Frame Rate</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>Video Encoding</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={3.8}>
            <FormControl fullWidth>
              <InputLabel id='time-validity-label'>H.264+</InputLabel>
              <Select labelId='time-validity-label' id='time-validity-select'>
                <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
                <MenuItem value='Undefined'>Không xác định</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <CustomTextField label='Max Bitrate' type='text' fullWidth />
          </Grid>
        </Grid>
      </Grid>
      <br />
    </div>
  )
}

export default VideoCamera
