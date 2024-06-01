import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"

const Demo = ({ data }) => {
    const [dateData, setDateData] = useState([])

    useEffect(() => {
        if (data) {
            console.log('data', data)
            const transformedData = transformData(data)
            setDateData(transformedData)
        }
    }, [data])

    const transformData = (apiData) => {
        const result = {}

        apiData.forEach(item => {
            const startTime = new Date(item.StartTime)
            const endTime = new Date(item.EndTime)

            const startDate = startTime.toISOString().split('T')[0]
            const endDate = endTime.toISOString().split('T')[0]

            if (!result[startDate]) {
                result[startDate] = []
            }
            if (!result[endDate]) {
                result[endDate] = []
            }

            if (startDate === endDate) {
                result[startDate].push({
                    startTime: formatTime(startTime),
                    endTime: formatTime(endTime)
                })
            } else {
                result[startDate].push({
                    startTime: formatTime(startTime),
                    endTime: '23:59'
                })

                const splitTimes = splitByHour(startTime, endTime)
                splitTimes.forEach(time => {
                    if (time.date === startDate) {
                        result[startDate].push(time)
                    } else {
                        result[endDate].push(time)
                    }
                })

                result[endDate].push({
                    startTime: '00:00',
                    endTime: formatTime(endTime)
                })
            }
        })

        return Object.keys(result).map(date => ({
            date,
            timeStorage: result[date]
        }))
    }

    const formatTime = (date) => {
        return date.toTimeString().split(':').slice(0, 2).join(':')
    }

    const splitByHour = (start, end) => {
        const times = []
        const startHour = start.getHours()
        const endHour = end.getHours()
        const startMinute = start.getMinutes()
        const endMinute = end.getMinutes()

        for (let hour = startHour; hour <= endHour; hour++) {
            if (hour === startHour) {
                times.push({
                    date: start.toISOString().split('T')[0],
                    startTime: formatTime(start),
                    endTime: hour !== endHour ? `${hour + 1}:00` : formatTime(end)
                })
            } else if (hour === endHour) {
                times.push({
                    date: end.toISOString().split('T')[0],
                    startTime: `${hour}:00`,
                    endTime: formatTime(end)
                })
            } else {
                times.push({
                    date: start.toISOString().split('T')[0],
                    startTime: `${hour}:00`,
                    endTime: `${hour + 1}:00`
                })
            }
        }

        return times
    }

    if (data.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Data Display</h1>
            {dateData.map((day, index) => (
                <div key={index}>
                    <h2>{day.date}</h2>
                    {day.timeStorage?.map((time, idx) => (
                        <p key={idx}>
                            Start Time: {time.startTime} - End Time: {time.endTime}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Demo
