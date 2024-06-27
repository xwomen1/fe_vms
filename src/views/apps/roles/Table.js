import React, { useEffect, useState, useCallback } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import authConfig from 'src/configs/auth'
import axios from 'axios'
import toast from 'react-hot-toast'

const UserList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Tạo mới tài nguyên'
            action={
              <Grid container spacing={2}>
                <Grid item>
                  <Box sx={{ float: 'right' }}>
                    <Button variant='contained'>Hủy</Button>
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
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            sx={{
              py: 4,
              flexDirection: ['column', 'row'],
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center']
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
