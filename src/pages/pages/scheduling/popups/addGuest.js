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
    const [page, setPage] = useState(1)
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        fetchData()
    }, [page, keyword])

    const fetchData = async () => {
        setLoading(true)

        try {
            const res = await getApi(`https://dev-ivi.basesystem.one/smc/iam/api/v0/guests?keyword=${keyword}&page=${page}&limit=15`)
            setGuests(prevGuests => [...prevGuests, ...res?.data?.rows])
        } catch (error) {
            if (error && error?.response?.data) {
                console?.log('error', error)
                toast.error(error?.response?.data?.message)
            } else {
                console.log('Error fetching data: ', error)
                toast.error(error)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target
        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
            setPage(prevPage => prevPage + 1)
        }
    }

    const onSubmit = () => {
        callback(selectedGuests)
        onClose()
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: 3 }}>
            <CustomAutocomplete
                sx={{ width: 300, maxHeight: 300, overflow: 'auto' }}
                multiple
                options={guests}
                id='autocomplete-checkboxes'
                getOptionLabel={option => option.fullName}
                renderInput={params => (
                    <CustomTextField
                        fullWidth
                        {...params}
                        onChange={e => {
                            setGuests([]);
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                    />
                )}
                onChange={(event, selectedItems) => {
                    setSelectedGuests(selectedItems)
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
                ListboxProps={{
                    onScroll: handleScroll,
                }}
            />
            <Button
                variant="contained"
                onClick={() => onClose()}
                sx={{ marginLeft: 2 }}
            >
                Close
            </Button>
            <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => onSubmit()}>
                Add
            </Button>
        </Box>
    )
}

export default AddGuest
