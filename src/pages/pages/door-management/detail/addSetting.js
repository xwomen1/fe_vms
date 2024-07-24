import React, { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

const AddDoorSetting = () => {
  return (
    <>
      <Card>
        <CardHeader
          title='Cấu hình cửa'
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <Button variant='contained' component={Link} href={`/pages/door-management/list`}>
                    Hủy
                  </Button>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ float: 'right', marginLeft: '2%' }}>
                  <Button aria-label='Bộ lọc' variant='contained'>
                    Lưu
                  </Button>
                </Box>
              </Grid>
            </Grid>
          }
        />
        <Grid style={{ margin: '0.3rem' }}></Grid>
      </Card>
    </>
  )
}

export default AddDoorSetting
