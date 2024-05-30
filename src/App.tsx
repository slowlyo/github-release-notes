import {Alert, Button, Card, Form, FormProps, Input, message, notification, Spin} from 'antd'
import {TokenTip} from './components/TokenTip.tsx'
import {fetchReleases} from './utils/request.ts'
import {useMount, useRequest} from 'ahooks'
import {CustomFormData, Release} from './global'
import {useState} from 'react'
import {ResultDrawer} from './components/ResultDrawer.tsx'
import {SettingPanel} from './components/SettingPanel.tsx'
import {cache} from './utils/common.ts'

export const App = () => {
    const [form] = Form.useForm()
    const [showResult, setShowResult] = useState(false)

    const {data, loading, runAsync} = useRequest(fetchReleases, {
        manual: true,
        onSuccess: (data: Release[] | undefined, params: [CustomFormData]) => {
            cache('cachedParams', params[0])

            message.success(`Found ${data?.length} releases`)

            setShowResult(true)
        },
        onError: (error) => {
            const errorData = JSON.parse(error.message)
            notification.open({
                type: 'error',
                message: errorData.message,
                description: <a href={errorData.documentation_url}
                                target="_blank"
                                className="text-blue-500">👉 {errorData.documentation_url}</a>,
                duration: 0
            })
        },
    })

    const onFinish: FormProps<CustomFormData>['onFinish'] = async (values) => {
        await runAsync(values)
        setShowResult(true)
    }

    useMount(() => {
        const cachedParams = cache('cachedParams')

        if (cachedParams) {
            form.setFieldsValue(cachedParams)

            message.success('Loaded cached data')
        }
    })

    return (
        <div className="flex h-screen w-screen justify-center items-center">
            <Spin spinning={loading}>
                <Card title="GitHub Release Notes" className="w-[32rem]" bordered={false} extra={<SettingPanel/>}>
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Owner"
                                   name="owner"
                                   rules={[{required: true, message: 'Please input your owner!'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Repo"
                                   name="repo"
                                   rules={[{required: true, message: 'Please input your repo!'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="GitHub Token"
                                   name="token"
                                   tooltip={<TokenTip/>}>
                            <Input/>
                        </Form.Item>
                        <Alert message="If the token is not configured, data may fail to be obtained" type="info"/>

                        <Form.Item className="flex justify-end mb-0 mt-6">
                            <Button type="primary" htmlType="submit">Search</Button>
                        </Form.Item>
                    </Form>
                </Card>
                <div className="flex justify-center py-3 text-gray-400">
                    If this project helps you, please give a
                    <a href="https://github.com/slowlyo/github-release-notes" target="_blank" className="px-2">star</a>
                    ⭐️
                </div>
            </Spin>

            <ResultDrawer open={showResult} onClose={() => setShowResult(false)} data={data}/>
        </div>
    )
}
