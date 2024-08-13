// src/views/apps/user/list/TableHeader.js
import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid } from '@mui/material'
import Link from 'next/link'

const TableHeader = ({ handleFilter, exportValue, importValue, toggle, value, onFilterClick }) => {
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
      <Box></Box>
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
        <hr />
        <Button
          style={{ backgroundColor: '#A9A9A9' }}
          onClick={importValue}
          variant='contained'
          sx={{ '& svg': { mr: 1 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:file-upload' />
        </Button>
        <hr />
        <Button component={Link} href={`/apps/user/add`} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add
        </Button>
        <Button
          variant='contained'
          onClick={onFilterClick} // Gọi hàm lọc từ UserList
          sx={{ '& svg': { mr: 1 }, backgroundColor: '#A9A9A9' }}
        >
          <Icon fontSize='1.125rem' icon='tabler:filter' />
          Filter
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
