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
  Paper,
  Grid,
  IconButton
} from '@mui/material'
import { faker } from '@faker-js/faker'
import Icon from 'src/@core/components/icon'

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
      cachDanhGia: faker.datatype.number({ min: 1, max: 100 }),
      mdht: faker.datatype.number({ min: 1, max: 100 }),
      mdhtQuyDoi: faker.datatype.float({ min: 0, max: 1, precision: 0.01 })
    })
  }

  return fakeData
}

const EmployeeTable = () => {
  const [data, setData] = useState(generateFakeData(20))

  return (
    <Card>
      <CardHeader />
      <TableContainer component={Paper}>
        <Table style={{ minWidth: '300px' }}>
          <TableHead>
            <TableRow>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                STT
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Mã đăng nhập
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Tên nhân viên
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Vị trí
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Điểm KPI
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Quy đổi
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Tổng số email gửi cho khách hàng trong tháng (Email)
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Tổng số lần gặp mặt khách hàng trong tháng (Lượt)
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Tổng số cơ hội khách hàng mới chuyển đổi thành khách hàng tiềm năng trong tháng (Cơ hội)
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Tổng số hợp đồng đã ký trong tháng (Hợp đồng)
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Hành động{' '}
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
                Độ quan trọng (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Chỉ tiêu giao
              </TableCell>{' '}
              <TableCell align='center' sx={{ border: 1 }}>
                Độ quan trọng (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Chỉ tiêu giao
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Độ quan trọng (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Chỉ tiêu giao
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}></TableCell>
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
                  <Grid container spacing={2}>
                    <IconButton>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Grid>
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
