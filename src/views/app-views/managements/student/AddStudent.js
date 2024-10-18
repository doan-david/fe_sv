import React, {useEffect, useState} from 'react'
import {Card, Select, Input, Button, Col, Row,
	Form, Avatar, DatePicker, Upload, message
} from 'antd';
import { UserOutlined, } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon';
import studentService from 'services/StudentService';
import { useParams } from 'react-router-dom';
import {throttle} from "lodash";

const { Option } = Select
const { Dragger } = Upload;

const AddStudent = () => {
	const [image, setImage] = useState(null);
	const [form] = Form.useForm();
	const {id} = useParams();
	const studentAPI = studentService();
	const [data, setData] = useState();

	const avatarEndpoint = 'https://www.mocky.io/v2/5cc8019d300000980a055e76'

	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	const onFinish = async values => {
		try {
			// values.birthday.format('YYYY-MM-DD')
			const formData = new FormData();
			for (const key in values) {
				if (values.hasOwnProperty(key)) {
					formData.append(key, values[key]);
				}
			}
			formData.append('image', image);
			const response = await studentAPI.store(formData)
			if(response.status === 200) {
				message.success('Student added successfully!');
			}
		} catch (error) {
			message.error('Failed to add student. Please try again.');
		}
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

	const props = {
		name: "image",
		multiple: false,
		beforeUpload(image) {
			const isImage = image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/gif' || image.type === 'image/jpg';
			if (!isImage) {
				message.error('You can only upload JPG/PNG/GIF files!');
				return false;
			}
			const isLt2M = image.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				message.error('Image must be smaller than 2MB!');
				return false;
			}
			setImage(image);
			return false;
		},
		onChange(info) {
			const { status } = info.file;
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
				console.log("image:", image)
			}
			if (status === 'done') {
				message.success(`${info.file.name} image uploaded successfully.`);
			} else if (status === 'error') {
				message.error(`${info.file.name} image upload failed.`);
			}
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	const throttledSearchByCode = throttle( async value => {
		return await studentAPI.hasByCode(value)
	}, 100);

	const throttledSearchByEmail = throttle( async value => {
		return await studentAPI.hasByEmail(value)
	}, 100);

	const throttledSearchByPhone = throttle( async value => {
		return await studentAPI.hasByPhone(value)
	}, 100);

	const rules = {
		code: [
			{ required: true, message: 'Please input the class code!' },
			{ max: 15, message: 'Mã sinh viên không được vượt quá 15 ký tự' },
			{
				validator: async (_, value) => {
					const exists = await throttledSearchByCode(value);
					if (exists === true) {
						return Promise.reject(new Error('Student ID already exists!'));
					}
					return Promise.resolve();
				}
			}
		],
		name: [
			{ required: true, message: 'Please input the class name!' },
			{ max: 50, message: 'The name must not exceed 50 characters' },
		],
		password: [],
		username: [
			{ required: true, message: 'Please input the user name!' },
			{ max: 50, message: 'The username must not exceed 50 characters' }
		],
		email: [
			{ required: true, message: 'Please enter a valid email' },
			{ max: 70, message: 'The email address must not exceed 70 characters'},
			{
				validator: async (_, value) => {
					const exists = await throttledSearchByEmail(value);
					if (exists === true) {
						return Promise.reject(new Error('Email already exists'))
					}
					return  Promise.resolve();
				}
			}
		],
		phone: [
			{ required: true, message: 'Please input the phone number!' },
			{ max: 20, message: 'The phone must not exceed 20 characters'},
			{
				validator: async (_,value) => {
					const exists = await throttledSearchByPhone(value);
					if (exists === true) {
						return Promise.reject(new Error('Phone number already exists!'));
					}
					return Promise.resolve()
				}
			}
		]
	};

	return(
		<>
			<Form
				name="basicInformation"
				layout="vertical"
				form={form}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
			>
				<Card title="Add Student">
					<Button className="mr-2" type="primary" htmlType="submit">
						Save Change
					</Button>
					<Button >Discard</Button>
				</Card>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={17}>
						<Card title="Info Form">
							<div className="mt-4">
									<Row>
										<Col xs={24} sm={24} md={24} lg={24}>
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
														rules={rules.email}
													>
														<Input />
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={12}>
													<Form.Item
														label="Date of Birth"
														name="birthday"
													>
														<DatePicker
															className="w-100"
														/>
													</Form.Item>
												</Col>
												<Col xs={24} sm={24} md={12}>
													<Form.Item
														label="Phone Number"
														name="phone"
														rules={rules.phone}
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
										</Col>
									</Row>
							</div>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={7}>
						<Card title="Image">
							<Dragger {...props}>
								<CustomIcon className="display-3" svg={ImageSvg}/>
								<p>Click or drag file to upload</p>
							</Dragger>
						</Card>
					</Col>
				</Row>
			</Form>
		</>
	)
}
export default AddStudent
