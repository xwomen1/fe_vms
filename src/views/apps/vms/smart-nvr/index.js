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
        justifyContent: 'center' // Center the buttons horizontally
      }}
    ></Box>
  )
}

export default TableHeader
