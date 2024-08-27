import { useState } from 'react'

import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

import { FormControl, IconButton, InputLabel, Paper, Select } from '@mui/material'
import Swal from 'sweetalert2'
import axios from 'axios'

import Daily from 'src/pages/pages/access-rights/mocdata/daily'

const dataDailyDefault = [
  {
    label: '',
    value: 1
  },
  {
    label: 'Thứ 2',
    dayOfWeek: 'MONDAY',
    value: 2
  },
  {
    label: 'Thứ 3',
    dayOfWeek: 'TUESDAY',
    value: 3
  },
  {
    label: 'Thứ 4',
    dayOfWeek: 'WEDNESDAY',
    value: 4
  },
  {
    label: 'Thứ 5',
    dayOfWeek: 'THURSDAY',
    value: 5
  },
  {
    label: 'Thứ 6',
    dayOfWeek: 'FRIDAY',
    value: 6
  },
  {
    label: 'Thứ 7',
    dayOfWeek: 'SATURDAY',
    value: 7
  },
  {
    label: 'CN',
    dayOfWeek: 'SUNDAY',
    value: 8
  }
]

const UserList = ({ apiData }) => {
  const [dataDaily, setDataDaily] = useState([])
  const [dataDailyState, setDataDailyState] = useState(dataDailyDefault)

  return (
    <Grid container spacing={2} style={{ minWidth: 500 }}>
      <Grid container item style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
        <Grid item xs={5.8}>
          <FormControl fullWidth>
            <InputLabel id='time-validity-label'>Camera</InputLabel>
            <Select labelId='time-validity-label' id='time-validity-select'>
              <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
              <MenuItem value='Undefined'>Không xác định</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={0.4}></Grid>
        <Grid item xs={5.8}>
          <FormControl fullWidth>
            <InputLabel id='time-validity-label'>Channel</InputLabel>
            <Select labelId='time-validity-label' id='time-validity-select'>
              <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
              <MenuItem value='Undefined'>Không xác định</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid>Time configuration table</Grid>
        <Daily
          callbackOfDaily={v => {
            setDataDaily(v)
            setDataDailyState(v)
          }}
          dataDailyProps={dataDailyState}
        />
      </Grid>
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
