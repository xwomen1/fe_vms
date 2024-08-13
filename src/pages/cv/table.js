import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authConfig from 'src/configs/auth'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { Box, CardHeader, IconButton, TableContainer } from '@mui/material'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import axios from 'axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { fetchChatsContacts } from 'src/store/apps/chat'
import Filter from './popups/filter'

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [valueGroup, setValueGroup] = useState('')
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const [addUserOpen, setAddUserOpen] = useState(false)
  const [userData, setUserData] = useState([])
  const [total, setTotal] = useState([1])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const pageSizeOptions = [25, 50, 100]
  const [groups, setGroups] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const [contractName, setContractName] = useState('')
  const [contractTypes, setContractTypes] = useState({})

  const handleSetValueFilter = data => {
    const newDto = {
      ...valueFilter,
      ...data,
      page: 1
    }

    setValueFilter(newDto)
    setIsOpenFilter(false)
  }

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const handleViewDetails = userId => {
    router.push(`/${userId}`)
  }

  function showAlertConfirm(options, intl) {
    const defaultProps = {
      title: intl ? intl.formatMessage({ id: 'app.title.confirm' }) : 'Xác nhận',
      imageWidth: 213,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: intl ? intl.formatMessage({ id: 'app.button.OK' }) : 'Đồng ý',
      cancelButtonText: intl ? intl.formatMessage({ id: 'app.button.cancel' }) : 'Hủy',
      customClass: {
        content: 'content-class',
        confirmButton: 'swal-btn-confirm'
      }
    }

    return Swal.fire({ ...defaultProps, ...options })
  }

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleSelectPageSize = size => {
    setPageSize(size)
    setPage(1)
    handleCloseMenu()
  }

  const userDatas = [
    {
      id: 1,
      hoTen: 'Nguyễn Văn A',
      tenGoiKhac: 'Anh A',
      ngaySinh: '01/01/1980',
      noiSinh: 'Hà Nội',
      queQuan: 'Hà Nội',
      gioiTinh: 'Nam',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Kỹ sư',
      hoKhau: 'Hà Nội',
      noiOHienNay: 'Hà Nội',
      ngayTuyenDung: '01/01/2010',
      coQuanTuyenDung: 'ABC Corp',
      chucVu: 'Trưởng phòng',
      congViecDuocGiao: 'Quản lý dự án',
      ngachCongChuc: 'Chuyên viên chính',
      maNgach: '001',
      bacLuong: '5',
      heSo: '3.5',
      ngayHuong: '01/01/2020',
      phuCapChucVu: '5000000',
      phuCapKhac: '2000000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Thạc sĩ',
      lyLuanCT: 'Cao cấp',
      quanLyNN: 'Cao cấp',
      ngoaiNgu: 'Tiếng Anh',
      tinHoc: 'Chứng chỉ B',
      ngayVaoDang: '01/01/2005',
      ngayChinhThuc: '01/01/2006',
      ngayThamGiaTCCTXH: '01/01/2003',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Quản lý',
      khenThuong: 'Bằng khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '175 cm',
      canNang: '70 kg',
      nhomMau: 'O',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '123456789',
      ngayCap: '01/01/2000',
      soBHXH: '987654321'
    },
    {
      id: 2,
      hoTen: 'Trần Thị B',
      tenGoiKhac: 'Chị B',
      ngaySinh: '02/02/1985',
      noiSinh: 'Hải Phòng',
      queQuan: 'Hải Phòng',
      gioiTinh: 'Nữ',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Giáo viên',
      hoKhau: 'Hải Phòng',
      noiOHienNay: 'Hải Phòng',
      ngayTuyenDung: '02/02/2012',
      coQuanTuyenDung: 'XYZ School',
      chucVu: 'Giáo viên chính',
      congViecDuocGiao: 'Dạy học',
      ngachCongChuc: 'Giáo viên',
      maNgach: '002',
      bacLuong: '4',
      heSo: '3.2',
      ngayHuong: '02/02/2022',
      phuCapChucVu: '4000000',
      phuCapKhac: '1500000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Cử nhân',
      lyLuanCT: 'Trung cấp',
      quanLyNN: 'Trung cấp',
      ngoaiNgu: 'Tiếng Pháp',
      tinHoc: 'Chứng chỉ A',
      ngayVaoDang: '02/02/2010',
      ngayChinhThuc: '02/02/2011',
      ngayThamGiaTCCTXH: '02/02/2008',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Giảng dạy',
      khenThuong: 'Giấy khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '160 cm',
      canNang: '55 kg',
      nhomMau: 'A',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '234567890',
      ngayCap: '02/02/2002',
      soBHXH: '876543210'
    },
    {
      id: 3,
      hoTen: 'Nguyễn Văn C',
      tenGoiKhac: 'Anh C',
      ngaySinh: '02/02/1995',
      noiSinh: 'Hà Nội',
      queQuan: 'Hà Nội',
      gioiTinh: 'Nữ',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Giáo viên',
      hoKhau: 'Hà Nội',
      noiOHienNay: 'Hà Nội',
      ngayTuyenDung: '02/02/2012',
      coQuanTuyenDung: 'XYZ School',
      chucVu: 'Giáo viên chính',
      congViecDuocGiao: 'Dạy học',
      ngachCongChuc: 'Giáo viên',
      maNgach: '002',
      bacLuong: '4',
      heSo: '3.2',
      ngayHuong: '02/02/2022',
      phuCapChucVu: '4000000',
      phuCapKhac: '1500000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Cử nhân',
      lyLuanCT: 'Trung cấp',
      quanLyNN: 'Trung cấp',
      ngoaiNgu: 'Tiếng Pháp',
      tinHoc: 'Chứng chỉ A',
      ngayVaoDang: '02/02/2010',
      ngayChinhThuc: '02/02/2011',
      ngayThamGiaTCCTXH: '02/02/2008',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Giảng dạy',
      khenThuong: 'Giấy khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '160 cm',
      canNang: '55 kg',
      nhomMau: 'A',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '234567890',
      ngayCap: '02/02/2002',
      soBHXH: '876543210'
    },
    {
      id: 4,
      hoTen: 'Trần Thị D',
      tenGoiKhac: 'Chị B',
      ngaySinh: '02/02/1985',
      noiSinh: 'Hải Dương',
      queQuan: 'Hải Dương',
      gioiTinh: 'Nữ',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Giáo viên',
      hoKhau: 'Hải Dương',
      noiOHienNay: 'Hải Dương',
      ngayTuyenDung: '02/02/2012',
      coQuanTuyenDung: 'XYZ School',
      chucVu: 'Giáo viên chính',
      congViecDuocGiao: 'Dạy học',
      ngachCongChuc: 'Giáo viên',
      maNgach: '002',
      bacLuong: '4',
      heSo: '3.2',
      ngayHuong: '02/02/2022',
      phuCapChucVu: '4000000',
      phuCapKhac: '1500000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Cử nhân',
      lyLuanCT: 'Trung cấp',
      quanLyNN: 'Trung cấp',
      ngoaiNgu: 'Tiếng Pháp',
      tinHoc: 'Chứng chỉ A',
      ngayVaoDang: '02/02/2010',
      ngayChinhThuc: '02/02/2011',
      ngayThamGiaTCCTXH: '02/02/2008',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Giảng dạy',
      khenThuong: 'Giấy khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '160 cm',
      canNang: '55 kg',
      nhomMau: 'A',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '234567890',
      ngayCap: '02/02/2002',
      soBHXH: '876543210'
    },
    {
      id: 5,
      hoTen: 'Nguyễn Văn An',
      tenGoiKhac: 'A Nguyễn',
      ngaySinh: '01/01/1980',
      noiSinh: 'Hà Nội',
      queQuan: 'Hà Nội',
      gioiTinh: 'Nam',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Kỹ sư',
      hoKhau: 'Hà Nội',
      noiOHienNay: 'Hà Nội',
      ngayTuyenDung: '01/01/2005',
      coQuanTuyenDung: 'ABC Company',
      chucVu: 'Giám đốc',
      congViecDuocGiao: 'Quản lý dự án',
      ngachCongChuc: 'Quản lý',
      maNgach: '001',
      bacLuong: '7',
      heSo: '4.5',
      ngayHuong: '01/01/2023',
      phuCapChucVu: '5000000',
      phuCapKhac: '2000000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Thạc sĩ',
      lyLuanCT: 'Cao cấp',
      quanLyNN: 'Cao cấp',
      ngoaiNgu: 'Tiếng Anh',
      tinHoc: 'Chứng chỉ B',
      ngayVaoDang: '01/01/2000',
      ngayChinhThuc: '01/01/2001',
      ngayThamGiaTCCTXH: '01/01/1998',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Quản lý dự án',
      khenThuong: 'Bằng khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '170 cm',
      canNang: '65 kg',
      nhomMau: 'O',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '123456789',
      ngayCap: '01/01/1995',
      soBHXH: '987654321'
    },
    {
      id: 6,
      hoTen: 'Trần Thị Bính',
      tenGoiKhac: 'Chị C',
      ngaySinh: '03/03/1983',
      noiSinh: 'Hải Phòng',
      queQuan: 'Hải Phòng',
      gioiTinh: 'Nữ',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Bác sĩ',
      hoKhau: 'Hải Phòng',
      noiOHienNay: 'Hải Phòng',
      ngayTuyenDung: '03/03/2010',
      coQuanTuyenDung: 'XYZ Hospital',
      chucVu: 'Trưởng khoa',
      congViecDuocGiao: 'Điều trị bệnh nhân',
      ngachCongChuc: 'Y sĩ',
      maNgach: '002',
      bacLuong: '5',
      heSo: '3.8',
      ngayHuong: '03/03/2021',
      phuCapChucVu: '4500000',
      phuCapKhac: '1800000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Tiến sĩ',
      lyLuanCT: 'Cao cấp',
      quanLyNN: 'Cao cấp',
      ngoaiNgu: 'Tiếng Nhật',
      tinHoc: 'Chứng chỉ C',
      ngayVaoDang: '03/03/2005',
      ngayChinhThuc: '03/03/2006',
      ngayThamGiaTCCTXH: '03/03/2003',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Điều trị bệnh nhân',
      khenThuong: 'Giấy khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '165 cm',
      canNang: '60 kg',
      nhomMau: 'AB',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '234567890',
      ngayCap: '03/03/2003',
      soBHXH: '876543210'
    },
    {
      id: 7,
      hoTen: 'Lê Văn Cừ',
      tenGoiKhac: 'Anh C',
      ngaySinh: '05/05/1985',
      noiSinh: 'Đà Nẵng',
      queQuan: 'Đà Nẵng',
      gioiTinh: 'Nam',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Luật sư',
      hoKhau: 'Đà Nẵng',
      noiOHienNay: 'Đà Nẵng',
      ngayTuyenDung: '05/05/2012',
      coQuanTuyenDung: 'XYZ Law Firm',
      chucVu: 'Giám đốc pháp lý',
      congViecDuocGiao: 'Tư vấn pháp luật',
      ngachCongChuc: 'Luật sư',
      maNgach: '003',
      bacLuong: '6',
      heSo: '4.0',
      ngayHuong: '05/05/2024',
      phuCapChucVu: '4800000',
      phuCapKhac: '1900000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Tiến sĩ',
      lyLuanCT: 'Cao cấp',
      quanLyNN: 'Cao cấp',
      ngoaiNgu: 'Tiếng Trung',
      tinHoc: 'Chứng chỉ D',
      ngayVaoDang: '05/05/2010',
      ngayChinhThuc: '05/05/2011',
      ngayThamGiaTCCTXH: '05/05/2008',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Tư vấn pháp luật',
      khenThuong: 'Bằng khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '175 cm',
      canNang: '70 kg',
      nhomMau: 'A',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '345678901',
      ngayCap: '05/05/2005',
      soBHXH: '765432109'
    },
    {
      id: 8,
      hoTen: 'Trần Thị Di',
      tenGoiKhac: 'Chị B',
      ngaySinh: '02/02/1985',
      noiSinh: 'Hải Dương',
      queQuan: 'Hải Dương',
      gioiTinh: 'Nữ',
      danToc: 'Kinh',
      tonGiao: 'Không',
      ngheNghiep: 'Giáo viên',
      hoKhau: 'Hải Dương',
      noiOHienNay: 'Hải Dương',
      ngayTuyenDung: '02/02/2012',
      coQuanTuyenDung: 'XYZ School',
      chucVu: 'Giáo viên chính',
      congViecDuocGiao: 'Dạy học',
      ngachCongChuc: 'Giáo viên',
      maNgach: '002',
      bacLuong: '4',
      heSo: '3.2',
      ngayHuong: '02/02/2022',
      phuCapChucVu: '4000000',
      phuCapKhac: '1500000',
      trinhDoGDPT: '12/12',
      trinhDoCM: 'Cử nhân',
      lyLuanCT: 'Trung cấp',
      quanLyNN: 'Trung cấp',
      ngoaiNgu: 'Tiếng Pháp',
      tinHoc: 'Chứng chỉ A',
      ngayVaoDang: '02/02/2010',
      ngayChinhThuc: '02/02/2011',
      ngayThamGiaTCCTXH: '02/02/2008',
      ngayNhapNgu: 'Không',
      ngayXuatNgu: 'Không',
      quanHamCaoNhat: 'Không',
      danhHieuDuocPhong: 'Không',
      soTruongCongTac: 'Giảng dạy',
      khenThuong: 'Giấy khen',
      kyLuat: 'Không',
      tinhTrangSucKhoe: 'Tốt',
      chieuCao: '160 cm',
      canNang: '55 kg',
      nhomMau: 'A',
      laThuongBinhHang: 'Không',
      laConGiaDinhCS: 'Không',
      soCMND: '234567890',
      ngayCap: '02/02/2002',
      soBHXH: '876543210'
    }

    // Add 6 more similar entries here
  ]

  const fetchRegionName = async regionId => {
    try {
      const response = await axios.get(`https://sbs.basesystem.one/ivis/infrares/api/v0/regions/${regionId}`)

      return response.data.name
    } catch (error) {
      console.error('Error fetching region name:', error)

      return ''
    }
  }
  useEffect(() => {
    const fetchAllRegionNames = async () => {
      const newContractTypes = {}
      for (const user of userData) {
        if (user.contractType) {
          const regionName = await fetchRegionName(user.contractType)
          newContractTypes[user.contractType] = regionName
        }
      }
      setContractTypes(newContractTypes)
    }

    fetchAllRegionNames()
  }, [userData])

  const GroupCheckbox = ({ group, checked, onChange }) => {
    return (
      <div>
        <input
          type='checkbox'
          id={`group-${group.groupId}`}
          checked={checked}
          onChange={e => onChange(group.groupId, e.target.checked)}
        />
        <label htmlFor={`group-${group.groupId}`}>{group.groupName}</label>
      </div>
    )
  }

  const handleGroupCheckboxChange = (groupId, checked) => {
    if (checked) {
      setSelectedGroups(prevGroups => [...prevGroups, { groupId }])
    } else {
      setSelectedGroups(prevGroups => prevGroups.filter(g => g.groupId !== groupId))
    }
  }
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)
        console.log('token', token)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            keyword: valueGroup
          }
        }
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/groups/search', config)
        const dataWithChildren = addChildrenField(response.data)
        const rootGroups = findRootGroups(dataWithChildren)
        setGroups(rootGroups)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchGroupData()
  }, [pageSize, valueGroup])

  const addChildrenField = (data, parentId = null) => {
    return data.map(group => {
      const children = data.filter(child => child.parentId === group.groupId)
      if (children.length > 0) {
        group.children = children
      }

      return group
    })
  }

  const renderGroup = group => (
    <TreeItem
      key={group.groupId}
      nodeId={group.groupId}
      label={
        <GroupCheckbox
          group={group}
          checked={selectedGroups.some(g => g.groupId === group.groupId)}
          onChange={handleGroupCheckboxChange}
        />
      }
      style={{ marginTop: '5%' }}
    >
      {group.children && group.children.map(childGroup => renderGroup(childGroup))}
    </TreeItem>
  )

  const findRootGroups = data => {
    const rootGroups = []
    data.forEach(group => {
      if (!data.some(item => item.groupId === group.parentId)) {
        rootGroups.push(group)
      }
    })

    return rootGroups
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleFilterGroup = event => {
    setValueGroup(event)
  }

  console.log(total, 'totalpage')

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid style={{ minWidth: '1000px' }}>
      <Card>
        <CardHeader
          titleTypographyProps={{ sx: { mb: [2, 0] } }}
          sx={{
            py: 4,
            flexDirection: ['column', 'row'],
            '& .MuiCardHeader-action': { m: 0 },
            alignItems: ['flex-start', 'center']
          }}
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Box sx={{ float: 'right' }}>
                  <IconButton
                    aria-label='Bộ lọc'
                    onClick={() => {
                      setIsOpenFilter(true)
                    }}
                    color='primary'
                  >
                    <Icon icon='tabler:filter' />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item>
                <CustomTextField
                  placeholder='Tìm kiếm  '
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 2, display: 'flex' }}>
                        <Icon fontSize='1.25rem' icon='tabler:search' />
                      </Box>
                    ),
                    endAdornment: (
                      <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => setKeyword('')}>
                        <Icon fontSize='1.25rem' icon='tabler:x' />
                      </IconButton>
                    )
                  }}
                  onChange={e => handleSearch(e)}
                  sx={{
                    width: {
                      xs: 1,
                      sm: 'auto'
                    },
                    '& .MuiInputBase-root > svg': {
                      mr: 2
                    }
                  }}
                />
              </Grid>
            </Grid>
          }
        />{' '}
        <Grid container spacing={2}>
          {/* <Grid item xs={0.1}></Grid> */}
          <Grid item xs={0.2}></Grid>

          <Grid item xs={2} component={Paper}>
            <div>
              <CustomTextField
                value={valueGroup}
                sx={{ mr: 4 }}
                placeholder='Search Group'
                onChange={e => handleFilterGroup(e.target.value)}
              />
              <TreeView
                sx={{ minHeight: 240 }}
                defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
                defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
              >
                {groups.map(rootGroup => renderGroup(rootGroup))}
              </TreeView>
            </div>
          </Grid>
          <Grid item xs={9.8} minWidth={700}>
            <Box sx={{ overflow: 'auto' }}>
              <Paper elevation={3}>
                <TableContainer component={Paper} style={{ maxWidth: '100%', overflowX: 'auto' }}>
                  <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>NO.</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Full Name</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Other Name</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Day of birth</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Place of birth</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Hometown</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Gender</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Nation</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Religion</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Nghề nghiệp</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Permanent residence</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Current residence</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Recruitment date</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Recruitment agency</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Position</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Assigned work</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Civil servant rank</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Code</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Salary level</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Coefficient</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Date received</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Position allowance</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Other allowance</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>General education level</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Highest level of expertise</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Political theory</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>State management</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Language</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Computer Science</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>State Party Day</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Date</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          Date of joining political-social organization
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Date of enlistment</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Date of discharge</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Highest military rank</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Highest awarded title</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Area of expertise</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Awards</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Disciplinary actions</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Health status</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Height</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Weight</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Blood type</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Is a war invalid</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Is a child of a policy family</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>ID number</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Date of issuance</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Social insurance number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userDatas.map((user, index) => (
                        <TableRow key={user.id} hover>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.hoTen}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.tenGoiKhac}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngaySinh}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.noiSinh}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.queQuan}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.gioiTinh}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.danToc}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.tonGiao}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngheNghiep}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.hoKhau}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.noiOHienNay}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayTuyenDung}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.coQuanTuyenDung}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.chucVu}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.congViecDuocGiao}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngachCongChuc}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.maNgach}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.bacLuong}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.heSo}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayHuong}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.phuCapChucVu}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.phuCapKhac}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.trinhDoGDPT}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.trinhDoCM}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.lyLuanCT}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.quanLyNN}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngoaiNgu}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.tinHoc}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayVaoDang}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayChinhThuc}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayThamGiaTCCTXH}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayNhapNgu}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayXuatNgu}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.quanHamCaoNhat}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.danhHieuDuocPhong}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.soTruongCongTac}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.khenThuong}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.kyLuat}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.tinhTrangSucKhoe}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.chieuCao}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.canNang}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.nhomMau}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.laThuongBinhHang}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.laConGiaDinhCS}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.soCMND}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.ngayCap}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{user.soBHXH}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            <br></br>
            <Grid container spacing={2} style={{ padding: 10 }}>
              <Grid item xs={3}></Grid>
              <Grid item xs={1.5} style={{ padding: 0 }}>
                <IconButton onClick={handleOpenMenu}>
                  <Icon icon='tabler:selector' />
                  <p style={{ fontSize: 15 }}>{pageSize} line/page</p>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                  {pageSizeOptions.map(size => (
                    <MenuItem key={size} onClick={() => handleSelectPageSize(size)}>
                      {size}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
              <Grid item xs={6}>
                <Pagination count={total} color='primary' onChange={(event, page) => handlePageChange(page)} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
      {isOpenFilter && (
        <Filter show={isOpenFilter} onClose={() => setIsOpenFilter(false)} callback={handleSetValueFilter} />
      )}
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
