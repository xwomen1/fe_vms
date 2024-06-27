import { Card, CardContent, CardHeader, Grid } from "@mui/material"

const SmartNVR = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Smart NVR"
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
            <Grid item xs={4}>
                <Card>
                    <CardHeader
                        title="Danh sách thiết bị"
                        titleTypographyProps={{ sx: { mb: [2, 0] } }}
                        sx={{
                            py: 4,
                            flexDirection: ['column', 'row'],
                            '& .MuiCardHeader-action': { m: 0 },
                            alignItems: ['flex-start', 'center']
                        }}

                    />
                    <CardContent sx={{ height: '75vh' }}></CardContent>
                </Card>
            </Grid>
            <Grid item xs={8}>
                <Card>
                    <CardHeader
                        title="Thiết bị"
                        titleTypographyProps={{ sx: { mb: [2, 0] } }}
                        sx={{
                            py: 4,
                            flexDirection: ['column', 'row'],
                            '& .MuiCardHeader-action': { m: 0 },
                            alignItems: ['flex-start', 'center']
                        }}

                    />
                    <CardContent sx={{ height: '75vh' }}></CardContent>
                </Card>
            </Grid>
        </Grid>
    )

}

export default SmartNVR