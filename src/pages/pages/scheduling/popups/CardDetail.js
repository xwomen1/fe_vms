import React, { useState, forwardRef } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Grid, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import axios from 'axios' // Import axios for API call
import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const CardIdentificationDialog = ({ show, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cardNumber: ''
    }
  })
  const [apiResult, setApiResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async data => {
    setLoading(true)
    setApiResult(null)

    try {
      const response = await axios.get(
        `https://dev-ivi.basesystem.one/smc/iam/api/v0/cards/detail?cardNum=${data.cardNumber}`
      )
      setApiResult(response.data)
    } catch (error) {
      console.error('API Error:', error.response?.data.message)
      toast.error(error.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={show} maxWidth='sm' fullWidth TransitionComponent={Transition} onClose={onClose}>
      <DialogTitle>Card Identification</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name='cardNumber'
              control={control}
              rules={{ required: 'Please enter a card number' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Enter card number'
                  variant='outlined'
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber ? errors.cardNumber.message : ''} // Show error message
                />
              )}
            />
          </Grid>
          <Grid item>
            <Button variant='contained' color='error' onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? 'Loading...' : 'VERIFY'}
            </Button>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 5,
            minHeight: '150px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          {apiResult ? (
            <Typography variant='body1'>
              <strong>Card Details:</strong>
              <pre>{JSON.stringify(apiResult, null, 2)}</pre>
            </Typography>
          ) : (
            <Typography variant='body1' color='textSecondary'>
              Enter a card number and press VERIFY to see details.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='error' onClick={onClose}>
          CANCEL
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit(onSubmit)} disabled={loading}>
          IDENTIFY
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CardIdentificationDialog
