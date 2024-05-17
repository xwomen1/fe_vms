import { forwardRef, useState } from "react"
import Icon from 'src/@core/components/icon'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, Tab, Typography, styled } from "@mui/material"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import View from "./view"
import Review from "./review"

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        transform: 'translate(7px, -5px)'
    }
}))

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const EventDetails = ({ show, onClose, data, setReload }) => {
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='lg'
                scroll='body'
                TransitionComponent={Transition}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogContent
                    sx={{
                        pb: theme => `${theme.spacing(8)} !important`,
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <CustomCloseButton onClick={onClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                    <Box sx={{ mb: 8, textAlign: 'left' }}>
                        <Typography variant='h3' sx={{ mb: 3 }}>
                            Chi tiết sự kiện
                        </Typography>
                    </Box>
                    <Grid container spacing={0} style={{ marginTop: 10 }}>
                        <TabContext value={value}>
                            <Grid item xs={12}>
                                {' '}
                                <TabList onChange={handleChange} aria-label='customized tabs example'>
                                    <Tab value='1' label='Chi tiết' key={1} />
                                    <Tab value='2' label='Xem lại' key={2} />
                                </TabList>
                            </Grid>
                            <Grid item xs={12}>
                                <TabPanel value='1'>
                                    <View data={data} />
                                </TabPanel>
                                <TabPanel value='2'>
                                    <Review data={data} id={data.cameraId} channel={'sub'} />
                                </TabPanel>
                            </Grid>
                        </TabContext>
                    </Grid>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'right',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button variant='contained' onClick={onClose}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default EventDetails