import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { faker } from '@faker-js/faker'
import AddPopup from './add'

// Hàm để tạo dữ liệu giả
const generateFakeData = num => {
  const fakeData = []
  for (let i = 1; i <= num; i++) {
    fakeData.push({
      stt: i,
      maKpi: `KPI${faker.datatype.number({ min: 100, max: 999 })}`,
      tenKpi: 'Tổng số việc được giao trong tháng',
      maMucTieu: `MT${faker.datatype.number({ min: 100, max: 999 })}`,
      mucTieu: 'Quy trình nội bộ',
      tanSuatDo: faker.helpers.arrayElement(['Tháng', 'Quý', 'Năm']),
      donViDo: faker.helpers.arrayElement(['Điểm', 'Công việc', 'Hợp Đồng']),
      chieuHuongTot: faker.helpers.arrayElement(['Tăng', 'Giảm']),
      doLuong: 'MDHT=LTHT'
    })
  }

  return fakeData
}

const KPI = () => {
  const [kpiData, setKpiData] = useState(generateFakeData(20))
  const [openPopupAdd, setOpenPopupAdd] = useState(false)

  const handleOpenAdd = () => {
    setOpenPopupAdd(true)
  }

  const handleCloseAdd = () => {
    setOpenPopupAdd(false)
  }

  // Hàm xử lý khi nhấn nút Tải lại
  const handleReload = () => {
    setKpiData(generateFakeData(20))
  }

  // Hàm xử lý khi thêm mới KPI
  const handleAddNewKpi = newKpi => {
    setKpiData([...kpiData, { ...newKpi, stt: kpiData.length + 1 }])
    handleCloseAdd()
  }

  return (
    <Card>
      <CardHeader
        action={
          <Box>
            <Button variant='contained' color='primary' style={{ marginRight: '10px' }}>
              Reload
            </Button>
            <Button variant='contained' onClick={() => handleOpenAdd()}>
              Add
            </Button>
          </Box>
        }
      />
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>NO.</TableCell>
              <TableCell align='center'>Code</TableCell>
              <TableCell align='center'>Name</TableCell>
              <TableCell align='center'>Target Code</TableCell>
              <TableCell align='center'>Target</TableCell>
              <TableCell align='center'>Frequency</TableCell>
              <TableCell align='center'>Unit</TableCell>
              <TableCell align='center'>Direction</TableCell>
              <TableCell align='center'>Measure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kpiData.map((row, index) => (
              <TableRow key={index}>
                <TableCell align='center'>{row.stt}</TableCell>
                <TableCell align='center'>{row.maKpi}</TableCell>
                <TableCell align='center'>{row.tenKpi}</TableCell>
                <TableCell align='center'>{row.maMucTieu}</TableCell>
                <TableCell align='center'>{row.mucTieu}</TableCell>
                <TableCell align='center'>{row.tanSuatDo}</TableCell>
                <TableCell align='center'>{row.donViDo}</TableCell>
                <TableCell align='center'>{row.chieuHuongTot}</TableCell>
                <TableCell align='center'>{row.doLuong}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openPopupAdd && <AddPopup open={openPopupAdd} onClose={handleCloseAdd} onAddNewKpi={handleAddNewKpi} />}
    </Card>
  )
}

export default KPI
