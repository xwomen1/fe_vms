// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import Table from 'src/views/apps/roles/Table'
import RoleCards from 'src/views/apps/roles/RoleCards'
import { Button } from '@mui/material'

const RolesComponent = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Grid>
            <Button variant='contained'>Quản lý phân quyền</Button>
          </Grid>
        }
        subtitle={<Typography sx={{ color: 'text.secondary' }}></Typography>}
      />
      <Grid item xs={12}>
        <RoleCards />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  )
}

export default RolesComponent
