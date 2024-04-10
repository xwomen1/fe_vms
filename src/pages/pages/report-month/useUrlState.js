import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export function useUrlState(initialState) {
    const router = useRouter()
    const [state, setState] = useState(initialState)

    useEffect(() => {
        const { pathname, query } = router
        const newState = { ...initialState, ...query }
        setState(newState)
    }, [router])

    const setUrlState = (newState) => {
        const { pathname } = router

        const url = {
            pathname,
            query: { ...router.query, ...newState }
        }

        router.push(url, undefined, { shallow: true })
    }

    const incrementPage = () => {
        setUrlState({ page: (parseInt(state.page) || 0) + 1 })
    }


    return [state, setUrlState, incrementPage]
}
