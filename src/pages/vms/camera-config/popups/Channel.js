import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import { FormControl, InputLabel, Select } from '@mui/material'
import axios from 'axios'

const UserList = ({ apiData }) => {
  const createData = (name, ch1, ch2) => {
    return { name, ch1, ch2 }
  }

  const assetTypes = [
    createData('Frozen Encoding Paramenter	    ', 'Main Stream(Continuous)    ', 'Main Stream(Event)    '),
    createData(
      'Stream Type	    ',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Video & Audio</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Video & Audio</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    ),
    createData(
      'Resolution',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>1920'1090(1080P)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>1920'1080(1080P)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    ),
    createData(
      'Bitrate Type',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Constant</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>Constant</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    ),
    createData(
      'Max. Bitrate Range Reacommender',
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>3840~6400(kbps)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>,
      <FormControl fullWidth>
        <InputLabel id='time-validity-label'>3840~6400(kbps)</InputLabel>
        <Select labelId='time-validity-label' id='time-validity-select'>
          <MenuItem value='Custom'>Tuỳ chỉnh</MenuItem>
          <MenuItem value='Undefined'>Không xác định</MenuItem>
        </Select>
      </FormControl>
    )
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <Grid container spacing={2}>
            <Grid item xs={0.1}></Grid>

            <Grid item xs={12}>
              <div></div>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>Name</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Configuration 1</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Configuration 2</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assetTypes.map((assetType, index) => (
                    <TableRow key={assetType.id}>
                      <TableCell sx={{ padding: '16px' }}>{assetType.name}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.ch1}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{assetType.ch2}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Card>
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
