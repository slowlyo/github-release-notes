import {Button, Form, Input, message, Modal, Space} from 'antd'
import {SettingOutlined} from '@ant-design/icons'
import {useState} from 'react'
import {useMount} from 'ahooks'
import {getDateTimeFormat, getFileName, getTemplate} from '../utils/template.ts'
import {cache} from '../utils/common.ts'

export const SettingPanel = () => {
    const [form] = Form.useForm()
    const [showModal, setShowModal] = useState<boolean>(false)

    const onFinish = () => {
        form.validateFields().then((values) => {
            cache('date_time_format', values.date_time_format)
            cache('file_name', values.file_name)
            cache('template', values.template)

            message.success('Settings saved successfully')
            setShowModal(false)
        })
    }

    useMount(() => {
        form.setFieldsValue({
            date_time_format: getDateTimeFormat(),
            file_name: getFileName(),
            template: getTemplate()
        })
    })

    return (
        <>
            <Button icon={<SettingOutlined/>} type="text" onClick={() => setShowModal(true)}></Button>
            <Modal title="Settings" centered open={showModal} onCancel={() => setShowModal(false)} footer={
                <Space>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button type="primary" onClick={() => onFinish()}>Save</Button>
                </Space>
            }>
                <Form form={form} layout="vertical">
                    <Form.Item label="DateTime Format"
                               name="date_time_format"
                               rules={[{required: true, message: 'Please input your DateTime Format!'}]}
                               tooltip={
                                   <>
                                       To format dates in data, use
                                       <a href="https://day.js.org/docs/en/display/format" target="_blank"> dayjs </a>
                                   </>
                               }>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Save File Name"
                               name="file_name"
                               rules={[{required: true, message: 'Please input your File Name!'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Template"
                               name="template"
                               rules={[{required: true, message: 'Please input your Template!'}]}
                               tooltip={
                                   <>
                                       <p>
                                           See
                                           <a href="https://docs.github.com/zh/rest/releases/releases?apiVersion=2022-11-28#list-releases"
                                              className="px-2"
                                              target="_blank">
                                               GitHub Document
                                           </a>
                                           for data format
                                       </p>
                                       <p>
                                           Use<span className="pl-2 text-blue-500">{'{key}'}</span> to get data
                                       </p>
                                       <p>
                                           You can get multi-dimensional data through the syntax of
                                           <span className="pl-2 text-blue-500">{'{parent.child}'}</span>
                                       </p>
                                       <p>
                                           Be like this:
                                           <p>{'{tag_name}'}</p>
                                           <p>{'{published_at}'}</p>
                                           <p>{'{author.login}'}</p>
                                       </p>
                                   </>
                               }>
                        <Input.TextArea rows={10}/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
