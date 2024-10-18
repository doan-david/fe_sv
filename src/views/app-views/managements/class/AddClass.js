import {Form, Input, Button, Select, Card, message, Upload, Image, Row, Col} from 'antd';
import {debounce, values, throttle} from 'lodash';
import React, {useCallback, useState} from 'react';
import ClassService from 'services/ClassService';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;

// Validator


const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


const AddClass = () => {

	const [value, setValue] = useState('');

	//Event
	const classAPI = ClassService();
	const [form] = Form.useForm();
	const onFinish = async (data) => {
		try {
		  await classAPI.store(data);
		  message.success('Class added successfully');
		} catch (error) {
		  message.error('Code bị trùng vui lòng nhập lại', error);
		}
	  };

	const onReset = () => {
		form.resetFields();
	};

	const onFill = () => {
		form.setFieldsValue({
			code: '101010',
			name: 'K15CNPM1',
			mentor: 'Linda',
			description: 'K15CNPM1',
		});
	};

	// const debounceSearchByCode =
	// 	debounce((value) => hasByCode(value), 500);

	const throttledSearchByCode = throttle(async (value) => {
		return await classAPI.hasByCode(value);
	}, 100);

	const throttledSearchByName = throttle(async (value) => {
		return await classAPI.hasByName(value);
	}, 100);


	const rules = {
		code: [
			{ required: true, message: 'Please input the class code!' },
			{ max: 15, message: 'Mã lớp không được vượt quá 15 ký tự' },
			{
				validator: async (_, value) => {
					if (!value) {
						return Promise.resolve();
					}

					// const exists = await debounceSearchByCode(value);
					const exists = await throttledSearchByCode(value);
					if (exists) {
						return Promise.reject(new Error('Mã lớp đã tồn tại!'));
					}
					return Promise.resolve();
				}
			}
		],
		name: [
			{ required: true, message: 'Please input the class name!' },
			{ max: 50, message: 'Tên lớp không được vượt quá 50 ký tự' },
			{
				validator: async (_, value) => {
					if (!value) {
						return Promise.resolve();
					}

					const exists = await throttledSearchByName(value);
					if (exists === true) {
						return Promise.reject(new Error('Tên lớp đã tồn tại!'));
					}
					return Promise.resolve();
				}
			}
		],
		mentor: [
			{ required: true, message: 'Please input the mentor!' },
			{ max: 20, message: 'Cố vấn học tập không được vượt quá 20 ký tự' }
		],
		description: [
			{ required: false, message: 'Please input the description!' },
			{ max: 200, message: 'Thông tin chi tiết không được vượt quá 200 ký tự' }
		],
	};

	const onCodeChange = async () => {
		try {
			await form.validateFields(['code']);
		} catch (error) {
			console.log('Validation Failed:', error);
		}
	};


  return (
	<Card>
		<Col span={12} offset={6}>
			<Form layout="vertical" form={form} name="control-hooks" onFinish={onFinish}>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="code" label="Mã lớp" rules={rules.code}>
							<Input/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Tên Lớp" rules={rules.name} >
							<Input />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="mentor" label="Cố vấn học tập" rules={rules.mentor}>
							<Input />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="status" label="Status" >
							<Select className="w-100" placeholder="Status"
									options={[
										{value: 'active', label: 'Active' },
										{value: 'in active', label: 'In Active'},
									]}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name="description" label="Thông tin chi tiết" rules={rules.description}>
							<ReactQuill theme="snow" value={value} onChange={setValue} />
						</Form.Item>
					</Col>


					{/*<Col span={24}>*/}
					{/*	<Form.Item name="admin_id" label="Admin id" rules={rules.admin_id}>*/}
					{/*		<Select*/}
					{/*			placeholder="Please input the admin id"*/}
					{/*		>*/}
					{/*			<Option value="male">1</Option>*/}
					{/*			<Option value="female">2</Option>*/}
					{/*		</Select>*/}
					{/*	</Form.Item>*/}
					{/*</Col>*/}
				</Row>

				<Form.Item {...tailLayout}>
					<Button className="mr-2" type="primary" htmlType="submit">
						Submit
					</Button>
					<Button className="mr-2" htmlType="button" onClick={onReset}>
						Reset
					</Button>
					<Button className="mr-2"  htmlType="button" onClick={onFill}>
						Fill form
					</Button>
				</Form.Item>
			</Form>
		</Col>
	</Card>
  );
};

export default AddClass