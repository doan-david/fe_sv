import React, {useEffect, useState} from "react";
import {Button, Card, Col, Input, message, Row, Select, Table, Tooltip, Upload} from "antd";
import {
    InboxOutlined,
    EditOutlined,
    DeleteOutlined, PlusCircleOutlined,
    ExportOutlined, ImportOutlined, CopyOutlined,
    FileExcelOutlined, FileTextOutlined, SearchOutlined,
} from "@ant-design/icons";
import studentService from "services/StudentService";
import {useHistory, useLocation} from "react-router-dom";
import utils from "utils";
import { Typography } from 'antd';
import {endPointAPI} from "constants/endPointAPI";
import Flex from "../../../../components/shared-components/Flex";
const { Dragger } = Upload;

const { Title, Text } = Typography;

const { Option } = Select

const ExportStudent = () => {
    let history = useHistory();
    const studentAPI = studentService();
    const [list, setList] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [studentProfileVisible, setStudentProfileVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState();


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
            const fileData = await studentAPI.exportCSV(dataExport);

            if (fileData) {
                const url = window.URL.createObjectURL(new Blob([fileData]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'student.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download the file');
            }
        } catch (e) {
            console.error('Export error', e);
            message.error('Export student error');
        }
    }

    const exportXLSX = async () => {
        try {
            const dataExport = selectedRowKeys;
            const fileData = await studentAPI.exportXLSX(dataExport);

            if (fileData) {
                const url = window.URL.createObjectURL(new Blob([fileData]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'student.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download the file');
            }
        } catch (e) {
            console.error('Export error', e);
            message.error('Export student error');
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
    const editStudent = (id) => {
        setStudentProfileVisible(true);
        setSelectedStudent(id);
    };

    const closeEditStudent = async () => {
        const response = await studentAPI.getListStudent();
        setList(response);
        setStudentProfileVisible(false);
        setSelectedStudent(null);
    };

    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id')
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'code',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'code')
        },
        {
            title: 'Tên sinh viên',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        },
        {
            title: 'Họ và tên đệm',
            dataIndex: 'username',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id')
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id')
        },
        {
            title: '',
            dataIndex: 'action',
            render: (_, elm) => (
                <div studentName="text-right">
                    <Tooltip title="View">
                        <Button type="primary" studentName="mr-2" icon={<EditOutlined />} onClick={() => editStudent(elm.id)} size="small"/>
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
            const fileData = await studentAPI.importStudent(formData);
            console.log(fileData)
            return message.success('Import student successfully');
        } catch (e) {
            console.log(e, 'error upload student', e.message);
            return message.error('Import student failed');
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

export default ExportStudent;