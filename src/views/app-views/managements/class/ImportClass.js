import React, { useState, useEffect } from "react";
import { Button, Card, Col, message, Row, Table, Tooltip, Upload } from "antd";
import { InboxOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import classService from "services/ClassService";
import { useHistory } from "react-router-dom";
import utils from "utils";
import { Typography } from 'antd';
import * as e from "antd";

const { Dragger } = Upload;
const { Title } = Typography;

const ImportClass = () => {
    const history = useHistory();
    const classAPI = classService();
    const [list, setList] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [classProfileVisible, setClassProfileVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState();
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);



    const importClass = async (file) => {
        if (!file || file.size === 0) {
            return message.error('File is empty or not selected');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await classAPI.importClass(formData);
            if (res) return message.success('Import class successfully');
            else return message.error('Import class: ', e.message);

        } catch (e) {
            console.error(e);
            return message.error('Import class: ', e.message);
        }
    }

    const deleteItem = async (id) => {
        try {
            setList(list.filter((item) => item.id !== id));
            return message.success('Delete successful');
        } catch (error) {
            console.error(error);
            message.error("Error deleting data: ");
        }
    }

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
        // { title: 'ID', dataIndex: 'id', sorter: (a, b) => utils.antdTableSorter(a, b, 'id') },
        { title: 'Mã lớp', dataIndex: '0' },
        { title: 'Tên lớp', dataIndex: '1' },
        { title: 'Cố vấn học tập', dataIndex: '2' },
        { title: 'Thông tin', dataIndex: '3'},
        {
            title: '',
            dataIndex: 'action',
            render: (_, elm) => (
                <div className="text-right">
                    <Tooltip title="View">
                        <Button type="primary" className="mr-2" icon={<EditOutlined />} onClick={() => editClass(elm.id)} size="small" />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button danger icon={<DeleteOutlined />} onClick={() => deleteItem(elm.id)} size="small" />
                    </Tooltip>
                </div>
            )
        }
    ];

    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows);
            setSelectedRowKeys(key);
        }
    }

    const props = {
        name: "file",
        multiple: false,
        beforeUpload(file) {
            const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isExcel) {
                message.error('You can only upload Excel files!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('File must be smaller than 2MB!');
                return false;
            }
            setFile(file);
            readExcel(file);
            return false;
        },
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

    const handleUploadClick = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const fileData = await classAPI.importClass(formData);
            if (fileData) {
                console.log(fileData);
                return message.success('Import class successfully');
            } else {
                message.error('Import upload failed.');
            }
        } catch (e) {
            console.log(e, 'error upload class', e.message);
            return message.error('Import class failed');
        }
    }

    const readExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setData(jsonData);
        };
        reader.readAsBinaryString(file);
    };

    const formattedData = data.map((item, index) => ({
        key: index,
        '0': item[0],
        '1': item[1],
        '2': item[2],
        '3': item[3],
    }));
    return (
        <Card>
            <div className="text-center mb-4">
                <h2 className="font-weight-semibold">Import data</h2>
                <br />
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                    </p>
                </Dragger>
                <Button type="primary" onClick={handleUploadClick} style={{ marginTop: 16 }}>
                    Upload
                </Button>
                <br />
                <Row type="flex" justify="center">
                    <Col sm={24} md={12} lg={8}>
                        <p>Import thành công 9 bản ghi</p>
                    </Col>
                </Row>
            </div>
            <Card>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={data}
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

export default ImportClass;
