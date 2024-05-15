import { Button, ButtonGroup, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { useState } from "react";
import ApexBarChart from "src/views/charts/apex-charts/ApexBarChart";

const EventOverview = () => {
    const [, setLoading] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [reload, setReload] = useState(0);
    const [, setPageView] = useState(1);
    const [zoom] = useState(100);
    const [dataList, setDataList] = useState(null);
    const [startTime, setStartTime] = useState(1696156991000);
    const [endTime, setEndTime] = useState(new Date());
    const [shouldReload, setShouldReload] = useState(false);
    const [action, setAction] = useState(null);
    const [action1, setAction1] = useState(null);
    const [action2, setAction2] = useState(null);
    const [chart1, setChart1] = useState([]);
    const [chart2, setChart2] = useState([]);
    const [chart3, setChart3] = useState([]);

    const [] = useState(1);
    const [] = useState(1);

    return (
        <>
            <Grid container spacing={0}>
                <Grid item xs={12} >
                    <ApexBarChart />
                </Grid>
            </Grid>
        </>
    )
}

export default EventOverview