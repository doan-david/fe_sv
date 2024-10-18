import React, {useCallback, useEffect, useState} from "react";
import {
    Button,
    Card,
    Col, Dropdown,
    Input,
    Menu,
    message,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Table,
    Tooltip,
    Upload,
    Checkbox,
} from "antd";
import {
    UploadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CopyOutlined,
    SearchOutlined,
    FilterOutlined,
    PlusCircleOutlined,
    ImportOutlined,
    ExportOutlined
} from "@ant-design/icons";
import classService from "services/ClassService";
import {useHistory, useLocation} from "react-router-dom";
import utils from "utils";
import { Typography } from 'antd';
import {endPointAPI} from "constants/endPointAPI";
import EditClass from './EditClass';
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import Flex from "../../../../components/shared-components/Flex";
import {debounce, isUndefined} from "lodash";

const { Title, Text } = Typography;

const { Option } = Select
const { confirm } = Modal;

const ViewAction = () => {
    let history = useHistory();
    const classAPI = classService();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [classProfileVisible, setClassProfileVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState();

    const [selectedTotal, setSelectedTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [current, setCurrent] = useState(10);
    const [dataSearch, setDataSearch] = useState('');
    const [selectedSorter, setSelectedSorter] = useState({});
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedCodes, setSelectedCodes] = useState([]);

    const location = useLocation();
    const { res } = location.state || {};
    const codes = Array.isArray(res) ? res.map((item) => item.code) : [];
    // setSelectedCodes(codes);
    //api
    useEffect(() => {
        getList(selectedSorter, dataSearch);
    }, [currentPage, current, selectedSorter])

    // console.log(codes)

    const getList = async (sorter, value) => {
        try {
            // console.log(setSelectedCodes)
            setLoading(true);
            let res;
            if (isUndefined(sorter.order)) {
                sessionStorage.clear();
                sorter.order = 'desc';
                sorter.field = 'updated_at';
            } else {
                if (sorter.order === 'ascend') {
                    sorter.order = 'asc';
                } else if (sorter.order === 'descend') {
                    sorter.order = 'desc';
                }
            }

            res = await classAPI.showClassListByCode(currentPage, current, sorter.order, sorter.field, value, codes);

            if (res) {
                const existingData = JSON.parse(sessionStorage.getItem('classList')) || [];

                const newData = existingData.filter(newItem => {
                    return !res.data.some(existingItem => existingItem.id === newItem.id);
                });

                const updatedData = [...res.data, ...newData];

                // updatedData.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                sessionStorage.setItem('classList', JSON.stringify(updatedData));

                setList(updatedData);
                setSelectedTotal(res.total);
            } else {
                message.error('Error data');
            }
        } catch (error) {
            history.push(`/auth/error-1`);
        } finally {
            setLoading(false);
        }
    }

    const onShowSizeChange = (current, pageSize) => {
        setLoading(true);
        setCurrent(pageSize);

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const onChangePage = (page) => {
        setLoading(true);
        setCurrentPage(page);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    //search
    function onSearch(e) {
        const value = e.currentTarget.value;
        setDataSearch(value);
        debounceGetList(selectedSorter, value);
    }

    const debounceGetList = useCallback(debounce((selectedSorter, value) => getList(selectedSorter, value), 1000), []);

    //sort
    const onChangeSort = (pagination, filters, sorter) => {
        setSelectedSorter(sorter);
    }

    //copy
    const record = (id) => {
        confirm({
            title: 'Do you want to copy?',
            onOk: async () => {
                try {
                    const res = await classAPI.record(id);
                    if (res) {
                        setClassProfileVisible(true);
                        setSelectedClass(res.data.id);
                        message.success('Copying successful');
                    } else {
                        message.error('Error copying res');
                    }
                } catch (error) {
                    message.error('Error copying catch');
                }
            },
            onCancel() {
                message.info('Copying cancelled');
            },
        });
    }

    // copy multiple
    const recordMultiple = () => {
        confirm({
            title: 'Do you want to copy?',
            onOk: async () => {
                try {
                    const ids = selectedRowKeys;
                    const res = await classAPI.recordMultiple(ids);
                    if (res) {
                        setSelectedRowKeys([]);
                        history.push(`/app/managements/class/view-action`, {res});
                        getList(selectedSorter, dataSearch);
                        message.success('Copying successful');
                    } else {
                        message.error('Error copying');
                    }
                } catch(e) {
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Copying cancelled');
            },
        });
    }

    // delete
    const deleteItem = async (id) => {
        try {
            await classAPI.deleteClass(id);
            setList(list.filter((item) => item.id !== id));
            return message.success('Delete successful');
        } catch (error) {
            console.error(error);
            message.error("Error deleting data: ");
        }
    }

    //delete multiple
    const deleteMultiple= () => {
        confirm({
            title: 'Do you want to delete?',
            onOk: async () => {
                try {
                    // console.log('key - delete fn:',selectedRowKeys);
                    // 	setSelectedRowKeys([]);
                    // 	setSelectedRows([]);
                    const res = await classAPI.deleteMultiple(selectedRowKeys);

                    if (res) {
                        const existingData = JSON.parse(sessionStorage.getItem('classList')) || [];
                        const newData = existingData.filter(item=> !selectedRowKeys.includes(item.id));
                        sessionStorage.setItem('classList', JSON.stringify(newData));

                        setList(newData);
                        getList(selectedSorter, dataSearch);
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                        message.success('Delete successfully');
                    } else {
                        message.error('Error delete multiple');
                    }
                } catch (e){
                    history.push(`/auth/error-1`);
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    }

    const viewDetail= (id) => {
        history.push(`/app/managements/class/view-detail/${id}`);
    };

    //Edit
    const editClass = (id) => {
        setClassProfileVisible(true);
        setSelectedClass(id);
    };

    const closeEditClass = async () => {
        // const response = await classAPI.showClassList(codes);
        // setList(response);
        setClassProfileVisible(false);
        setSelectedClass(null);
    };

    //tableColumns
    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'id'),
        },
        {
            title: 'Mã lớp',
            dataIndex: 'code',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'code'),
        },
        {
            title: 'Tên lớp',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name'),
        },
        {
            title: 'Cố vấn học tập',
            dataIndex: 'mentor',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'mentor   '),
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right d-flex justify-content-end">
                    <Tooltip title="View">
                        <Button  className="mr-2" icon={<EyeOutlined />} onClick={() => viewDetail(elm.id)} size="small"/>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button icon={<DeleteOutlined />}
                                onClick={()=> deleteItem(elm.id)}
                                size="small"
                                danger={elm.students_count === 0 ? true : false}
                                disabled={elm.students_count === 0 ? false : true}
                        />
                    </Tooltip>
                    <EllipsisDropdown menu={dropdownMenu(elm)}/>
                </div>
            )
        }
    ];

    const dropdownMenu = elm => (
        <Menu>
            <Menu.Item onClick={() => editClass(elm.id)}>
                <Flex alignItems="center">
                    <EditOutlined />
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => record(elm.id)}>
                <Flex alignItems="center">
                    <CopyOutlined />
                    <span className="ml-2">Copy</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    //filter
    const defaultCheckedList = tableColumns.map((item) => item.dataIndex);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    const options = tableColumns.map(({ dataIndex, title }) => ({
        label: title || 'Action',
        value: dataIndex,
    }));

    const newTableColumns = tableColumns.filter(item => checkedList.includes(item.dataIndex));

    const menu = (
        <Menu>
            <div style={{padding: '10px'}}>
                <Checkbox.Group
                    value={checkedList}
                    options={options}
                    onChange={(value) => {
                        setCheckedList(value);
                    }}
                    style={{display: 'flex', flexDirection: 'column'}} // Add this line or use a className
                />
            </div>
        </Menu>
    );
    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    }

    const props = {
        action: process.env.REACT_APP_API_URL + endPointAPI.ADMIN.CLASS.IMPORT,
        onChange({ file, fileList }) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
        },
    };

    const action = [
        { label: 'Copy', icon: <CopyOutlined />, event: recordMultiple },
        { label: 'Delete', icon: <DeleteOutlined />, event: deleteMultiple },
    ];

    const handleSelectChange = (value) => {
        const actionItem = action.find(act => act.label === value);
        setSelectedAction(actionItem);
    };

    const handleButtonClick = () => {
        if (selectedAction && selectedAction.event) {
            selectedAction.event();
        } else {
            message.info('No action selected');
        }
    };

    return (

        <Card>
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="font-weight-semibold">Danh sách sao chép nhiều</h2>
                    <br></br>
                    <Row type="flex" justify="center">
                        <Col sm={24} md={12} lg={8}>
                            <p>
                                Sao chép thành công {codes.length} bản ghi
                            </p>
                        </Col>
                    </Row>
                </div>
            </div>
            <Card>
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
                            <Button type="primary" onClick={handleButtonClick}>Thực hiện</Button>
                        </div>
                        <div className="mr-md-3">
                            <Input type={"search"} placeholder="Search" prefix={<SearchOutlined/>} onChange={onSearch}/>
                        </div>
                        <div className="mb-3">
                            <Space wrap>
                                <Dropdown
                                    overlay={menu}
                                    trigger={['click']}
                                    placement="bottomLeft"
                                >
                                    <Button icon={<FilterOutlined />}>Chọn cột</Button>
                                </Dropdown>
                            </Space>
                        </div>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={newTableColumns}
                        dataSource={list}
                        rowKey='id'
                        loading={loading}
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: 'checkbox',
                            preserveSelectedRowKeys: false,
                            ...rowSelection,
                            getCheckboxProps: (elm) => {
                                if (selectedAction && selectedAction.label === 'Delete' && elm.students_count !== 0 ) {
                                    return {disabled: true};
                                }
                            },
                        }}
                        pagination={false}
                        onChange={onChangeSort}
                    />
                    <br/>
                    <div className="text-right">
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={onShowSizeChange}
                            onChange={onChangePage}
                            total={selectedTotal}
                        />
                    </div>
                </div>
            </Card>
            <EditClass id={ selectedClass} visible={classProfileVisible} close={() => (closeEditClass())}/>
        </Card>
    )
}

export default ViewAction;