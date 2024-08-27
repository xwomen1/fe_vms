import { Card, Grid, IconButton } from "@mui/material"
import { useState } from "react"
import ViewCamera from "src/@core/components/camera"
import Icon from 'src/@core/components/icon'

const LiveView = ({ id, name, channel }) => {
    const [camera, setCamera] = useState({ id: id, name: name, channel: channel })
    const [status, setStatus] = useState('')

    const handSetChanel = (id, channel) => {
        setCamera({ id: id, name: name, channel: channel })
    }

    return (

        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Card>
                    {id === '' &&
                        <div style={{ height: '70vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
                            <IconButton disabled>
                                <Icon icon="tabler:player-play-filled" width='48' height='48' style={{ color: '#002060' }} />
                            </IconButton>
                        </div>}
                    {id !== '' &&
                        <ViewCamera
                            name={camera.name}
                            id={camera.id}
                            channel={camera.channel}
                            status={status}
                            sizeScreen={'1x1.2'}
                            handSetChanel={handSetChanel}
                        />
                    }
                </Card>
            </Grid>
        </Grid>
    )
}

export default LiveView