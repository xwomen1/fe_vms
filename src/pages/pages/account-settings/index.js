import { Grid } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'

const UserList = ({ apiData }) => {
  return (
    <Grid container spacing={6.5}>
      hi
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
