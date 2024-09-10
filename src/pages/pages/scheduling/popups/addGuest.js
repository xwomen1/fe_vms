import { Box, Button, Checkbox, Fade, IconButton, styled } from "@mui/material"
import { forwardRef, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { getApi } from "src/@core/utils/requestUltils"
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

const AddGuest = ({ show, onClose, callback, guestSelected }) => {
    const [loading, setLoading] = useState(false)
    const [guests, setGuests] = useState([])
    const [selectedGuests, setSelectedGuests] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)

        try {
            const res = await getApi(`https://dev-ivi.basesystem.one/smc/iam/api/v0/guests?keyword=&page=1&limit=15`)
            setGuests(res?.data?.rows)
        } catch (error) {
            if (error && error?.response?.data) {
                console?.log('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.log('Error fetching date: ', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = () => {
        callback(selectedGuests)
        onClose()
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: 3 }}>
                <CustomAutocomplete
                    sx={{ width: 300 }}
                    multiple
                    options={guests}
                    id='autocomplete-checkboxes'
                    getOptionLabel={option => option.fullName}
                    renderInput={params => <CustomTextField
                        fullWidth
                        {...params}
                    />}
                    onChange={(event, selectedItems) => {
                        const newArr = []
                        for (let i = 0; i < selectedItems.length; i++) {
                            newArr.push(selectedItems[i])
                        }
                        setSelectedGuests(newArr)
                    }}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option?.id}>
                            <Checkbox checked={selected} sx={{ mr: 2 }} />
                            <ul style={{ listStyleType: 'none' }}>
                                <li>
                                    <p>{option.identityNumber}</p>
                                </li>
                                <li>
                                    <p style={{ opacity: 0.5 }}>{option.fullName}</p>
                                </li>
                            </ul>
                        </li>
                    )}
                />
                <Button
                    variant="contained"
                    onClick={() => {
                        onClose()
                    }}
                    sx={{ marginLeft: 2 }}
                >
                    Close
                </Button>
                <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => onSubmit()}>
                    Add
                </Button>
            </Box>
        </>
    )
}

export default AddGuest  