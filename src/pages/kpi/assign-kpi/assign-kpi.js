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
                NO.
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Code
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Name
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Location
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                KPI Score
              </TableCell>
              <TableCell align='center' rowSpan={2} sx={{ border: 1 }}>
                Convert
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Total number of emails sent to customers in the month (Email)
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Total number of customer meetings per month (Views){' '}
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Total new customer opportunities converted to leads in the month (Opportunities){' '}
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Total number of contracts signed in the month (Contracts){' '}
              </TableCell>
              <TableCell align='center' colSpan={2} sx={{ border: 1 }}>
                Action{' '}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='center' sx={{ border: 1 }}>
                Importance (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Target
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Importance (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Target
              </TableCell>{' '}
              <TableCell align='center' sx={{ border: 1 }}>
                Importance (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Target
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Importance (%)
              </TableCell>
              <TableCell align='center' sx={{ border: 1 }}>
                Target
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
