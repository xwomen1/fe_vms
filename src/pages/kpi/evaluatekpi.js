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

// Hàm để tạo dữ liệu giả
const generateFakeData = num => {
  const fakeData = []
  for (let i = 1; i <= num; i++) {
    fakeData.push({
      stt: i,
      maDangNhap: faker.internet.userName(),
      tenNhanVien: faker.person.fullName(2),
      viTri: faker.helpers.arrayElement(['Nhân Viên', 'Trưởng Phòng']),
      diemKpi: faker.datatype.number({ min: 1, max: 100 }),
      quyDoi: faker.datatype.float({ min: 0, max: 1, precision: 0.01 }),
      doQuanTrong: faker.datatype.number({ min: 1, max: 100 }),
      chiTieuGiao: faker.datatype.number({ min: 1, max: 100 }),
      kqThucHien: faker.datatype.number({ min: 1, max: 100 }),
      dieuChinh: faker.datatype.number({ min: 1, max: 100 }),
      kqThamDinh: faker.datatype.number({ min: 1, max: 100 }),
      tlth: faker.datatype.number({ min: 1, max: 100 }),
      cachDanhGia: faker.lorem.words(2),
      mdht: faker.lorem.word(),
      mdhtQuyDoi: faker.datatype.float({ min: 0, max: 1, precision: 0.01 })
    })
  }

  return fakeData
}

const EmployeeTable = () => {
  const [data, setData] = useState(generateFakeData(20))

  return (
    <Card>
      <CardHeader
        title='Đánh giá KPI'
        action={
          <Box>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setData(generateFakeData(20))}
              style={{ marginRight: '10px' }}
            >
              Tải lại
            </Button>
          </Box>
        }
      />
      <TableContainer component={Paper}>
        <Table style={{ minWidth: '300px' }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                NO.
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Mã đăng nhập
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Tên nhân viên
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Location
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Điểm KPI
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Quy đổi
              </TableCell>
              <TableCell align='center' colSpan={9} sx={{ border: 1 }}>
                Tổng số công việc phải làm trong tháng (Công việc)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='center' sx={{ border: 1 }}>
                Độ quan trọng (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Chỉ tiêu giao
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                KQ thực hiện
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Điều chỉnh
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                KQ thẩm định
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                TLTH
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Cách đánh giá
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                MĐHT
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                MĐHT quy đổi
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.stt}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.maDangNhap}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.tenNhanVien}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.viTri}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.diemKpi}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.quyDoi}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.doQuanTrong}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.chiTieuGiao}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.kqThucHien}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.dieuChinh}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.kqThamDinh}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.tlth}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.cachDanhGia}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.mdht}
                </TableCell>
                <TableCell align='center' sx={{ border: 1 }}>
                  {row.mdhtQuyDoi}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default EmployeeTable
