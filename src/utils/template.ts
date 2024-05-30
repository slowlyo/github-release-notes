import {Release} from '../global'
import dayjs from 'dayjs'
import {cache} from './common.ts'

const defaultTemplate = `# {tag_name}

> {published_at} 

{body}

[View on GitHub]({html_url})

`

const defaultDateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
const defaultFileName = 'CHANGELOG.md'

export const getTemplate = () => {
    return cache('template') || defaultTemplate
}

export const getDateTimeFormat = () => {
    return cache('date_time_format') || defaultDateTimeFormat
}

export const getFileName = () => {
    return cache('file_name') || defaultFileName
}

export const replaceTemplate = (data: Release) => {
    data = <Release>dot(data)
    let result = getTemplate()
    Object.keys(data).forEach(key => {
        let value = data[key as keyof Release] as string

        if (dayjs(value).isValid()) {
            value = dayjs(value).format(getDateTimeFormat())
        }

        result = result.replaceAll(`{${key}}`, value)
    })
    return result
}

const dot = (array: Record<string, any>, prepend: string = ''): Record<string, any> => {
    let results: Record<string, any> = {}

    for (const key in array) {
        if (Object.prototype.hasOwnProperty.call(array, key)) {
            const value = array[key]
            if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0) {
                results = {...results, ...dot(value, prepend + key + '.')}
            } else {
                results[prepend + key] = value
            }
        }
    }

    return results
}

export const saveAsFile = (data: Release[] | undefined) => {
    const content = data?.map(item => replaceTemplate(item)).join('\n') || ''

    const blob = new Blob([content], {type: 'text/plain'})

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = getFileName()
    link.click()
    URL.revokeObjectURL(link.href)
    link.remove()
}
