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
import AddImageGuest from '../popups/addImageGuest'
import CardDetai from '../popups/CardDetail'
import Barcode from 'react-barcode'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { QRCode } from 'react-qr-code'

const Details = () => {
  const [reload, setReload] = useState(0)
  const router = useRouter()
  const id = router.query.Details
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem(authConfig.storageTokenKeyName)
  const [isOpenAddImage, setIsOpenAddImage] = useState(false)
  const [idImage, setImage] = useState({})
  const [isOpenCard, setIsOpenCard] = useState(false)
  const [idCard, setCard] = useState({})

  useEffect(() => {
    if (id) {
      fetchDataList()
    }
  }, [id, reload])

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

  const statusColorMap = {
    WAITING: 'default',
    APPROVED: 'success',
    COMPLETE: 'success',
    UNSUCCESSFUL: 'error',
    CANCELLED: 'warning',
    REMOVE: 'info'
  }
  const chipColor = loading ? 'default' : data ? statusColorMap[data.status] || 'default' : 'default'

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
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ float: 'left' }}>
                  <Box>
                    <Button sx={{ margin: '0 5px' }} variant='contained' component={Link} href={`/pages/scheduling`}>
                      Cancel
                    </Button>
                    <Button
                      component={Link}
                      href={`/pages/scheduling/register/${data.id}`}
                      sx={{ margin: '0 5px' }}
                      aria-label='Bộ lọc'
                      variant='contained'
                    >
                      Re register
                    </Button>

                    {data?.status === 'APPROVED' && (
                      <Button sx={{ margin: '0 5px' }} aria-label='Bộ lọc' variant='contained'>
                        Unsubscribe
                      </Button>
                    )}
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
              <CustomChip label={data?.status || 'Unknown'} skin='light' color={chipColor} />
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              {data?.code ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <QRCode value={data?.code} size={100} fgColor='#000000' />
                    <div style={{ margin: '0 40px', fontSize: '20px', fontFamily: 'monospace' }}>{data?.code}</div>
                  </div>
                  <div style={{ marginRight: '16px', textAlign: 'center' }}>
                    <Barcode value={data?.code} size={100} lineColor='#000000' />
                  </div>
                </div>
              ) : (
                <div>loading Code...</div>
              )}
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
                    {data.guests?.map(
                      (guests, index) => (
                        console.log(guests.documentFileId, 'log'),
                        (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {' '}
                              {guests.documentFileId && (
                                <div style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                                  {' '}
                                  <img
                                    alt='document-file'
                                    src={`https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/public/download/${guests.documentFileId}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{guests.accessCode}</TableCell>
                            <TableCell>{guests.identityNumber}</TableCell>
                            <TableCell>{guests.fullName}</TableCell>
                            <TableCell>{guests.phoneNumber}</TableCell>
                            <TableCell>{guests.address}</TableCell>
                            <TableCell>{guests.status}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  setIsOpenAddImage(true)
                                  setImage(guests.guestId)
                                }}
                              >
                                <Icon icon='tabler:polaroid' />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  setIsOpenCard(true)
                                  setCard(guests.guestId)
                                }}
                              >
                                <Icon icon='tabler:credit-card' />
                              </IconButton>
                              <IconButton
                                component={Link}
                                href={`/pages/scheduling/detailGuest/${guests.guestId}`}
                                sx={{ margin: '0 5px' }}
                                aria-label='Bộ lọc'
                                variant='contained'
                              >
                                <Icon icon='tabler:info-circle' />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      )
                    )}
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
      {isOpenAddImage && (
        <AddImageGuest
          show={isOpenAddImage}
          onClose={() => setIsOpenAddImage(false)}
          callback={idImage}
          setReload={() => setReload(reload + 1)}
        />
      )}
      {isOpenCard && (
        <CardDetai
          show={isOpenCard}
          onClose={() => setIsOpenCard(false)}
          callback={idCard}
          setReload={() => setReload(reload + 1)}
        />
      )}
    </>
  )
}

export default Details
