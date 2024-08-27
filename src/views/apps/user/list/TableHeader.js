// src/views/apps/user/list/TableHeader.js
import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid } from '@mui/material'
import Link from 'next/link'
import axios from 'axios'
import FileSaver from 'file-saver'

const TableHeader = ({ handleFilter, exportValue, importValue, toggle, value, onFilterClick }) => {
  const downloadFileExample = () => {
    const url = `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/download/4fbaf1a2-0c56-40ad-bc52-f28fa48b8c71`

    axios
      .get(url, { responseType: 'blob' })
      .then(response => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        FileSaver.saveAs(blob, 'user.xlsx')
      })
      .catch(err => {
        console.error('Error downloading the file', err)
        showError(err)
      })
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
      <Box></Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* <Button
          style={{ backgroundColor: '#A9A9A9' }}
          onClick={exportValue}
          variant='contained'
          sx={{ '& svg': { mr: 1 } }}
        >
          <Icon fontSize='1.125rem' icon='tabler:file-export' />
        </Button> */}
        <Button variant='contained' sx={{ '& svg': { mr: 1 }, mr: 1 }}>
          <a style={{ 'font-weight': 'initial', 'margin-left': 10 }} onClick={downloadFileExample}>
            Download sample file
          </a>{' '}
        </Button>
        <hr />
        <Button onClick={importValue} variant='contained' sx={{ '& svg': { mr: 1 }, mr: 1 }}>
          <Icon fontSize='1.125rem' icon='tabler:file-upload' /> Import
        </Button>
        <hr />
        <Button component={Link} href={`/apps/user/add`} variant='contained' sx={{ '& svg': { mr: 2 }, mr: 1 }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add
        </Button>

        {/* <Button
          variant='contained'
          onClick={onFilterClick} // Gọi hàm lọc từ UserList
          sx={{ '& svg': { mr: 1 }, mr: 1 }}
        >
          <Icon fontSize='1.125rem' icon='tabler:filter' />
          Filter
        </Button> */}

        <CustomTextField
          value={value}
          sx={{ mr: 1 }} // Thay đổi khoảng cách ở đây
          placeholder='Search User'
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default TableHeader
