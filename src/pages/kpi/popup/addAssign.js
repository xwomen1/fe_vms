import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material'

const AddPopup = ({ open, onClose, onAddNewKpi }) => {
  const [maKpi, setMaKpi] = useState('')
  const [tenKpi, setTenKpi] = useState('')
  const [maMucTieu, setMaMucTieu] = useState('')
  const [mucTieu, setMucTieu] = useState('')
  const [tanSuatDo, setTanSuatDo] = useState('')
  const [donViDo, setDonViDo] = useState('')
  const [chieuHuongTot, setChieuHuongTot] = useState('')
  const [doLuong, setDoLuong] = useState('')

  const [errors, setErrors] = useState({})

  const validateFields = () => {
    let tempErrors = {}
    if (!maKpi) tempErrors.maKpi = 'Mã KPI là bắt buộc'
    if (!tenKpi) tempErrors.tenKpi = 'Tên KPI là bắt buộc'
    if (!maMucTieu) tempErrors.maMucTieu = 'Mã mục tiêu là bắt buộc'
    setErrors(tempErrors)

    return Object.keys(tempErrors).length === 0
  }

  const handleAdd = () => {
    if (validateFields()) {
      const newKpi = {
        maKpi,
        tenKpi,
        maMucTieu,
        mucTieu,
        tanSuatDo,
        donViDo,
        chieuHuongTot,
        doLuong
      }
      onAddNewKpi(newKpi)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>Chọn bộ KPI áp dụng cho nhân viên</DialogTitle>
      <DialogContent>
        <TextField
          label='Bộ KPI'
          select
          fullWidth
          style={{ marginBottom: '16px' }}
          value={chieuHuongTot}
          onChange={e => setChieuHuongTot(e.target.value)}
        >
          <MenuItem value='Tăng'>Đánh giá nhân viên kinh doanh</MenuItem>
          <MenuItem value='Công việc'>Đánh giá nhân viên kỹ thuật</MenuItem>
          <MenuItem value='Công việc1'>Đánh giá nhân viên bảo hiểm </MenuItem>
          <MenuItem value='Công việc2'>Đánh giá nhân viên kế toán</MenuItem>
          <MenuItem value='Công việc3'>Đánh giá nhân viên logistic</MenuItem>{' '}
        </TextField>
        <TextField
          label='Thông tin bộ KPI'
          type='text'
          fullWidth
          style={{ marginBottom: '16px' }}
          value={doLuong}
          onChange={e => setDoLuong(e.target.value)}
        />
      </DialogContent>
      <DialogActions style={{ display: 'flex' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddPopup
