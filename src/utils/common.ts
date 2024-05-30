export const cache = (key: string, value?: any) => {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value))
    } else {
        value = localStorage.getItem(key)

        if (value) {
            value = JSON.parse(value)
        }

        return value
    }
}
