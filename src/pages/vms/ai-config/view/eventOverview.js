import { Grid } from "@mui/material";
import { useState } from "react";
import CPUChart from "../charts/CPUChart";
import GPUChart from "../charts/GPUChart";
import MemoryChart from "../charts/MemoryChart";
import ModelAIChart from "../charts/ModelAIChart";

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
            <Grid container spacing={2}>
                <Grid item xs={6} >
                    <ModelAIChart />
                </Grid>
                <Grid item xs={6} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CPUChart />
                        </Grid>
                        <Grid item xs={12}>
                            <GPUChart />
                        </Grid>
                        <Grid item xs={12}>
                            <MemoryChart />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default EventOverview