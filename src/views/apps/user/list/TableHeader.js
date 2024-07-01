// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import Link from 'next/link'

const TableHeader = props => {
  // ** Props
  const { handleFilter, exportValue, importValue, toggle, value } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Grid style={{ fontSize: 30, color: 'black' }}></Grid>
      </Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button
          style={{ backgroundColor: '#A9A9A9' }}
          onClick={exportValue}
          variant='contained'
          sx={{ '& svg': { mr: 1 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:file-export' />
        </Button>
        <hr></hr>
        <Button
          style={{ backgroundColor: '#A9A9A9' }}
          onClick={importValue}
          variant='contained'
          sx={{ '& svg': { mr: 1 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:file-upload' />
        </Button>
        <hr></hr>

        <Button component={Link} href={`/apps/user/add`} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Thêm mới
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
