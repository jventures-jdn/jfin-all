import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// auto remove query parameter in url without pushing browser history
export function useUrlQueryRemover(queryParams: string[]) {
    const router = useRouter()
    useEffect(() => {
        const url = new URL(window.location.href)
        queryParams.forEach(param => url.searchParams.delete(param))
        const to = url.toString()
        if (to !== window.location.href) {
            router.replace(url.toString())
        }
    }, [])
    return null
}
