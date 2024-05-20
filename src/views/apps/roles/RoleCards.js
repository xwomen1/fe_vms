import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Box, Grid, Card, Button, Avatar, Dialog, Tooltip, Checkbox, TableRow, TableBody, TableCell, TableHead,
  IconButton, Typography, FormControl, DialogTitle, AvatarGroup, CardContent, DialogActions, DialogContent,
  TableContainer, FormControlLabel, Table
} from '@mui/material';
import Icon from 'src/@core/components/icon';
import CustomTextField from 'src/@core/components/mui/text-field';

const RolesCards = () => {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('Add');
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false);
  const [rolesArr, setRolesArr] = useState([]);
  const [policy, setPolicy] = useState([]);
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    const fetchDataPolicies = async () => {
      try {
        const token = localStorage.getItem('authConfig.storageTokenKeyName');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('https://dev-ivi.basesystem.one/smc/iam/api/v0/policies', config);
        const policies = response.data;
        setPolicy(policies);
  
        const userCounts = {};
        for (const policy of policies) {
          console.log(policy)
          if (policy.policyId) {
            const userResponse = await axios.get(`https://dev-ivi.basesystem.one/smc/iam/api/v0/users/search?policyIds=${policy.policyId}`, config);
            console.log(userResponse.data.count)
            userCounts[policy.policyId] = userResponse.data.count;
          } else {
            console.error('Policy ID is undefined:', policy);
          }
        }
        setUserCounts(userCounts);
        console.log(userCounts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataPolicies();
  }, []);
  

  useEffect(() => {
    setIsIndeterminateCheckbox(selectedCheckbox.length > 0 && selectedCheckbox.length < rolesArr.length * 3);
  }, [selectedCheckbox, rolesArr]);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedCheckbox([]);
    setIsIndeterminateCheckbox(false);
  };

  const togglePermission = id => {
    const newArr = selectedCheckbox.includes(id)
      ? selectedCheckbox.filter(checkbox => checkbox !== id)
      : [...selectedCheckbox, id];
    setSelectedCheckbox(newArr);
  };

  const handleSelectAllCheckbox = () => {
    if (isIndeterminateCheckbox) {
      setSelectedCheckbox([]);
    } else {
      const allPermissions = rolesArr.flatMap(role => {
        const id = role.toLowerCase().split(' ').join('-');
        
return [`${id}-read`, `${id}-write`, `${id}-create`];
      });
      setSelectedCheckbox(allPermissions);
    }
  };

  const renderCards = () =>
    policy.map((item, index) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>{`Total ${userCounts[item.policyId] || 0} users`}</Typography>
              <AvatarGroup
                max={4}
                className='pull-up'
                sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: theme => theme.typography.body2.fontSize } }}
              >
                {item.avatars?.map((img, index) => (
                  <Avatar key={index} alt={item.title} src={`/images/avatars/${img}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant='h4' sx={{ mb: 1 }}>{item.policyName}</Typography>
                <Typography
                  href='/'
                  component={Link}
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                  onClick={e => {
                    e.preventDefault();
                    handleClickOpen();
                    setDialogTitle('Edit');
                  }}
                >
                  Edit Role
                </Typography>
              </Box>
              <IconButton size='small' sx={{ color: 'text.disabled' }}>
                <Icon icon='tabler:copy' />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card sx={{ cursor: 'pointer' }} onClick={() => {
          handleClickOpen();
          setDialogTitle('Add');
        }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box sx={{ height: '100%', minHeight: 140, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img height={122} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent sx={{ pl: 0, height: '100%' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Button variant='contained' sx={{ mb: 3, whiteSpace: 'nowrap' }} onClick={() => {
                    handleClickOpen();
                    setDialogTitle('Add');
                  }}>
                    Add New Role
                  </Button>
                  <Typography sx={{ color: 'text.secondary' }}>Add role, if it doesn't exist.</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${dialogTitle} Role`}</Typography>
          <Typography color='text.secondary'>Set Role Permissions</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField fullWidth label='Role Name' placeholder='Enter Role Name' />
            </FormControl>
          </Box>
          <Typography variant='h4'>Role Permissions</Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box sx={{
                      display: 'flex', whiteSpace: 'nowrap', alignItems: 'center', textTransform: 'capitalize',
                      '& svg': { ml: 1, cursor: 'pointer' }, color: theme => theme.palette.text.secondary,
                      fontSize: theme => theme.typography.h6.fontSize
                    }}>
                      Administrator Access
                      <Tooltip placement='top' title='Allows a full access to the system'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='tabler:info-circle' fontSize='1.25rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={3}>
                    <FormControlLabel
                      label='Select All'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize', color: 'text.secondary' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={selectedCheckbox.length === rolesArr.length * 3}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rolesArr.map((role, index) => {
                  const id = role.toLowerCase().split(' ').join('-');
                  
return (
                    <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', fontSize: theme => theme.typography.h6.fontSize }}>
                        {role}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Read'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}-read`}
                              onChange={() => togglePermission(`${id}-read`)}
                              checked={selectedCheckbox.includes(`${id}-read`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Write'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}-write`}
                              onChange={() => togglePermission(`${id}-write`)}
                              checked={selectedCheckbox.includes(`${id}-write`)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label='Create'
                          sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                          control={
                            <Checkbox
                              size='small'
                              id={`${id}-create`}
                              onChange={() => togglePermission(`${id}-create`)}
                              checked={selectedCheckbox.includes(`${id}-create`)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button type='submit' variant='contained' onClick={handleClose}>
              Submit
            </Button>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RolesCards
