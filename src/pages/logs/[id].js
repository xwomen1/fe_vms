import { useRouter } from 'next/router'

import { useState, useEffect } from 'react'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Grid, IconButton, Button, Checkbox } from '@mui/material'
import Icon from 'src/@core/components/icon'

import Paper from '@mui/material/Paper'

import Link from 'next/link'

import Swal from 'sweetalert2'

const AssetTypeDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [assetType, setAssetType] = useState(null)
  const [readOnly, setReadOnly] = useState(true)
  const [params, setParams] = useState({})
  const [editing, setEditing] = useState(false)

  const [leaderOfUnit, setLeaderOfUnit] = useState('')
  const [showPlusColumn, setShowPlusColumn] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const handleNameChange = event => {
    setName(event.target.value)
  }

  const toggleEdit = () => {
    setReadOnly(false)
    setEditing(true)
    setShowPlusColumn(!showPlusColumn)
  }

  const handleCodeChange = event => {
    setCode(event.target.value)
  }

  const saveChanges = async () => {
    setReadOnly(true)
    setEditing(false)
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      await axios.put(
        `http://192.168.11.106:8089/smc/smart-parking/api/v0/asset/type/${id}`,
        {
          ...params,
          name: name,
          code: code
        },
        config
      )
      Swal.fire('Thành công!', 'Dữ liệu đã được cập nhật thành công.', 'success')
    } catch (error) {
      console.error('Error updating Asset type details:', error)
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật dữ liệu.', 'error')
    }
  }

  const fetchAssetData = async () => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const response = await axios.get(
        `http://192.168.11.106:8089/smc/smart-parking/api/v0/asset/type/find/${id}`,
        config
      )
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const token = localStorage.getItem(authConfig.storageTokenKeyName)

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        const response = await axios.get(
          `http://192.168.11.106:8089/smc/smart-parking/api/v0/asset/type/find/${id}`,
          config
        )
        setAssetType(response.data.data)
        setName(response.data.data.name)
        setCode(response.data.data.code)
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    }
    if (id) {
      fetchAssetData()
    }
  }, [id])

  const handleCancel = () => {
    fetchAssetData()
    setReadOnly(true)
    setEditing(false)
    setShowPlusColumn(!showPlusColumn)
    router.reload()

    setAssetType({
      ...assetType,
      fullName: '',
      email: ''
    })
  }
  console.log('param', params)

  return (
    <div>
      <div style={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid container spacing={2} item xs={12}>
            <IconButton size='small' component={Link} href={`/assetType`} sx={{ color: 'text.secondary' }}>
              <Icon icon='tabler:chevron-left' />
            </IconButton>
            <h2 style={{ color: 'black' }}>Thêm mới loại tài sản: </h2>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <div style={{ width: '80%' }}></div>
            <>
              {editing ? (
                <>
                  <Button variant='contained' onClick={saveChanges} sx={{ marginRight: '10px' }}>
                    Lưu
                  </Button>
                  <Button variant='contained' onClick={handleCancel}>
                    Huỷ
                  </Button>
                </>
              ) : (
                <Button variant='contained' onClick={toggleEdit}>
                  Chỉnh sửa
                </Button>
              )}
            </>
          </Grid>
          <Grid container item component={Paper} style={{ backgroundColor: 'white', width: '100%', padding: '10px' }}>
            <Grid item xs={5.8}>
              <CustomTextField
                label='Mã loại tài sản'
                InputProps={{ readOnly: readOnly }}
                value={code}
                onChange={handleCodeChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={0.4}></Grid>

            <Grid item xs={5.8}>
              <CustomTextField
                label='Loại tài sản'
                InputProps={{ readOnly: readOnly }}
                value={name}
                onChange={handleNameChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <br />
      </div>
    </div>
  )
}

export default AssetTypeDetail
