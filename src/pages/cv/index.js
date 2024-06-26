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
import { Box, CardHeader, IconButton } from '@mui/material'
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
      soBHXH: '987654321',
      hanhDong: 'Xem chi tiết'
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
      soBHXH: '876543210',
      hanhDong: 'Xem chi tiết'
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
      soBHXH: '876543210',
      hanhDong: 'Xem chi tiết'
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
      soBHXH: '876543210',
      hanhDong: 'Xem chi tiết'
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
          title='Danh sách hồ sơ'
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
          <Grid item xs={9.8}>
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ padding: '16px' }}>STT</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Họ tên</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tên gọi khác</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày sinh </TableCell>
                    <TableCell sx={{ padding: '16px' }}>Nơi sinh</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Quê quán</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Giới tính</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Dân tộc</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tôn giáo</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Nghề nghiệp</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Đăng ký hộ khẩu thường chú</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Nơi ở hiện nay</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày tuyển dụng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Cơ quan tuyển dụng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Chức vụ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Công việc được giao</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngạch công chức</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Mã ngách</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Bậc lương</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Hệ số</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày hưởng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp chức vụ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Phụ cấp khác</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Trình độ giáo dục phổ thông</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Trình độ chuyên môn cao nhất</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Lý luận chính trị</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Quản lý nhà nước</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngoại ngữ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tin học</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày vào Đảng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày chính thức</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày tham gia tổ chức chính trị - xã hội</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày nhập ngũ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày xuất ngũ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Quân hàm cao nhất</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Danh hiệu được phân cao nhất</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Sở trường công tác</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Khen thưởng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Kỷ luật</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Tình trạng sức khoẻ</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Chiều cao</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Cân nặng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Nhóm máu</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Là thương binh hạng</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Là con gia đình chính sách</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Số CMND</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Ngày cấp</TableCell>
                    <TableCell sx={{ padding: '16px' }}>Số BHXH</TableCell>

                    <TableCell sx={{ padding: '16px' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userDatas.map((user, index) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.hoTen}</TableCell>
                      <TableCell>{user.tenGoiKhac}</TableCell>
                      <TableCell>{user.ngaySinh}</TableCell>
                      <TableCell>{user.noiSinh}</TableCell>
                      <TableCell>{user.queQuan}</TableCell>
                      <TableCell>{user.gioiTinh}</TableCell>
                      <TableCell>{user.danToc}</TableCell>
                      <TableCell>{user.tonGiao}</TableCell>
                      <TableCell>{user.ngheNghiep}</TableCell>
                      <TableCell>{user.hoKhau}</TableCell>
                      <TableCell>{user.noiOHienNay}</TableCell>
                      <TableCell>{user.ngayTuyenDung}</TableCell>
                      <TableCell>{user.coQuanTuyenDung}</TableCell>
                      <TableCell>{user.chucVu}</TableCell>
                      <TableCell>{user.congViecDuocGiao}</TableCell>
                      <TableCell>{user.ngachCongChuc}</TableCell>
                      <TableCell>{user.maNgach}</TableCell>
                      <TableCell>{user.bacLuong}</TableCell>
                      <TableCell>{user.heSo}</TableCell>
                      <TableCell>{user.ngayHuong}</TableCell>
                      <TableCell>{user.phuCapChucVu}</TableCell>
                      <TableCell>{user.phuCapKhac}</TableCell>
                      <TableCell>{user.trinhDoGDPT}</TableCell>
                      <TableCell>{user.trinhDoCM}</TableCell>
                      <TableCell>{user.lyLuanCT}</TableCell>
                      <TableCell>{user.quanLyNN}</TableCell>
                      <TableCell>{user.ngoaiNgu}</TableCell>
                      <TableCell>{user.tinHoc}</TableCell>
                      <TableCell>{user.ngayVaoDang}</TableCell>
                      <TableCell>{user.ngayChinhThuc}</TableCell>
                      <TableCell>{user.ngayThamGiaTCCTXH}</TableCell>
                      <TableCell>{user.ngayNhapNgu}</TableCell>
                      <TableCell>{user.ngayXuatNgu}</TableCell>
                      <TableCell>{user.quanHamCaoNhat}</TableCell>
                      <TableCell>{user.danhHieuDuocPhong}</TableCell>
                      <TableCell>{user.soTruongCongTac}</TableCell>
                      <TableCell>{user.khenThuong}</TableCell>
                      <TableCell>{user.kyLuat}</TableCell>
                      <TableCell>{user.tinhTrangSucKhoe}</TableCell>
                      <TableCell>{user.chieuCao}</TableCell>
                      <TableCell>{user.canNang}</TableCell>
                      <TableCell>{user.nhomMau}</TableCell>
                      <TableCell>{user.laThuongBinhHang}</TableCell>
                      <TableCell>{user.laConGiaDinhCS}</TableCell>
                      <TableCell>{user.soCMND}</TableCell>
                      <TableCell>{user.ngayCap}</TableCell>
                      <TableCell>{user.soBHXH}</TableCell>

                      <TableCell>{user.hanhDong}</TableCell>
                      <TableCell>
                        <IconButton size='small' onClick={() => handleViewDetails(user.id)}>
                          <Icon icon='mdi:eye-outline' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            <br></br>
            <Grid container spacing={2} style={{ padding: 10 }}>
              <Grid item xs={3}></Grid>
              <Grid item xs={1.5} style={{ padding: 0 }}>
                <IconButton onClick={handleOpenMenu}>
                  <Icon icon='tabler:selector' />
                  <p style={{ fontSize: 15 }}>{pageSize} dòng/trang</p>
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
