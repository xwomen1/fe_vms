import React, { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

const convertTimeToMinute = time => {
  const res = (time / 1440) * 100

  return res
}

const Daily = ({ dataDailyProps, callbackOfDaily, disabled }) => {
  const [dataDaily, setDataDaily] = useState(dataDailyProps || [])

  useEffect(() => {
    callbackOfDaily(dataDaily)
  }, [dataDaily])

  useEffect(() => {
    if (dataDailyProps) {
      setDataDaily(dataDailyProps)
    }
  }, [dataDailyProps])

  // Mảng thời gian mặc định
  const defaultTimePeriods = [
    {
      endTimeInMinute: 240,
      startTimeInMinute: 0,
      type: 1
    },
    {
      endTimeInMinute: 240 + 240,
      startTimeInMinute: 240,
      type: 2
    },
    {
      endTimeInMinute: 240 + 240 + 240,
      startTimeInMinute: 240 + 240,
      type: 3
    },
    {
      endTimeInMinute: 240 + 240 + 240 + 240,
      startTimeInMinute: 240 + 240 + 240,
      type: 4
    },
    {
      endTimeInMinute: 240 + 240 + 240 + 240 + 240,
      startTimeInMinute: 240 + 240 + 240 + 240,
      type: 5
    },
    {
      endTimeInMinute: 240 + 240 + 240 + 240 + 240 + 240,
      startTimeInMinute: 240 + 240 + 240 + 240 + 240,
      type: 6
    }
  ]

  // Mảng ngày mặc định
  const dataDailyDefault = [
    {
      label: '',
      value: 1
    },
    {
      label: 'MONDAY',
      dayOfWeek: 'MONDAY',
      value: 2
    },
    {
      label: 'TUESDAY',
      dayOfWeek: 'TUESDAY',
      value: 3
    },
    {
      label: 'WEDNESDAY',
      dayOfWeek: 'WEDNESDAY',
      value: 4
    },
    {
      label: 'THURSDAY',
      dayOfWeek: 'THURSDAY',
      value: 5
    },
    {
      label: 'FRIDAY',
      dayOfWeek: 'FRIDAY',
      value: 6
    },
    {
      label: 'SATURDAY',
      dayOfWeek: 'SATURDAY',
      value: 7
    },
    {
      label: 'SUNDAY',
      dayOfWeek: 'SUNDAY',
      value: 8
    }
  ]

  // Kiểm tra trạng thái của checkbox
  useEffect(() => {
    if (disabled) {
      // Nếu checkbox đã được chọn, thiết lập giá trị mặc định cho dataDaily
      setDataDaily(
        dataDailyDefault.map(day => ({
          ...day,
          timePeriods: defaultTimePeriods.map(time => ({ ...time }))
        }))
      )
    } else {
      // Nếu checkbox không được chọn, thiết lập giá trị mặc định cho dataDaily (rỗng)
      setDataDaily(
        dataDailyDefault.map(day => ({
          ...day,
          timePeriods: []
        }))
      )
    }
  }, [disabled])

  const onClickChoiceItem = (data, type) => {
    // Kiểm tra trạng thái của checkbox
    if (disabled) {
      return // Nếu checkbox chưa được tích, không làm gì cả
    }

    const foundDate = dataDaily.find(e => e.value === type)
    if (foundDate) {
      const newTime = [...(foundDate?.timePeriods || []), data]
      setDataDaily([...dataDaily.filter(e => e.value !== type), { ...foundDate, timePeriods: newTime || [] }])
    }
  }

  const onClickDeleteItem = (date, time) => {
    if (disabled) {
      return // Nếu checkbox chưa được tích, không làm gì cả
    }

    const newTime = date.timePeriods.filter(i => {
      return i.startTimeInMinute !== time.startTimeInMinute || i.endTimeInMinute !== time.endTimeInMinute
    })

    setDataDaily([...dataDaily.filter(e => e.value !== date.value), { ...date, timePeriods: newTime || [] }])
  }

  const onClickIconClear = item => {
    if (disabled) {
      return // Nếu checkbox chưa được tích, không làm gì cả
    }
    const foundClearItem = dataDaily.find(e => e.value === item.value)
    if (foundClearItem) {
      setDataDaily([
        ...dataDaily.filter(e => e.value !== item.value),
        {
          label: foundClearItem.label,
          value: foundClearItem.value,
          dayOfWeek: foundClearItem.dayOfWeek
        }
      ])
    }
  }

  const onClickIconCopy = item => {
    const abc = dataDaily.sort(function (a, b) {
      return a.value - b.value
    })
    const found = abc.find(e => e.value === item.value - 1)

    const dto = {
      label: item.label,
      value: item.value,
      dayOfWeek: item.dayOfWeek,
      timePeriods: found.timePeriods || []
    }

    setDataDaily([...abc.filter(e => e.value !== item.value), dto])
  }

  return (
    <div
      style={{
        width: '100%'
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
                {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((a, b) => (
                  <div
                    key={b.toString()}
                    style={{
                      width: `${100 / 6}%`
                    }}
                  >
                    {a}
                  </div>
                ))}
                <div
                  style={{
                    position: 'absolute',
                    right: -33
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
                <IconButton style={{ padding: 1, marginRight: 8, width: 22 }} onClick={() => onClickIconCopy(item)}>
                  <Icon icon='tabler:copy' />
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
                {defaultTimePeriods.map((a, b) => (
                  <div
                    style={{
                      width: `${100 / 6}%`,
                      cursor: 'pointer'
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
                        backgroundColor: 'rgba(0, 0, 0, 0.12)'
                      }}
                    />
                  </div>
                ))}
                {item.timePeriods?.map((a, b) => (
                  <div
                    key={b.toString()}
                    onClick={() => {
                      onClickDeleteItem(item, a)
                    }}
                    style={{
                      position: 'absolute',
                      left: `${convertTimeToMinute(a.startTimeInMinute)}%`,
                      height: 36,
                      background: '#7EBBFC',
                      cursor: 'pointer',
                      opacity: 0.8,
                      width: `${convertTimeToMinute(a.endTimeInMinute - a.startTimeInMinute)}%`
                    }}
                  />
                ))}
              </div>
              <IconButton style={{ padding: 1, marginRight: 8, width: 22 }} onClick={() => onClickIconClear(item)}>
                <Icon icon='tabler:eraser' />
              </IconButton>
            </div>
          )
        })}
    </div>
  )
}

export default Daily
