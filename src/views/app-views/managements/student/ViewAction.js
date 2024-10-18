import React, {useEffect, useState} from "react";
import {Button, Card, Col, Input, Menu, message, Modal, Row, Select, Table, Tooltip, Upload} from "antd";
import {
    UploadOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import studentService from "../../../../services/StudentService";
import {useHistory, useLocation} from "react-router-dom";
import utils from "utils";
import { Typography } from 'antd';
import {endPointAPI} from "constants/endPointAPI";
import EditStudent from "./EditStudent";

const { Title, Text } = Typography;

const { Option } = Select

const ViewAction = () => {
    let history = useHistory();
    const studentAPI = studentService();
    const [list, setList] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [studentProfileVisible, setStudentProfileVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState();

    const location = useLocation();
    const { res } = location.state || {};
    const ids = Array.isArray(res) ? res.map((item) => item.id) : [];
    //Student API

    useEffect(() => {
        const fetchData = async () => {
            console.log(ids)
            const response = await studentAPI.showStudentList(ids);
            setList(response);
        }
        fetchData();
    }, []);

    // delete
    const deleteItem = async (id) => {
        try {
            await studentAPI.deleteStudent(id);
            setList(list.filter((item) => item.id !== id));
            return message.success('Delete successful');
        } catch (error) {
            console.error(error);
            message.error("Error deleting data: ");
        }
    }

    //Edit
    const editStudent = (id) => {
        setStudentProfileVisible(true);
        setSelectedStudent(id);
    };

    const closeEditStudent = async () => {
        const response = await studentAPI.showStudentList(ids);
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
                <div className="text-right">
                    <Tooltip title="View">
                        <Button type="primary" className="mr-2" icon={<EditOutlined />} onClick={() => editStudent(elm.id)} size="small"/>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button danger icon={<DeleteOutlined />} onClick={()=> {deleteItem(elm.id)}} size="small"/>
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
        action: process.env.REACT_APP_API_URL + endPointAPI.ADMIN.STUDENT.IMPORT_EXCEL_DATA,
        onChange({ file, fileList }) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
        },
    };

    return (

        <Card>
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="font-weight-semibold">Danh sách sao chép nhiều của lớp thành phần</h2>
                    <br></br>
                    <br></br>
                    <Row type="flex" justify="center">
                        <Col sm={24} md={12} lg={8}>
                            <p>
                                Sao chép thành công {ids.length} bản ghi
                            </p>
                        </Col>
                    </Row>
                </div>
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
            <EditStudent id={ selectedStudent} visible={studentProfileVisible} close={() => (closeEditStudent())}/>
        </Card>
    )
}

export default ViewAction;