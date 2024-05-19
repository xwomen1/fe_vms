import { Card, Grid, IconButton } from "@mui/material"
import { useState } from "react"
import ViewCamera from "src/@core/components/camera"
import Icon from 'src/@core/components/icon'

const LiveView = ({ id, name, channel }) => {
    const [channelCurrent, setChannelCurrent] = useState(null)
    const [status, setStatus] = useState('')

    const handSetChanel = (channel) => {
        setChannelCurrent(channel)
    }

    return (
        <Card>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    {id === '' &&
                        <div style={{ height: '70vh', background: '#000', display: 'flex', justifyContent: 'center' }}>
                            <IconButton disabled>
                                <Icon icon="tabler:player-play-filled" width='48' height='48' style={{ color: '#FF9F43' }} />
                            </IconButton>
                        </div>}
                    {id !== '' &&
                        <ViewCamera
                            name={name}
                            id={id}
                            channel={channel}
                            status={status}
                            sizeScreen={'1x1'}
                            handSetChanel={handSetChanel}
                        />
                    }
                </Grid>
            </Grid>
        </Card>
    )
}

export default LiveView