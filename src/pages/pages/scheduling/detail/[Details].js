import { useRouter } from 'next/router'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { CircularProgress } from '@material-ui/core'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import FileUploader from 'devextreme-react/file-uploader'
import Link from 'next/link'
import {
  Box,
  Button,
  Card,
  Switch,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Tab,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Input
} from '@mui/material'

const Details = () => {
  const classes = useStyles()
  const router = useRouter()
  const id = router.query.Details
  console.log(id, id)

  return (
    <>
      <Grid>s</Grid>
    </>
  )
}

export default Details
