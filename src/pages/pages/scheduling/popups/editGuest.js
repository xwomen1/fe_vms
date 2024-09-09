import { Box, Button, Card, Dialog, DialogActions, DialogContent, Fade, Grid, IconButton, styled, Typography } from "@mui/material"
import { forwardRef, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Icon from 'src/@core/components/icon'
import CustomAutocomplete from "src/@core/components/mui/autocomplete"
import CustomTextField from "src/@core/components/mui/text-field"

const Transition = forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />
})

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        transform: 'translate(7px, -5px)'
    }
}))

const format_form = [
    {
        name: 'identityNumber',
        label: 'Identity Number',
        placeholder: 'Identity Number',
        type: 'TextField',
        data: [],
        disabled: true,
        require: false,
        width: 6
    },
    {
        name: 'fullName',
        label: 'Guest Name',
        placeholder: 'Guest Name',
        type: 'TextField',
        data: [],
        disabled: false,
        require: true,
        width: 6
    },
    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeholder: 'Phone Number',
        type: 'TextField',
        data: [],
        disabled: false,
        require: true,
        width: 6
    },
    {
        name: 'address',
        label: 'Address/Company',
        placeholder: 'Address/Company',
        type: 'TextField',
        data: [],
        disabled: false,
        require: false,
        width: 6
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Email',
        type: 'TextField',
        data: [],
        disabled: false,
        require: false,
        width: 6
    },
    {
        name: 'gender',
        label: 'Gender',
        placeholder: 'Gender',
        type: 'Autocomplete',
        data: [
            { id: 'MALE', name: 'Male' },
            { id: 'FEMALE', name: 'Female' },
            { id: 'OTHER', name: 'Other' }
        ],
        disabled: false,
        require: false,
        width: 6
    },
]

const initValues = {
    accessCode: null,
    identityNumber: null,
    fullName: null,
    phoneNumber: null,
    address: null,
    isRepresentation: null,
    email: null,
    id: null,
    documentFileId: null,
    gender: null,
    guestId: null
}

const EditGuest = ({ show, onClose, data, callback }) => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState(format_form)
    const [detail, setDetail] = useState(null)

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: initValues
    })

    useEffect(() => {
        if (detail) {
            setDetailFormValue()
        }
    }, [detail])

    const setDetailFormValue = () => {
        reset(detail)
    }

    useEffect(() => {
        setDetail(data)
    }, [data])

    const onSubmit = values => {
        const details = {
            ...values,
            gender: values?.gender?.id
        }
        callback(details)
        onClose()
    }

    return (
        <Card>
            <Dialog
                fullWidth
                open={show}
                maxWidth='sm'
                scroll='body'
                onClose={onClose}
                TransitionComponent={Transition}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <DialogContent
                    sx={{
                        px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
                        py: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(5)} !important`]
                    }}
                >
                    <CustomCloseButton onClick={onClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                    <Box sx={{ mb: 4, textAlign: 'left' }}>
                        <Typography variant='h4' sx={{ mb: 3 }}>
                            Edit guest information
                        </Typography>
                    </Box>

                    <form>
                        <Grid container spacing={2}>
                            {form.map((item, index) => {
                                if (item.type === 'TextField') {

                                    return (
                                        <Grid item xs={item.width} key={index}>
                                            <Controller
                                                name={item.name}
                                                control={control}
                                                rules={{ required: item.require }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomTextField
                                                        label={
                                                            item.require === true ? item.label + ' *' : item.label
                                                        }
                                                        placeholder={item.placeholder}
                                                        value={value}
                                                        onChange={(e) => {
                                                            onChange(e.target.value)
                                                        }}
                                                        disabled={item.disabled}
                                                        error={Boolean(errors[item.name])}
                                                        aria-describedby='validation-basic-last-name'
                                                        {...(errors[item.name] && { helperText: 'This field is required' })}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    )
                                }
                                if (item.type === 'Autocomplete') {

                                    return (
                                        <Grid item xs={item.width} key={index}>
                                            <Controller
                                                name={item.name}
                                                control={control}
                                                rules={{ required: item.require }}
                                                render={({ field: { value, onChange } }) => (
                                                    <CustomAutocomplete
                                                        fullWidth
                                                        value={value}
                                                        options={item.data}
                                                        onChange={(e, selectedItem) => {
                                                            onChange(selectedItem)
                                                        }}
                                                        id='autocomplete-controlled'
                                                        getOptionLabel={option => option.name || option}
                                                        renderInput={params =>
                                                            <CustomTextField
                                                                {...params}
                                                                label={item.label}
                                                                error={Boolean(errors[item.name])}
                                                                aria-describedby='validation-basic-last-name'
                                                                {...(errors[item.name] && { helperText: 'This field is required' })}
                                                            />
                                                        }
                                                    />
                                                )
                                                }
                                            />
                                        </Grid>
                                    )
                                }
                            })}
                        </Grid>
                    </form>

                </DialogContent>
                <DialogActions
                    sx={{
                        px: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(10)} !important`],
                        py: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(5)} !important`]
                    }}
                >
                    <Button variant='contained' color='secondary' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='contained' onClick={handleSubmit(onSubmit)}>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default EditGuest