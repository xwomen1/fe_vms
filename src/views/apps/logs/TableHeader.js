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
        <Grid style={{ fontSize: 30, color: 'black' }}>Log người dùng</Grid>
      </Box>
      
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button
          style={{ backgroundColor: '#A9A9A9', marginRight:50 }}
          onClick={exportValue}
          variant='contained'
          sx={{ '& svg': { mr: 1 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:filter' />
        </Button>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search '
          onChange={e => handleFilter(e.target.value)}
        />
      
        <hr></hr>
        
        <hr></hr>

      </Box>
    </Box>
  )
}

export default TableHeader
