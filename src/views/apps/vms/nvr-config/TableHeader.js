import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import Link from 'next/link'

const TableHeader = props => {
  // ** Props
  const { passwords, videos, images, networks, cloud } = props

  return (
    <Box
      sx={{
        py: 5,
        px: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center the buttons horizontally
      }}
    >
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '0 0 auto', margin: '0 4px' }} // Adjusted button size and spacing
        onClick={passwords}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1rem' icon='tabler:key' /> Mật khẩu
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '0 0 auto', margin: '0 4px' }} // Adjusted button size and spacing
        onClick={networks}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1rem' icon='tabler:network' /> Mạng
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '0 0 auto', margin: '0 4px' }} // Adjusted button size and spacing
        onClick={videos}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1rem' icon='tabler:video' /> Video
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '0 0 auto', margin: '0 4px' }} // Adjusted button size and spacing
        onClick={images}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1rem' icon='tabler:camera' /> Hình ảnh
      </Button>
      <Button
        style={{ backgroundColor: '#A9A9A9', flex: '0 0 auto', margin: '0 4px' }} // Adjusted button size and spacing
        onClick={cloud}
        variant='contained'
        sx={{ '& svg': { mr: 1 } }}
      >
        <Icon fontSize='1rem' icon='tabler:cloud' /> Bộ nhớ
      </Button>
    </Box>
  )
}

export default TableHeader
