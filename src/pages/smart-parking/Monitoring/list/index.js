import { useState } from 'react'
import { Grid, Card, CardContent, Button, Typography, IconButton, Box } from '@mui/material'
import Icon from 'src/@core/components/icon'

const Monitoring = () => {
  // State để theo dõi trạng thái làn xe
  const [isEntering, setIsEntering] = useState(true) // true nếu làn xe vào, false nếu làn xe ra

  const toggleLane = () => {
    setIsEntering(prev => !prev)
  }

  return (
    <Grid container spacing={3} padding={0}>
      {/* Card 1: Làn xe */}
      <Grid item xs={2}>
        <Card>
          <CardContent>
            <Button variant='contained' color={isEntering ? 'success' : 'error'} fullWidth onClick={toggleLane}>
              {isEntering ? 'Làn xe vào' : 'Làn xe ra'}
            </Button>
            <CameraBox title='Cam toàn cảnh' />
            <CameraBox title='Cam biển số' />
            <Typography variant='h6'>Các lượt {isEntering ? 'vào' : 'ra'} gần đây</Typography>
            <Cameramini />
            <Cameramini />
            <Cameramini />
            <Button sx={{ marginTop: '10px' }} variant='contained' color='primary' fullWidth>
              Mở Barrier
            </Button>
            <Button variant='contained' color='secondary' fullWidth>
              Đóng Barrier
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 2: Thông tin xe */}
      <Grid item xs={8}>
        <Card>
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={3}>
              {/* Left Section */}
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ position: 'relative' }}>
                    <MaskGroupSVG
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 200,
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Typography variant='h6'>Thông tin xe</Typography>
                    <Typography color={isEntering ? 'green' : 'red'} variant='subtitle1'>
                      {isEntering ? 'Được phép qua' : 'Không được phép qua'}
                    </Typography>
                    <Typography>Giờ {isEntering ? 'vào' : 'ra'}: </Typography>
                    <Typography>Loại vé: </Typography>
                    <Typography variant='h5' fontWeight='bold'>
                      Mã vé: 34P3 58 59
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}></Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Section */}
              <Grid item xs={6}>
                <Card>
                  <CardContent sx={{ position: 'relative' }}>
                    <MaskGroupSVG
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 200,
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <Typography variant='h6'>Thông tin xe</Typography>
                    <Typography color={isEntering ? 'red' : 'green'} variant='subtitle1'>
                      {isEntering ? 'Không được phép qua' : 'Được phép qua'}
                    </Typography>
                    <Typography>Giờ {isEntering ? 'ra' : 'vào'}: </Typography>
                    <Typography>Loại vé: </Typography>
                    <Typography variant='h5' fontWeight='bold'>
                      Mã vé: 30P3 58 60
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}></Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <CardContent>
            <Grid container spacing={3} justifyContent='center'>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={6} key={index}>
                  <Box
                    sx={{
                      height: '300px',
                      border: '1px solid #ccc',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant='body2'>Khung Ảnh/Video {index + 1}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 3: Làn xe ra */}
      <Grid item xs={2}>
        <Card>
          <CardContent>
            <Button variant='contained' color={isEntering ? 'error' : 'success'} fullWidth onClick={toggleLane}>
              {isEntering ? 'Làn xe ra' : 'Làn xe vào'}
            </Button>
            <CameraBox title='Cam toàn cảnh' />
            <CameraBox title='Cam biển số' />
            <Typography variant='h6'>Các lượt {isEntering ? 'vào' : 'ra'} gần đây</Typography>
            <Cameramini />
            <Cameramini />
            <Cameramini />
            <Button variant='contained' sx={{ marginTop: '10px' }} color='primary' fullWidth>
              Mở Barrier
            </Button>
            <Button variant='contained' color='secondary' fullWidth>
              Đóng Barrier
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

// Component cho khung camera
const CameraBox = ({ title }) => (
  <Box
    sx={{
      height: '150px',
      border: '1px solid #ccc',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10px'
    }}
  >
    <Typography variant='h6'>{title}</Typography>
    <IconButton>
      <Icon icon='mdi:play' />
    </IconButton>
  </Box>
)

// Cập nhật Cameramini
const Cameramini = () => (
  <Box
    sx={{
      height: '100px',
      width: '70%',
      border: '1px solid #ccc',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10px',
      marginLeft: 'auto', // Căn giữa
      marginRight: 'auto' // Căn giữa
    }}
  >
    <IconButton>
      <Icon icon='mdi:play' />
    </IconButton>
  </Box>
)

// Component cho MaskGroup
const MaskGroupSVG = props => (
  <svg width='100' height='100' viewBox='0 0 193 173' fill='none' {...props}>
    <g clipPath='url(#clip0)'>
      <path
        d='M176.833 147.216C154.238 134.408 126.747 128.909 123.96 120.697C121.173 112.485 120.571 104.423 123.132 98.3208C125.692 92.2183 128.705 92.9717 130.211 86.1911C130.211 86.1911 133.977 86.9445 136.99 82.4242C140.003 77.9038 140.756 70.3698 140.756 66.6029C140.756 62.8359 135.484 60.5757 135.484 60.5757C135.484 60.5757 140.756 46.2612 137.743 31.9467C134.73 17.6322 124.939 -0.449244 92.553 1.05755V1.28356C66.1168 2.71501 57.6813 18.9883 54.8945 32.1727C51.8819 46.4872 57.1541 60.8017 57.1541 60.8017C57.1541 60.8017 51.8819 63.0619 51.8819 66.8289C51.8819 70.5959 52.635 78.1298 55.6477 82.6502C58.6604 87.1705 62.4262 86.4171 62.4262 86.4171C63.9326 93.1977 66.9453 92.4443 69.506 98.5468C72.0668 104.649 71.4643 112.786 68.6775 120.923C65.8908 129.059 38.4001 134.634 15.8051 147.442C-6.79001 160.25 -4.5305 173.058 -4.5305 173.058L197.319 172.907C197.168 172.831 199.428 160.024 176.833 147.216Z'
        fill='#797979'
      />
    </g>
    <defs>
      <clipPath id='clip0'>
        <rect width='202' height='172' fill='white' transform='translate(-4.75635 0.982422)' />
      </clipPath>
    </defs>
  </svg>
)

export default Monitoring
