import React, { useEffect, useState } from 'react';
import {Drawer, Space, Button, Form, Input, message, Card, Row, Col, Select, InputNumber} from 'antd';

import classService from 'services/ClassService';
import {useHistory} from "react-router-dom";
import {throttle} from "lodash";

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

const EditClass = ({id, visible, close}) => {
  let history = useHistory();
  const classAPI = classService();
  const [dataClass, setDataClass] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async (id) => {
    const response = await classAPI.show(id);
    setDataClass(response);
    form.setFieldsValue(response);
  }
  useEffect(() => {
    if(id) fetchData(id);
  }, [id]);

  const errosPage2= () => {
    history.push('/auth/error-2');
  }

  const updateClass = async (values) => {
    try {
      const res = await classAPI.update(id, values);
      res ? message.success('Class update done') : message.error('Class update false');
    } catch (error) {
      message.error('Error update class', error);
      return errosPage2();
    }
    };

  // Validator
  const rules = {
    code: [
      { required: true, message: 'Please input the class code!' },
      { max: 15, message: 'Mã lớp không được vượt quá 15 ký tự' },
      {
        validator: async (_, value) => {
          if (value === dataClass.code) {
            return Promise.resolve();
          } else {
            // const exists = await debounceSearchByCode(value);
            const exists = await throttledSearchByCode(value);
            if (exists === true) {
              return Promise.reject(new Error('Mã lớp đã tồn tại!'));
            }
            return Promise.resolve();
          }
        }
      }
    ],
    name: [
      { required: true, message: 'Please input the class name!' },
      { max: 50, message: 'Tên lớp không được vượt quá 50 ký tự' },
      {
        validator: async (_, value) => {
          if (value === dataClass.name) {
            return Promise.resolve();
          } else {
            const exists = await throttledSearchByName(value);
            if (exists === true) {
              return Promise.reject(new Error('Tên lớp đã tồn tại!'));
            }
            return Promise.resolve();
          }
        }
      }
    ],
    mentor: [
      { required: true, message: 'Please input the mentor!' },
      { max: 25, message: 'Cố vấn học tập không được vượt quá 25 ký tự' }
    ],
    description: [
      { required: false, message: 'Please input the description!' },
      { max: 225, message: 'Thông tin chi tiết không được vượt quá 225 ký tự' }
    ]
  };

  // const debounceSearchByCode =
  // 	debounce((value) =>searchByCode(value), 500);

  const throttledSearchByCode = throttle(async (value) => {
    return await classAPI.hasByCode(value);
  }, 100);

  const throttledSearchByName = throttle(async (value) => {
    return await classAPI.hasByName(value);
  }, 100);

  return (

    <Drawer
      title="Edit Class"
      width={720}
      placement="right"
      onClose={close}
      closable={false}
      visible={visible}
      bodyStyle={{
        paddingBottom: 80,
      }}
    >
      <Form layout="vertical" form={form} name="control-hooks" onFinish={updateClass}>
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
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>

          {/*<Col span={24}>*/}
          {/*  <Form.Item name="admin_id" label="Admin id" rules={rules.admin_id}>*/}
          {/*    <Select*/}
          {/*        placeholder="Please input the admin id"*/}
          {/*    >*/}
          {/*      <Option value="male">1</Option>*/}
          {/*      <Option value="female">2</Option>*/}
          {/*    </Select>*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
        </Row>

        <Form.Item {...tailLayout}>
          <Button className="mr-2">Discard</Button>
          <Button className="mr-2" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default EditClass