/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable func-names */
import React, { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

const convertTimeToMinute = (time) => {
    const res = (time / 1440) * 100

    return res
}

const Daily = ({ dataDailyProps, callbackOfDaily }) => {
    const [dataDaily, setDataDaily] = useState(dataDailyProps || [])

    useEffect(() => {
        callbackOfDaily(dataDaily)
    }, [dataDaily])

    useEffect(() => {
        if (dataDailyProps) {
            setDataDaily(dataDailyProps)
        }
    }, [dataDailyProps])

    const onClickChoiceItem = (data, type) => {
        const foundDate = dataDaily.find((e) => e.value === type)
        if (foundDate) {
            const newTime = [...(foundDate?.times || []), data]
            setDataDaily([
                ...dataDaily.filter((e) => e.value !== type),
                { ...foundDate, times: newTime || [] },
            ])
        }
    }

    const onClickDeleteItem = (date, time) => {
        const newTime = date.times.filter((i) => i.type !== time.type)
        setDataDaily([
            ...dataDaily.filter((e) => e.value !== date.value),
            { ...date, times: newTime || [] },
        ])
    }

    const onClickIconClear = (item) => {
        const foundClearItem = dataDaily.find((e) => e.value === item.value)
        if (foundClearItem) {
            setDataDaily([
                ...dataDaily.filter((e) => e.value !== item.value),
                {
                    label: foundClearItem.label,
                    value: foundClearItem.value,
                    StringValue: foundClearItem.StringValue,
                },
            ])
        }
    }

    const onClickIconCopy = (item) => {
        const abc = dataDaily.sort(function (a, b) {
            return a.value - b.value
        })

        const found = abc.find((e) => e.value === item.value - 1)

        const dto = {
            label: item.label,
            value: item.value,
            StringValue: item.StringValue,
            times: found.times || [],
        }
        setDataDaily([...abc.filter((e) => e.value !== item.value), dto])
    }

    return (
        <div
            style={{
                width: '100%',
            }}
        >
            {dataDaily
                .sort(function (a, b) {
                    return a.value - b.value
                })
                .map((item, index) => {
                    if (item.value === 1) {
                        return (
                            <div
                                key={index.toString()}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginLeft: 93,
                                    width: 'calc(100% - 150px)',
                                    position: 'relative',
                                    color: 'rgba(0, 0, 0, 0.6)',
                                    fontSize: 14
                                }}
                            >
                                {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map(
                                    (a, b) => (
                                        <div
                                            key={b.toString()}
                                            style={{
                                                width: `${100 / 6}%`,
                                            }}
                                        >
                                            {a}
                                        </div>
                                    ),
                                )}
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: -33,
                                    }}
                                >
                                    24:00
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={index.toString()}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: 6,
                                fontSize: 14,
                                fontWeight: 400,
                                color: 'rgba(0, 0, 0, 0.6)'
                            }}
                        >
                            <div style={{ minWidth: 80 }}>{item.label}</div>
                            {index === 1 ? (
                                <div style={{ width: 35 }} />
                            ) : (
                                <IconButton
                                    style={{ padding: 1, marginRight: 8, width: 22 }}
                                    onClick={() => onClickIconCopy(item)}
                                >
                                    <Icon icon="tabler:copy" />
                                </IconButton>

                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: 36,
                                    borderRadius: 4,
                                    position: 'relative',
                                    border: '1px solid rgba(0, 0, 0, 0.06)'
                                }}

                            >
                                {[
                                    {
                                        endtime: 240,
                                        starttime: 0,
                                    },
                                    {
                                        endtime: 240 + 240,
                                        starttime: 240,
                                    },
                                    {
                                        endtime: 240 + 240 + 240,
                                        starttime: 240 + 240,
                                    },
                                    {
                                        endtime: 240 + 240 + 240 + 240,
                                        starttime: 240 + 240 + 240,
                                    },
                                    {
                                        endtime: 240 + 240 + 240 + 240 + 240,
                                        starttime: 240 + 240 + 240 + 240,
                                    },
                                    {
                                        endtime: 240 + 240 + 240 + 240 + 240 + 240,
                                        starttime: 240 + 240 + 240 + 240 + 240,
                                    },
                                ].map((a, b) => (
                                    <div
                                        style={{
                                            width: `${100 / 6}%`,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            onClickChoiceItem(a, item.value)
                                        }}
                                        key={b.toString()}
                                    >
                                        <div
                                            style={{
                                                width: b === 0 ? 0 : 1,
                                                height: 36,
                                                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                            }}
                                        />
                                    </div>
                                ))}
                                {item.times?.map((a, b) => (
                                    <div
                                        key={b.toString()}
                                        onClick={() => {
                                            onClickDeleteItem(item, a)
                                        }}
                                        style={{
                                            position: 'absolute',
                                            left: `${convertTimeToMinute(a.starttime)}%`,
                                            height: 36,
                                            background: '#7EBBFC',
                                            cursor: 'pointer',
                                            opacity: 0.8,
                                            width: `${convertTimeToMinute(a.endtime - a.starttime)}%`,
                                        }}
                                    />
                                ))}
                            </div>
                            <IconButton
                                style={{ padding: 1, marginRight: 8, width: 22 }}
                                onClick={() => onClickIconClear(item)}
                            >
                                <Icon icon="tabler:eraser" />
                            </IconButton>
                        </div>
                    )
                })}
        </div>
    )
}

export default Daily
