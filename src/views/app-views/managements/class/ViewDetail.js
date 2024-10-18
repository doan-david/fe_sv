import React, { useEffect, useState, useCallback} from 'react'
import {
	Card,
	Table,
	Select,
	Input,
	Button,
	Tooltip,
	message,
	Empty,
	Modal,
	Col,
	Row,
	Divider,
	Pagination,
	Space, Dropdown, Menu, Checkbox,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	SearchOutlined,
	PlusCircleOutlined,
	EyeOutlined,
	ImportOutlined,
	CopyOutlined,
	ExportOutlined,
	GlobalOutlined,
	HomeOutlined,
	PhoneOutlined,
	MailOutlined,
	UserOutlined,
	IdcardOutline,
	InfoCircleOutlined,
	InfoOutlined, FilterOutlined,
} from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { useHistory } from "react-router-dom";
import {debounce} from 'lodash';
import utils from 'utils'
import classService from 'services/ClassService';
import { useParams } from 'react-router-dom';
import Text from "antd/es/typography/Text";
import EditClass from "./EditClass";

const { Option } = Select

const ViewClass = () => {
	const {id} = useParams();
	const classAPI = classService();
	const [data, setData] = useState();

	const showData = async (id) => {
		const response = await classAPI.show(id);
		setData(response);
	}
	useEffect(() => {
		if (id) showData(id);
	}, [id]);
	
	return(
		<Card title="Thông tin lớp học" bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
			<div className="container my-4">
				<Row gutter={[10, 10]}>
					<Col span={12}>
						<MailOutlined className="text-primary font-size-md" />
						<Text className="text-muted ml-2">ID:</Text>
						<Text className="ml-2">{data?.id}</Text>
					</Col>
					<Col span={12}>
						<InfoOutlined className="text-primary font-size-md" />
						<Text className="text-muted ml-2">Mã Lớp:</Text>
						<Text className="ml-2">{data?.code}</Text>
					</Col>
				</Row>
				<Divider />
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<UserOutlined className="text-primary font-size-md" />
						<Text className="text-muted ml-2">Tên Lớp:</Text>
						<Text className="ml-2">{data?.name}</Text>
					</Col>
					<Col span={12}>
						<UserOutlined className="text-primary font-size-md" />
						<Text className="text-muted ml-2">Cố vấn:</Text>
						<Text className="ml-2">{data?.mentor}</Text>
					</Col>
				</Row>
				<Divider />
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<InfoCircleOutlined className="text-primary font-size-md" />
						<Text className="text-muted ml-2">Thông tin:</Text>
						<Text className="ml-2">{data?.description}</Text>
					</Col>
				</Row>
				<Divider />
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<UserOutlined className="text-primary font-size-md" />
						<Text className="text-muted ml-2">Admin ID:</Text>
						<Text className="ml-2">{data?.admin_id}</Text>
					</Col>
				</Row>
			</div>
		</Card>
	)
}

const ClassStudentList = () => {
	let history = useHistory();
	const { id } = useParams();
	const classAPI = classService();
	const studentAPI = classService();
	const [list, setList] = useState(null);
	const [loading, setLoading] = useState(false);

	const [selectedRows, setSelectedRows] = useState([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);

	const [selectedTotal, setSelectedTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [current, setCurrent] = useState(10);
	const [dataSearch, setDataSearch] = useState('');
	const [selectedSorter, setSelectedSorter] = useState({});

	const [selectedAction, setSelectedAction] = useState(null);

	const fetchData = async (id) => {
		const response = await classAPI.showStudentList(id);
		if (response) {
			setList(response.students);
		} else {
			message.info('No student data')
			setSelectedRows([]);
		}
	}

	useEffect(() => {
		if (id) fetchData(id);
	}, [id]);

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

	const debounceGetList = useCallback(debounce((selectedSorter, value) => fetchData(selectedSorter, value), 1000), []);

	//sort
	const onChangeSort = (pagination, filters, sorter) => {
		setSelectedSorter(sorter);
	}

	const deleteItem = async (id) => {
		try {
			await studentAPI.delete(id);
			setList(list.filter((item) => item.id !== id))
			return message.success('Delete successful')
		} catch (error) {
			console.error("Error deleting data: ", error)
		}
	}
	

	//in-out-view
	const openStudentList = () => {
		history.push(`/app/managements/student/student-list`)
	}
	const viewDetail= () => {
		history.push(`/app/managements/class/view-detail`)
	}
	

	//
	const tableColumns = [
		{
			title: 'ID',
			dataIndex: 'id'
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
			title: 'Ngày sinh',
			dataIndex: 'birthday',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'birthday')
		},
        {
			title: 'Email',
			dataIndex: 'email',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'email')
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right d-flex justify-content-end">
					<Tooltip title="View">
						<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={viewDetail} size="small"/>
					</Tooltip>
					<Tooltip title="Edit">
						<Button type="primary" className="mr-2" icon={<EditOutlined />} onClick={editClass} size="small"/>
					</Tooltip>
					<Tooltip title="Delete">
						<Button type="primary" className="mr-2" icon={<DeleteOutlined />} onClick={deleteItem} size="small"/>
					</Tooltip>
				</div>
			)
		}
	];

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
	//open edit class
	const [classes, setClasses] = useState([]);
    const [classProfileVisible, setClassProfileVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        // This effect runs once when the component mounts
        // If you have any side effects or initial data fetching, do it here
        // For example, you can fetch the initial classes list here
        setClasses(list); // Assuming 'list' is the initial classes array
    }, []);

    const editClass = (classInfo) => {
        setClassProfileVisible(true);
        setSelectedClass(classInfo);
    };

    const closeEditClass = () => {
        setClassProfileVisible(false);
        setSelectedClass(null);
    };

	// Action
	// import
	const info = () => {
		Modal.import({
		  title: 'some info',
		  content: 'some info',
		});
	  };

	const action = [
		{ label : 'Import', icon : <ImportOutlined />, event: () => (info())}, 
		{ label : 'Copy', icon : <CopyOutlined />}, 
		{ label : 'Delete', icon : <DeleteOutlined />}, 
		{ label : 'Export', icon : <ExportOutlined />}
	]

	return (

		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined/>} onChange={e => onSearch(e)}/>
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
								<Button icon={<FilterOutlined/>}>Chọn cột</Button>
							</Dropdown>
						</Space>
					</div>
				</Flex>

				<div>
					<Button onClick={openStudentList} type="primary" block>Open student list</Button>
				</div>

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
			<EditClass id={selectedClass} visible={classProfileVisible} close={() => (closeEditClass())}/>
		</Card>
	)
}
const ViewDetail = () => {
	return (
		<>
			<ViewClass/>
			<ClassStudentList />
		</>
	)
}
export default ViewDetail
