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
  const { passwords, videos, images, networks } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '1 0 auto', marginRight: '8px' }}
        onClick={passwords}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1.125rem' icon='tabler:key' /> Mật khẩu
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '1 0 auto', marginRight: '8px' }}
        onClick={networks}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1.125rem' icon='tabler:network' /> Mạng
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '1 0 auto', marginRight: '8px' }}
        onClick={videos}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1.125rem' icon='tabler:video' /> Video
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '1 0 auto' }}
        onClick={images}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1.125rem' icon='tabler:camera' /> Hình ảnh
      </Button>
    </Box>
  )
}

export default TableHeader
