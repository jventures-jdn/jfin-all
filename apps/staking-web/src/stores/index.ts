import ModalStore from './ModalStore'

const currentEnvironment = process.env.NETWORK
const modalStore = new ModalStore()

export const getCurrentEnv = () => {
    return currentEnvironment
}
export const useModalStore = () => modalStore
