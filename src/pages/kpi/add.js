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
      <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>Thêm mới KPI</DialogTitle>
      <DialogContent>
        <TextField
          label='Mã KPI'
          type='text'
          fullWidth
          required
          error={!!errors.maKpi}
          helperText={errors.maKpi}
          style={{ marginBottom: '16px' }}
          value={maKpi}
          onChange={e => {
            setMaKpi(e.target.value)
            setErrors(prev => ({ ...prev, maKpi: '' }))
          }}
        />
        <TextField
          label='Tên KPI'
          type='text'
          fullWidth
          required
          error={!!errors.tenKpi}
          helperText={errors.tenKpi}
          style={{ marginBottom: '16px' }}
          value={tenKpi}
          onChange={e => {
            setTenKpi(e.target.value)
            setErrors(prev => ({ ...prev, tenKpi: '' }))
          }}
        />
        <TextField
          label='Mã mục tiêu'
          type='text'
          fullWidth
          required
          error={!!errors.maMucTieu}
          helperText={errors.maMucTieu}
          style={{ marginBottom: '16px' }}
          value={maMucTieu}
          onChange={e => {
            setMaMucTieu(e.target.value)
            setErrors(prev => ({ ...prev, maMucTieu: '' }))
          }}
        />
        <TextField
          label='Mục tiêu'
          type='text'
          fullWidth
          style={{ marginBottom: '16px' }}
          value={mucTieu}
          onChange={e => setMucTieu(e.target.value)}
        />
        <TextField
          label='Tần suất đo'
          select
          fullWidth
          required
          style={{ marginBottom: '16px' }}
          value={tanSuatDo}
          onChange={e => {
            setTanSuatDo(e.target.value)
            setErrors(prev => ({ ...prev, tanSuatDo: '' }))
          }}
        >
          <MenuItem value='Tháng'>Tháng</MenuItem>
          <MenuItem value='Quý'>Quý</MenuItem>
          <MenuItem value='Năm'>Năm</MenuItem>
        </TextField>

        <TextField
          label='Đơn vị đo'
          select
          fullWidth
          required
          style={{ marginBottom: '16px' }}
          value={tanSuatDo}
          onChange={e => {
            setDonViDo(e.target.value)
          }}
        >
          <MenuItem value='Điểm'>Điểm</MenuItem>
          <MenuItem value='Công việc'>Công việc</MenuItem>
          <MenuItem value='Hợp đồng'>Hợp đồng</MenuItem>
        </TextField>

        <TextField
          label='Chiều hướng tốt'
          select
          fullWidth
          style={{ marginBottom: '16px' }}
          value={chieuHuongTot}
          onChange={e => setChieuHuongTot(e.target.value)}
        >
          <MenuItem value='Tăng'>Tăng</MenuItem>
          <MenuItem value='Giảm'>Giảm</MenuItem>
        </TextField>
        <TextField
          label='Cách Đo lường'
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
