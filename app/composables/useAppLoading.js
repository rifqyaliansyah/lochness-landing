import { ref } from 'vue'

const isAppLoading = ref(true)

export function useAppLoading() {

    const startLoading = () => {
        isAppLoading.value = true
    }

    const finishLoading = () => {
        isAppLoading.value = false
    }

    return {
        isAppLoading,
        startLoading,
        finishLoading
    }
}