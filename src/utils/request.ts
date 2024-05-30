import {CustomFormData, Release} from '../global'

const BaseUrl = 'https://api.github.com'
const pageSize = 100

const fetchRelease = async (params: CustomFormData, page: number) => {
    const {token, owner, repo} = params
    const url = `${BaseUrl}/repos/${owner}/${repo}/releases?page=${page}&per_page=${pageSize}`
    const headers: Record<string, string> = {'X-GitHub-Api-Version': '2022-11-28'}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {headers})

    return await response.json()
}

export const fetchReleases = async (params: CustomFormData) => {
    let page = 1
    const releases: Release[] = []

    while (page) {
        const release = await fetchRelease(params, page)
        if (release?.message) {
            throw new Error(JSON.stringify(release))
        }

        releases.push(...release)
        if (release.length < pageSize) {
            break
        }

        page++
    }

    return releases
}
