import React, {useEffect, useState} from "react";
import {Button, Card, Col, Input, message, Row, Select, Table, Tooltip, Upload} from "antd";
import {
    InboxOutlined,
    EditOutlined,
    DeleteOutlined, PlusCircleOutlined,
    ExportOutlined, ImportOutlined, CopyOutlined,
    FileExcelOutlined, FileTextOutlined, SearchOutlined,
} from "@ant-design/icons";
import classService from "services/ClassService";
import {useHistory, useLocation} from "react-router-dom";
import utils from "utils";
import { Typography } from 'antd';
import {endPointAPI} from "constants/endPointAPI";
import Flex from "../../../../components/shared-components/Flex";
const { Dragger } = Upload;

const { Title, Text } = Typography;

const { Option } = Select

const ExportClass = () => {
    let history = useHistory();
    const classAPI = classService();
    const [list, setList] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [classProfileVisible, setClassProfileVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState();


    const location = useLocation();
    const { data } = location.state || { data: [] };

    useEffect(() => {
        if (data && data.length > 0) {
            setList(data);
        }
    }, []);

    //export
    const exportCSV = async () => {
        try {
            const dataExport = selectedRowKeys;
            const fileData = await classAPI.exportCSV(dataExport);

            if (fileData) {
                const url = window.URL.createObjectURL(new Blob([fileData]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'class.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download the file');
            }
        } catch (e) {
            console.error('Export error', e);
            message.error('Export class error');
        }
    }

    const exportXLSX = async () => {
        try {
            const dataExport = selectedRowKeys;
            const fileData = await classAPI.exportXLSX(dataExport);

            if (fileData) {
                const url = window.URL.createObjectURL(new Blob([fileData]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'class.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download the file');
            }
        } catch (e) {
            console.error('Export error', e);
            message.error('Export class error');
        }
    }

    const action = [
        { label: '.csv', icon: <FileExcelOutlined />, event:  exportCSV },
        { label: '.xlsx', icon: <FileExcelOutlined />, event: exportXLSX },
        { label: '.json', icon: <FileTextOutlined />, event: () => console.log('file .json') },
    ];

    const [selectedAction, setSelectedAction] = useState(null);

    const handleSelectChange = (value) => {
        const actionItem = action.find(act => act.label === value);
        setSelectedAction(actionItem);
    };

    const handleButtonClick = () => {
        if (selectedAction && selectedAction.event) {
            selectedAction.event();
        } else {
            message.info('No action selected')
        }
    };

    //Edit
    const editClass = (id) => {
        setClassProfileVisible(true);
        setSelectedClass(id);
    };

    const closeEditClass = async () => {
        const response = await classAPI.getListClass();
        setList(response);
        setClassProfileVisible(false);
        setSelectedClass(null);
    };

    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id')
        },
        {
            title: 'Mã lớp',
            dataIndex: 'code',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'code')
        },
        {
            title: 'Tên lớp',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        },
        {
            title: 'Cố vấn học tập',
            dataIndex: 'mentor',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'mentor')
        },
        {
            title: 'Thông tin',
            dataIndex: 'description',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
        },
        {
            title: '',
            dataIndex: 'action',
            render: (_, elm) => (
                <div className="text-right">
                    <Tooltip title="View">
                        <Button type="primary" className="mr-2" icon={<EditOutlined />} onClick={() => editClass(elm.id)} size="small"/>
                    </Tooltip>
                </div>
            )
        }
    ];

    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    }

    const props = {
        name: "file",
        multiple: false,
        action: process.env.REACT_APP_API_URL + endPointAPI.ADMIN.CLASS.IMPORT_EXCEL_DATA,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const fileData = await classAPI.importClass(formData);
            console.log(fileData)
            return message.success('Import class successfully');
        } catch (e) {
            console.log(e, 'error upload class', e.message);
            return message.error('Import class failed');
        }
    }

    return (
        <Card>
            <div className="text-center mb-4">
                <h2 className="font-weight-semibold">Export data</h2>
                <br></br>
                <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
                    <Flex className="mb-1" mobileFlex={false}>
                        <div className="mr-md-3 mb-3">
                            <Select
                                defaultValue="Select"
                                className="w-100"
                                style={{minWidth: 120}}
                                onChange={handleSelectChange}
                            >
                                <Option value="Select">Select</Option>
                                {
                                    action.map(elm => (
                                        <Option value={elm.label} key={elm.label}>
                                            {elm.icon}
                                            <span className="ml-2">{elm.label}</span>
                                        </Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="mr-md-3">
                            <Button onClick={handleButtonClick} type="primary" icon={<ExportOutlined/>}>
                                Export
                            </Button>
                        </div>
                    </Flex>
                </Flex>
                {/*<Row type="flex" justify="center">*/}
                {/*    <Col sm={24} md={12} lg={8}>*/}
                {/*        <p>*/}
                {/*            Import thành công 9 bản ghi*/}
                {/*        </p>*/}
                {/*    </Col>*/}
                {/*</Row>*/}

            </div>
            <Card>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        rowKey='id'
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: 'checkbox',
                            preserveSelectedRowKeys: false,
                            ...rowSelection,
                        }}
                    />
                </div>
            </Card>
        </Card>
    )
}

export default ExportClass;