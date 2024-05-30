import {Button, Drawer, Space} from 'antd'
import {Release} from '../global'
import Markdown from 'react-markdown'
import 'github-markdown-css/github-markdown.css'
import {replaceTemplate, saveAsFile} from '../utils/template.ts'

export const ResultDrawer = ({open, onClose, data}: {
    open: boolean,
    onClose: () => void,
    data: Release[] | undefined
}) => {
    return (
        <>
            <Drawer title={'Release Notes'}
                    size="large"
                    open={open}
                    onClose={onClose}
                    maskClosable={false}
                    extra={
                        <Space>
                            <Button type="primary" onClick={() => saveAsFile(data)}>Save as file</Button>
                        </Space>
                    }
            >
                <Markdown className="markdown-body">
                    {data?.map((release) => replaceTemplate(release)).join('\n')}
                </Markdown>
            </Drawer>
        </>
    )
}
