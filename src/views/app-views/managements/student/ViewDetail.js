import React, {useEffect, useState} from 'react'
import {Card, Select, Input, Button, Col, Row,
	Form, Avatar, DatePicker, Upload
} from 'antd';
import { UserOutlined, } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { ROW_GUTTER } from 'constants/ThemeConstant';
import moment from 'moment';
import studentService from 'services/StudentService';
import { useParams } from 'react-router-dom';
import {info} from "autoprefixer";

const { Option } = Select

const ViewDetail = () => {
	const [form] = Form.useForm();
	const {id} = useParams();
	const studentAPI = studentService();
	const [data, setData] = useState();

	const showData = async (id) => {
		const response = await studentAPI.show(id);
		setData(response);
		// form.setFieldsValue(response);
	}
	useEffect(() => {
		if (id) showData(id);
	}, [id]);

	form.setFieldsValue({
		code: data?.code,
		name: data?.name,
		username: data?.username,
		password: data?.password,
		email: data?.email,
		gender: data?.gender,
		birthday: moment(data?.birthday),
		phone: data?.phone,
		address: data?.address,
		hobby: data?.hobby,
		image: data?.image,
		status: data?.status,
		description: data?.description,
	});

	const avatarEndpoint = 'https://www.mocky.io/v2/5cc8019d300000980a055e76'

	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	const onFinish = values => {
		// const key = 'updatable';
		// message.loading({ content: 'Updating...', key });
		// setTimeout(() => {
		// 	this.setState({
		// 		name: values.name,
		// 		email: values.email,
		// 		userName: values.userName,
		// 		dateOfBirth: values.dateOfBirth,
		// 		phoneNumber: values.phoneNumber,
		// 		website: values.website,
		// 		address: values.address,
		// 		city: values.city,
		// 		postcode: values.postcode,
		// 	})
		// 	message.success({ content: 'Done!', key, duration: 2 });
		// }, 1000);
	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	const onUploadAvatar = info => {
		// const key = 'updatable';
		// if (info.file.status === 'uploading') {
		// 	message.loading({ content: 'Uploading...', key, duration: 1000 });
		// 	return;
		// }
		// if (info.file.status === 'done') {
		// 	this.getBase64(info.file.originFileObj, imageUrl =>
		// 		this.setState({
		// 			avatarUrl: imageUrl,
		// 		}),
		// 	);
		// 	message.success({ content: 'Uploaded!', key,  duration: 1.5 });
		// }
	};

	const onRemoveAvatar = () => {
		// this.setState({
		// 	avatarUrl: ''
		// })
	}
	const avatarUrl = '';

	const rules = {
		code: [
			{ required: true, message: 'Please input your code!' },
			{ max: 15, message: 'Mã lớp không được vượt quá 15 ký tự' },
			{
				// validator: async (_, value) => {
				// 	if (value === dataClass.code) {
				// 		return Promise.resolve();
				// 	} else {
				// 		// const exists = await debounceSearchByCode(value);
				// 		const exists = await throttledSearchByCode(value);
				// 		if (exists === true) {
				// 			return Promise.reject(new Error('Mã sinh viên đã tồn tại!'));
				// 		}
				// 		return Promise.resolve();
				// 	}
				// }
			}
		],
		name: [
			{ required: true, message: 'Please input your name!' },
			{ max: 50, message: 'Tên lớp không được vượt quá 50 ký tự' },
			{
				// validator: async (_, value) => {
				// 	if (value === dataClass.name) {
				// 		return Promise.resolve();
				// 	} else {
				// 		const exists = await throttledSearchByName(value);
				// 		if (exists === true) {
				// 			return Promise.reject(new Error('Tên lớp đã tồn tại!'));
				// 		}
				// 		return Promise.resolve();
				// 	}
				// }
			}
		],
		username: [
			{required: true, message: 'Please input your username!'},
			{ max: 50, message: 'Tên lớp không được vượt quá 50 ký tự' },
		],
		password: [
			{required: true, message: 'Please input your password'},
			{ max: 50, message: 'Tên lớp không được vượt quá 20 ký tự' },
		],
		email: [
			{required: true, message: 'Please input your email!'}
		],
		hobby: [
			{required: true, message: 'Please input your hobby!'},
			{ max: 20, message: 'Tên lớp không được vượt quá 50 ký tự' },
		],
	};
	return(
	<Card >
		<Flex alignItems="center" mobileFlex={false} className="text-center text-md-left">
			<Avatar size={90} src={data?.image} icon={<UserOutlined />}/>
			<div className="ml-3 mt-md-0 mt-3">
				<Upload onChange={onUploadAvatar} showUploadList={false} action={avatarEndpoint}>
					<Button type="primary">Change Avatar</Button>
				</Upload>
				<Button className="ml-2" onClick={onRemoveAvatar}>Remove</Button>
			</div>
		</Flex>
		<div className="mt-4">
			<Form
				name="basicInformation"
				layout="vertical"
				form={form}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
			>
				<Row>
					<Col xs={24} sm={24} md={24} lg={16}>
						<Row gutter={ROW_GUTTER}>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Code"
									name="code"
									rules={rules.code}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label= "Password"
									name= "password"
									rules={rules.password}
								>
									<Input.Password/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Name"
									name="name"
									rules={rules.name}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Username"
									name="username"
									rules={rules.username}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Email"
									name="email"
									rules={[{
										required: true,
										type: 'email',
										message: 'Please enter a valid email!'
									}]}
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Date of Birth"
									name="birthday"
								>
									<DatePicker className="w-100"/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Phone Number"
									name="phone"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Gender"
									name="gender"
								>
									<Select placeholder="Gender"
											options={[
												{value: 'male', label: 'Male'},
												{value: 'female', label: 'Female'},
												{value: 'other', label: 'Other'},
											]}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={24}>
								<Form.Item
									label="Address"
									name="address"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Hobby"
									name="hobby"
								>
									<Input />
								</Form.Item>
							</Col>
							<Col xs={24} sm={24} md={12}>
								<Form.Item
									label="Status"
									name="status"
								>
									<Select
											options={[
												{value: 'active', label: 'Active'},
												{value: 'graduated', label: 'Graduated'},
												{value: 'deferred', label: 'Deferred'},
												{value: 'dismissed', label: 'Dismissed'},
											]}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Button type="primary" htmlType="submit">
							Save Change
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
	</Card>
	)
}
export default ViewDetail
