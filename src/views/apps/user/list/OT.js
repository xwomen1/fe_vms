// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

const TableHeader = props => {
  // ** Props
  const { handleFilter, exportValue, importValue, value, toggle } = props
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

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
        <Grid style={{ fontSize: 30, color: 'black' }}>OT- Work Travel</Grid>
      </Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button variant='contained' sx={{ '& svg': { mr: 2 } }} component={Link} href={`/salaryRule`}>
          <Icon fontSize='1.125rem' icon='tabler:notebook' />
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
