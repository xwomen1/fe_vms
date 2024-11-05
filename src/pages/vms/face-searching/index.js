  import React, { useEffect, useState } from 'react';
  import { Grid, Paper, IconButton, TextField, Autocomplete, Button, Typography, CardContent, Card, Box, CircularProgress } from '@mui/material';
  import ImageForm from './popup/image-popup'; // Import ImageForm
  import Icon from 'src/@core/components/icon';
  import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, TimelineOppositeContent } from '@mui/lab';
  import authConfig from 'src/configs/auth'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  loadingContainer: {
    position: 'relative',
    minHeight: '100px',
    zIndex: 0,
  },
  circularProgress: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 99999,
  },
}));


  const EventList = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [savedImage, setSavedImage] = useState(null); // State to hold the saved image
    const [numberInput, setNumberInput] = useState(''); // State for number input
    const [selectedCamera, setSelectedCamera] = useState(null); // State for selected camera
    const [results, setResults] = useState([]); // State for search results
    const [cameras, setCameras] = useState([]); // State for search results
    const [fakeData, setfakeData] = useState([]); // State for search results
    const [loading, setLoading] = useState(false); // Loading state
    const classes = useStyles()

    const handleSearchClick1 = () => {
      setOpenPopup(true);
    };

    const closePopup = () => {
      setOpenPopup(false);
    };

    const Img = React.memo(props => {
      const [loaded, setLoaded] = useState(false)
  
      const { src } = props
  
      return (
        <>
          <div
            style={
              loaded
                ? { display: 'none' }
                : {
                    width: '100px',
                    height: '100px',
                    display: 'grid',
                    backgroundColor: '#C4C4C4',
                    placeItems: 'center'
                  }
            }
          >
            <CircularProgress size={20} />
          </div>
          <img
            {...props}
            src={src}
            alt='Image'
            onLoad={() => setLoaded(true)}
            style={loaded ? { width: '100px', height: '100px' } : { display: 'none' }}
          />
        </>
      )
    })

    const handleSearchClick = async () => {
      if ( !savedImage) {
        console.error("Camera or images not selected");
        
        return;
      }
  
      const cameraID = selectedCamera?.id || null; // Assuming selectedCamera has an id property
      const endtime = Date.now(); // Set your end time
      const starttime = endtime - 60 * 60 * 1000; // Example: 1 hour before end time
      setLoading(true);

      const images = savedImage.map(image => ({
        base64: image.base64 || null, // Ensure you have base64 data in savedImage
        id: image.id,
        name: image.name,
        url: image.url || null// Ensure you have URL in savedImage
      }));
  
      const requestData = {
        cameraID,
        images,
        similarity: 0.6
      };
      console.log(requestData, 'payload')
      try {
        const response = await axios.post('https://votv.ivms.vn/votv/vms/api/v0/ai-events/search-face', requestData);
        setResults(response.data); // Assuming you want to store results in state
        console.log('Search results:', response.data);
        setLoading(false); 

        setfakeData(response.data)
      } catch (error) {
        setLoading(false); 

        console.error('Error calling API:', error);
      }
    };
  
    const handleImageSave = (imageDataArray) => {
      setSavedImage(imageDataArray); // Save the array of images
      console.log('Saved Images:', imageDataArray); // Handle the saved images as needed
    
      // Log the id and name of each image
      imageDataArray.forEach(image => {
        console.log('Image ID:', image.id);
        console.log('Image Name:', image.name);
      });
    };

    const buildUrlWithToken = url => {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      return `${url}?token=${token}`
    }

    useEffect(() => {
      const fetchFilteredOrAllUsers = async () => {
        try {
          const token = localStorage.getItem(authConfig.storageTokenKeyName)
    
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            },
          
          }
          const response = await axios.get('https://sbs.basesystem.one/ivis/vms/api/v0/cameras', config)
          setCameras(response.data)
        } catch (error) {
          console.error('Error fetching users:', error)
        }
      }
      fetchFilteredOrAllUsers()
    }, [])
    
return (
      <>
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={0.5}>
              <IconButton onClick={handleSearchClick1}>
                <Icon icon='tabler:upload' /> 
              </IconButton>
            </Grid>
          <Grid item xs={2}>
            <TextField
              label="Similarity"
              variant="outlined"
              value= '0.6'
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <Autocomplete
              options={cameras}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setSelectedCamera(newValue)}
              renderInput={(params) => <TextField {...params} label="Select camera" variant="outlined" />}
              fullWidth
            />
          </Grid>
          <Grid item xs={0.5}>
          <Button variant='contained' color='primary' onClick={handleSearchClick}>
              Search
            </Button>  
        </Grid>
            </Grid>
         
        </Paper>

        {openPopup && (
          <ImageForm
            onClose={closePopup}
            onSave={handleImageSave} // Pass the handler to ImageForm
          />
        )}

  
      <Grid container spacing={2} style={{ marginTop: '32px' }}>
        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
              {savedImage && (
                  <div>
                      {savedImage.map((image, index) => {
      console.log('Image ID:', image.id); // Log ra image.id
      
        return (
          <Img
          key={index} 
          src={buildUrlWithToken(
            `https://dev-ivi.basesystem.one/smc/storage/api/v0/libraries/download/${image.id}`
          )}
          style={{ maxWidth: '91px', height: '100%', minWidth: '100%' }}
        />
            );
          })}
                  </div>
                )}

              </Grid>
              <Grid item xs={8}>
              <div className={classes.loadingContainer}>
              {loading && <CircularProgress className={classes.circularProgress} />}
                <Grid item xs={12}>
                  <Typography variant="h5">Timeline </Typography>
                  <Timeline
                    sx={{
                      [`& .MuiTimelineOppositeContent-root`]: {
                        flex: 0.2,
                      },
                    }}
                  >
                    {fakeData.map(event => (
                      <TimelineItem key={event.id}>
                        <TimelineOppositeContent color="textSecondary">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                        <Typography
                        variant="body2"
                        sx={{
                          wordWrap: 'break-word',
                          overflow: 'hidden',
                          whiteSpace: 'pre-wrap', // tự động ngắt dòng
                          maxHeight: '4.8em', // Giới hạn chiều cao để hiển thị tối đa 3 dòng
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {event.location}
                      </Typography>                          
                      <Typography sx={{ marginTop: '10px' }}>
                            {event?.timestamp ? new Date(event?.timestamp).toLocaleString() : 'Date'}
                          </Typography>
                          <Typography variant="p">{event.description}</Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Grid>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={classes.loadingContainer}>
          {loading && <CircularProgress className={classes.circularProgress} />}
          <Paper elevation={3} style={{ padding: '16px', flex: 1 }}>
            <h2>Image</h2>
            <CardContent>
              {fakeData?.length === 0 ? (
                <Typography variant='h6' align='center'>
                  No data available
                </Typography>
              ) : (
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  {fakeData?.map((item, index) => (
                    <Grid item xs={12} sm={6} lg={2.4} key={index}>
                      <Card
                        sx={{
                          width: '100%',
                          height: '300px',
                          borderWidth: 1,
                          borderRadius: '10px',
                          borderStyle: 'solid',
                          borderColor: '#ccc'
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              height: '100%',
                              minHeight: 140,
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              width={'100%'}
                              height={150}
                              alt='add-role'
                              src={item?.imageObject}
                              style={{
                                objectFit: 'contain',
                                cursor: 'pointer'
                              }}
                            />
                          </Box>
                          <Typography sx={{ marginTop: '10px' }}>
                            {item?.timestamp ? new Date(item?.timestamp).toLocaleString() : 'Date'}
                          </Typography>
                          <Typography
                            sx={{
                              marginTop: '10px',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item?.description} 
                          </Typography>
                          <Typography sx={{ marginTop: '10px' }}>
                            {item?.location ? item?.location : 'Location'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Paper>
          </div>
        </Grid>
      </Grid>
      </>
    );
  };

  export default EventList;
