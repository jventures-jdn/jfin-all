import { usePathname, useRouter } from 'next/navigation'

export function useNavigator() {
    const currentPath = usePathname()
    const router = useRouter()

    const getPoppedPath = (pathPop?: number) =>
        currentPath
            ?.split('/')
            .slice(0, -(pathPop || 1))
            .join('/') || '/'

    const popPath = (pathPop?: number, replace?: boolean) => {
        const newPath = getPoppedPath(pathPop)
        replace ? router.replace(newPath) : router.push(newPath)
    }

    return {
        getPoppedPath,
        popPath,
    }
}
