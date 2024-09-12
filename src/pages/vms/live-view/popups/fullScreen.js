import { Card, Dialog, Fade, Typography, CardContent, Button, Grid } from "@mui/material"
import { forwardRef, useEffect, useState } from "react"
import ViewCamera from "src/@core/components/camera"

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const FullScreen = ({ show, data, cameraList, sizeScreen, onClose }) => {
    const [cameraGroup, setCameraGroup] = useState([])

    useEffect(() => {
        setCameraGroup(data)
    }, [data, cameraList])

    const handSetChanel = (id, channel) => {
        let newCamera = cameraGroup.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    channel: channel
                }
            }

            return item
        })
        setCameraGroup(newCamera)
    }

    return (
        <Card>
            <Dialog
                fullWidth
                fullScreen
                open={show}
                maxWidth='lg'
                scroll='body'
                TransitionComponent={Transition}
                onClose={onClose}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <div>
                    <div>
                        <Grid container spacing={0}>
                            {cameraGroup?.length > 0 &&
                                cameraGroup.map((camera, index) => (
                                    <Grid item xs={Math.floor(12 / sizeScreen.split('x')[0])} key={camera.id + index}>
                                        <ViewCamera
                                            name={camera?.deviceName}
                                            id={camera.id}
                                            channel={camera.channel}
                                            status={camera.status}
                                            sizeScreen={sizeScreen}
                                            handSetChanel={handSetChanel}
                                            isFullScreen={show}
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                        <Button variant="contained" onClick={onClose} >Close</Button>
                    </div>
                </div>
            </Dialog>
        </Card>
    )
}

export default FullScreen