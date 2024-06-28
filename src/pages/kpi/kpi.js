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
        title='Danh mục chỉ tiêu KPIs'
        action={
          <Box>
            <Button variant='contained' color='primary' style={{ marginRight: '10px' }}>
              Tải lại
            </Button>
            <Button variant='contained' onClick={() => handleOpenAdd()}>
              Thêm mới
            </Button>
          </Box>
        }
      />
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>STT</TableCell>
              <TableCell align='center'>Mã KPI</TableCell>
              <TableCell align='center'>Tên KPI</TableCell>
              <TableCell align='center'>Mã mục tiêu</TableCell>
              <TableCell align='center'>Mục tiêu</TableCell>
              <TableCell align='center'>Tần suất đo</TableCell>
              <TableCell align='center'>Đơn vị đo</TableCell>
              <TableCell align='center'>Chiều hướng tốt</TableCell>
              <TableCell align='center'>Cách Đo lường</TableCell>
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
