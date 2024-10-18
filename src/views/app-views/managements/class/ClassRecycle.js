import React, {useCallback, useEffect, useState} from 'react'
import {Card, Table, Select, Input, Button, Tooltip, message, Empty, Modal, Menu, Spin} from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined, EyeOutlined, ImportOutlined, CopyOutlined, ExportOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import { useHistory } from "react-router-dom";
import utils from 'utils'
import EditClass from './EditClass';
import classService from 'services/ClassService';
import {debounce, isEmpty} from "lodash";

const { Option } = Select
const { confirm } = Modal;

const RecycleClass = () => {
    let history = useHistory();
    const classAPI = classService();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [selectedTotal, setSelectedTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [current, setCurrent] = useState(10)
    const [dataSearch, setDataSearch] = useState({});

    //api
    useEffect(() => {
        search(dataSearch)
    }, [currentPage, current])

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

    const search = async (value) => {
        setLoading(true);
        try {
            let res;
            if (isEmpty(value)) {
                res = await classAPI.recycle(currentPage, current);
            } else {
                res = await classAPI.recycle(currentPage, current, value);
            }

            if (res) {
                setList(res.data);
                setSelectedTotal(res.total);
            } else {
                setSelectedRows([]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    const debounceSearch = useCallback(debounce((e) => search(e), 1000), []);

    function onSearch(e) {
        const value = e.currentTarget.value;
        setDataSearch(value);
        debounceSearch(value);
    }

    //restore
    const restore = (id) => {
        confirm({
            title: 'Do you want to copy this restore?',
            onOk: async () => {
                try {
                    const res = await classAPI.restore(id);
                    // console.log(res)
                    if (res) {
                        setList(list.filter((item) => item.id !== id));
                        return message.success('Restore successful');
                    } else {
                        return message.success('Restore error 404');
                    }

                } catch (error) {
                    console.error(error);
                    message.error("Error Restore");
                }
            },
            onCancel() {
                message.info('Restore cancelled');
            },
        });
    }

    const restoreMultiple = () => {
        confirm({
            title: 'Do you want to copy this restore?',
            onOk: async () => {
                try {
                    const ids = selectedRowKeys;
                    const res = await classAPI.restoreMultiple(ids);
                    if (res) {
                        const response = await classAPI.recycle();
                        if (response.length > 0) {
                            setList(response);
                        } else {
                            setSelectedRows([]);
                        }
                        message.success('Restore ' + res + ' successfully');
                        setSelectedRowKeys([]);
                    } else {
                        message.error('Error restoring multiple');
                    }
                } catch (e){
                    message.error('Error restoring multiple');
                }
            },
            onCancel() {
                message.info('Restore cancelled');
            },
        });
    }

    const restoreAll = () => {
        confirm({
            title: 'Do you want to copy this restore all?',
            onOk: async () => {
                try {
                    const res = await classAPI.restoreAll();
                    if ( res) {
                        setList([]);
                        return message.success('Restore ' + res + ' successful');
                    } else {
                        message.error("Error Restore");
                    }
                } catch (error) {
                    console.error(error);
                    message.error("Error Restore");
                }
            },
            onCancel() {
                message.info('Restore cancelled');
            },
        });
    }

    //delete
    const forceDelete = (id) => {
        confirm({
            title: 'Do you want to force delete?',
            onOk: async () => {
                try {
                    await classAPI.forceDelete(id);
                    setList(list.filter((item) => item.id !== id));
                    return message.success('Delete successful');
                } catch (error) {
                    console.error(error);
                    message.error("Error deleting data: ");
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    }

    //delete multiple
    const forceDeleteMultiple = () => {
        confirm({
            title: 'Do you want to force delete?',
            onOk: async () => {
                try {
                    const ids = selectedRowKeys;
                    const res = await classAPI.forceDeleteMultiple(ids);
                    if (res) {
                        const response = await classAPI.recycle();
                        if (response.length > 0) {
                            setList(response);
                        } else {
                            setSelectedRows([]);
                        }
                        message.success('Delete ' + res + ' successfully');
                        setSelectedRowKeys([]);
                    } else {
                        message.error('Error deleting multiple');
                    }
                } catch (e){
                    message.error('Error deleting multiple');
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    }

    const forceDeleteAll = () => {
        confirm({
            title: 'Do you want to force delete all?',
            onOk: async () => {
                try {
                    const res = await classAPI.forceDeleteAll();
                    if ( res) {
                        setList([]);
                        return message.success('Restore ' + res + ' successful');
                    } else {
                        message.error("Error Restore");
                    }
                } catch (error) {
                    console.error(error);
                    message.error("Error deleting data: ");
                }
            },
            onCancel() {
                message.info('Delete cancelled');
            },
        });
    }

    //in-out-view
    const addClass = () => {
        history.push(`/app/managements/class/add-class`);
    };

    const viewDetail= (id) => {
        history.push(`/app/managements/class/view-detail/${id}`);
    };

    //export view
    const exportView = (ids) => {
        const data = selectedRows;
        history.push({
            pathname: '/app/managements/class/export-class',
            state: { data }
        });
    }

    //edit multiple view
    // const editView = () => {
    //     const dataCLass = selectedRows;
    //     console.log(dataCLass);
    //     // history.push(`/app/managements/class/view-action`, dataCLass)
    // }

    const dropdownMenu = elm => (
        <Menu>
            <Menu.Item onClick={() => viewDetail(elm.id)}>
                <Flex alignItems="center">
                    <EyeOutlined />
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={() => restore(elm.id)}>
                <Flex alignItems="center">
                    <EditOutlined />
                    <span className="ml-2">Restore</span>
                </Flex>
            </Menu.Item>
            <Menu.Item onClick={()=> {forceDelete(elm.id)}}>
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">Force Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

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
            title: '',
            dataIndex: 'action',
            render: (_, elm) => (
                <div className="text-right">
                    <EllipsisDropdown menu={dropdownMenu(elm)}/>
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

    //open edit class
    const [classes, setClasses] = useState([]);
    const [classProfileVisible, setClassProfileVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState();

    useEffect(() => {
        setClasses(list);
    }, []);

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

    const action = [
        { label: 'Export', icon: <ExportOutlined />, event: exportView },
        { label: 'Restore', icon: <EditOutlined />, event: restoreMultiple },
        { label: 'Restore All', icon: <EditOutlined />, event: restoreAll },
        { label: 'Delete', icon: <DeleteOutlined />, event: forceDeleteMultiple },
        { label: 'Delete All', icon: <DeleteOutlined />, event: forceDeleteAll },
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

    return (
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
                    <div className="mb-3">
                        <Input placeholder="Search" prefix={<SearchOutlined/>} onChange={onSearch}/>
                    </div>
                </Flex>

                <div>
                    <Button onClick={addClass} type="primary" icon={<PlusCircleOutlined/>} block>Add class</Button>
                </div>
            </Flex>
            <div className="table-responsive">
                <Spin spinning={loading}>
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
                        pagination={{
                            showSizeChanger: true,
                            onChange: onChangePage,
                            onShowSizeChange: onShowSizeChange,
                            total: selectedTotal
                        }}
                    />
                </Spin>
            </div>
            <EditClass id={ selectedClass} visible={classProfileVisible} close={() => (closeEditClass())}/>
        </Card>
    )
}

export default RecycleClass
