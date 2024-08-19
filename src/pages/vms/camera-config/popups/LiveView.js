import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, styled, Typography } from "@mui/material"
import { forwardRef, useEffect, useState } from "react"
import ViewCamera from "src/@core/components/camera"
import Icon from "src/@core/components/icon"

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

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

const LiveView = ({ show, onClose, data }) => {
    const [camera, setCamera] = useState({ id: '', name: '', channel: '' })

    useEffect(() => {
        setCamera({ id: data.id, name: data.name, channel: 'Sub' })
    }, [])

    const handSetChanel = (id, channel) => {
        setCamera({ id: data.id, name: data.name, channel: channel })
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
                            Live
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <ViewCamera
                            name={camera.name}
                            id={camera.id}
                            channel={camera.channel}

                            // status={status}
                            sizeScreen={'1x1.3'}
                            handSetChanel={handSetChanel}
                        />
                    </Grid>

                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'right',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default LiveView