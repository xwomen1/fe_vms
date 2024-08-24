import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import {
  Box,
  Button,
  Card,
  IconButton,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper
} from '@mui/material'
import Barcode from 'react-barcode'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'

const Details = () => {
  const router = useRouter()
  const id = router.query.Details
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)

  useEffect(() => {
    if (id) {
      fetchDataList()
    }
  }, [id])

  const fetchDataList = async () => {
    if (!id) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/access-control/api/v0/registrations/${id}`,
        config
      )
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  const hours = Math.floor(data?.waitTimeBeforeCancelInMinute / 60)
  const minutes = data?.waitTimeBeforeCancelInMinute % 60
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

  return (
    <>
      <div>
        <Card>
          <CardHeader
            title='Information'
            titleTypographyProps={{ sx: { mb: [2, 0] } }}
            sx={{
              py: 4,
              flexDirection: ['column', 'row'],
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center']
            }}
            action={
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ float: 'right' }}>
                    <Button variant='contained' component={Link} href={`/pages/scheduling`}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Box sx={{ float: 'right', marginLeft: '2%' }}>
                    <Button aria-label='Bộ lọc' variant='contained'>
                      Re register
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            }
          />
        </Card>
        <Grid style={{ margin: '0.3rem' }}></Grid>
        <Grid container spacing={0}>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <p>
                Last Updated Time : {formattedTime} - {data?.startDate}
              </p>
              <p>{data?.status}</p>
            </Grid>
            <Grid item xs={7}></Grid>
            <Grid item xs={2}>
              {data?.code && <Barcode value={data.code} />}
            </Grid>
          </Grid>
          <Grid
            style={{
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
              width: '100%',
              marginTop: '2%',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          ></Grid>
          <Grid container spacing={0} style={{ marginTop: '2%' }}>
            <Grid item xs={2.8}>
              <CustomTextField label='Request Type' value={data ? data?.repeatType : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Start Date' value={data ? data?.startDate : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Start Time' value={data ? data?.startTimeInMinute : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='End Time' value={data ? data?.endTimeInMinute : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Work Area' value={data ? data?.areaId : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Arrival Unit' value={data ? data?.groupId : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Department/Division' value={data ? data?.groupId : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Purpose' value={data ? data?.note : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Registrant' value={data ? data?.approvers?.username : ''} disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <CustomTextField label='Reference Document' disabled fullWidth />
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={2.8}>
              <Button variant='contained' sx={{ marginTop: '25px' }}>
                DOWNLOAD FILE
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                width: '100%',
                marginTop: '2%',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            ></Grid>
            <Grid item xs={12}>
              Registered Guest List ({data?.guests?.length || 0})
              <TableContainer component={Paper} sx={{ marginTop: '2%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>.No</TableCell>
                      <TableCell>document image</TableCell>
                      <TableCell>user ID</TableCell>
                      <TableCell>Documents</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Company Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Card Number</TableCell>
                      <TableCell>Card Issuance Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.guests?.map((guests, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{guests.accessCode}</TableCell>
                        <TableCell>{guests.identityNumber}</TableCell>
                        <TableCell>{guests.fullName}</TableCell>
                        <TableCell>{guests.phoneNumber}</TableCell>
                        <TableCell>{guests.address}</TableCell>
                        <TableCell>{guests.status}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <IconButton>
                            <Icon icon='tabler:polaroid' />
                          </IconButton>
                          <IconButton>
                            <Icon icon='tabler:credit-card' />
                          </IconButton>
                          <IconButton>
                            <Icon icon='tabler:info-circle' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                width: '100%',
                marginTop: '2%',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            ></Grid>
            <Grid item xs={12}>
              Vehicle Information ({data?.vehicles?.length || 0})
              <TableContainer component={Paper} sx={{ marginTop: '2%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>.No</TableCell>
                      <TableCell>Vehicle Name</TableCell>
                      <TableCell>License Plate</TableCell>
                      <TableCell>Driver's Name</TableCell>
                      <TableCell>Device ID</TableCell>
                      <TableCell>Device Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.vehicles?.map((vehicles, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{vehicles.vehicleName}</TableCell>
                        <TableCell>{vehicles.numberPlate}</TableCell>
                        <TableCell>{vehicles.guestInfo?.name}</TableCell>
                        <TableCell>{vehicles.vehicleRegistrationStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                width: '100%',
                marginTop: '2%',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
              }}
            ></Grid>
            <Grid item xs={12}>
              Approver Information ({data?.approvers?.length || 0})
              <TableContainer component={Paper} sx={{ marginTop: '2%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>.No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Approval Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.approvers?.map((approvers, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{approvers.fullName}</TableCell>
                        <TableCell>{approvers.username}</TableCell>
                        <TableCell>{approvers.positionName}</TableCell>
                        <TableCell>{approvers.groupName}</TableCell>
                        <TableCell>{approvers.approvalStatus}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Details
