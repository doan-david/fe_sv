import React, { useEffect, useState } from 'react';
import {Drawer, Space, Button, Form, Input, message, Card, Row, Col, Select, InputNumber, Upload, Image, DatePicker} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt';
import Flex from 'components/shared-components/Flex';
import {useHistory} from "react-router-dom";
import studentService from "../../../../services/StudentService";
import classService from "../../../../services/ClassService";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {image} from "d3-fetch";
dayjs.extend(customParseFormat);

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

// Validator
const rules = {
  code: [{ required: true, message: 'Please input the class code!' }, { max: 10, message: 'Class code must not exceed 10 characters' }],
  name: [{ required: true, message: 'Please input the class name!' }, { max: 50, message: 'Class name must not exceed 50 characters' }],
  username: [{ required: false, message: 'Please input the username!' }, { max: 25, message: 'Username must not exceed 25 characters' }],
  password: [{ required: true, message: 'Please input the password!' }, { max: 25, message: 'Password must not exceed 25 characters' }, { min: 6, message: 'Password must be at least 6 characters' }],
  email: [{ required: true, message: 'Please input the email!' }, { type: 'email', message: 'Invalid email format' }],
  gender: [{ required: true, message: 'Please select the gender!' }],
  birthday: [{ required: true, message: 'Please input the birthday!' }, { type: 'date', message: 'Invalid date format' }],
  phone: [{ required: false, message: 'Please input the phone number!' }, { min: 9, message: 'Phone number must be at least 9 characters' }, { max: 20, message: 'Phone number must not exceed 20 characters' }],
  address: [{ required: false, message: 'Please input the address!' }, { max: 200, message: 'Address must not exceed 200 characters' }],
  hobby: [{ required: false, message: 'Please input the hobby!' }],
  image: [{ required: false, message: 'Please upload the image!' }, { type: 'url', message: 'Please upload a valid image URL!' }, { validator: (rule, value) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (value && !allowedTypes.includes(value.type)) {
        return Promise.reject('Image must be in JPG, PNG, or GIF format!');
      }
      return Promise.resolve();
    }}],
  status: [{ required: true, message: 'Please select the status!' }],
  description: [{ required: false, message: 'Please input the description!' }, { max: 225, message: 'Description must not exceed 225 characters' }]
};

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

//image
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

const EditStudent = ({id, visible, close}) => {
  let history = useHistory();
  const studentAPI = studentService();
  const classAPI = classService();
  const [dataStudent, setDataStudent] = useState(null);
  const [dataClass, setDataClass] = useState();
  const [form] = Form.useForm();

  const fetchData = async (id) => {
    const response = await studentAPI.show(id);
    if (response && response.code) {
      setDataStudent(response);
      const formattedResponse = {
        ...response,
        birthday: response.birthday ? dayjs(response.birthday) : null,
        image: response.image ? response.image : null,
      };
      form.setFieldsValue(formattedResponse);
    } else message.info('Không có dữ liệu');
  }
  useEffect(() => {
    if(id) fetchData(id);
  }, [id]);

  const errosPage2= () => {
    history.push('/auth/error-2');
  }

  const updateStudent = async (values) => {
    try {
      const res = await studentAPI.update(id, values);
      res ? message.success('Student update done') : message.error('Student update done');
      // if (res) {
      //   message.success('Student update done');
      // } else {
      //   message.error('Student update false');
      // }
    } catch (error) {
      message.error('Error update student', error);
      return errosPage2();
    }
  };


  // const onFinish = values => {
  //   const key = 'updatable';
  //   message.loading({ content: 'Updating...', key });
  //   setTimeout(() => {
  //     this.setState({
  //       name: values.name,
  //       email: values.email,
  //       userName: values.userName,
  //       dateOfBirth: values.dateOfBirth,
  //       phoneNumber: values.phoneNumber,
  //       website: values.website,
  //       address: values.address,
  //       city: values.city,
  //       postcode: values.postcode,
  //     })
  //     message.success({ content: 'Done!', key, duration: 2 });
  //   }, 1000);
  // };
  //
  // const onFinishFailed = errorInfo => {
  //   console.log('Failed:', errorInfo);
  // };
  //
  // const onUploadAavatar = info => {
  //   const key = 'updatable';
  //   if (info.file.status === 'uploading') {
  //     message.loading({ content: 'Uploading...', key, duration: 1000 });
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     this.getBase64(info.file.originFileObj, imageUrl =>
  //         this.setState({
  //           avatarUrl: imageUrl,
  //         }),
  //     );
  //     message.success({ content: 'Uploaded!', key,  duration: 1.5 });
  //   }
  // };
  //
  // const onRemoveAvatar = () => {
  //   this.setState({
  //     avatarUrl: ''
  //   })
  // }
  return (

      <Drawer
          width={720}
          placement="right"
          onClose={close}
          closable={false}
          visible={visible}
          extra={
            <Space>
              <Button onClick={close}>Cancel</Button>
              <Button onClick={close} type="primary">
                Submit
              </Button>
            </Space>
          }
      >
        <PageHeaderAlt className="border-bottom" >
          <div className="container">
            <Flex className="py-2 " mobileFlex={false} justifyContent="center" alignItems="center">
              <h2 className="mb-3">Edit Student</h2>
            </Flex>
          </div>
        </PageHeaderAlt>
        <br></br>
        {/*<>*/}
        {/*  <Flex alignItems="center" mobileFlex={false} className="text-center text-md-left">*/}
        {/*    <Avatar size={90} src={avatarUrl} icon={<UserOutlined />}/>*/}
        {/*    <div className="ml-3 mt-md-0 mt-3">*/}
        {/*      <Upload onChange={onUploadAavatar} showUploadList={false} action={this.avatarEndpoint}>*/}
        {/*        <Button type="primary">Change Avatar</Button>*/}
        {/*      </Upload>*/}
        {/*      <Button className="ml-2" onClick={onRemoveAvatar}>Remove</Button>*/}
        {/*    </div>*/}
        {/*  </Flex>*/}
        {/*  <div className="mt-4">*/}
        {/*    <Form*/}
        {/*        name="basicInformation"*/}
        {/*        layout="vertical"*/}
        {/*        initialValues={*/}
        {/*          {*/}
        {/*            'name': name,*/}
        {/*            'email': email,*/}
        {/*            'username': userName,*/}
        {/*            'dateOfBirth': dateOfBirth,*/}
        {/*            'phoneNumber': phoneNumber,*/}
        {/*            'website': website,*/}
        {/*            'address': address,*/}
        {/*            'city': city,*/}
        {/*            'postcode': postcode*/}
        {/*          }*/}
        {/*        }*/}
        {/*        onFinish={onFinish}*/}
        {/*        onFinishFailed={onFinishFailed}*/}
        {/*    >*/}
        {/*      <Row>*/}
        {/*        <Col xs={24} sm={24} md={24} lg={16}>*/}
        {/*          <Row gutter={ROW_GUTTER}>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Name"*/}
        {/*                  name="name"*/}
        {/*                  rules={rules.name}*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Username"*/}
        {/*                  name="username"*/}
        {/*                  rules={[*/}
        {/*                    {*/}
        {/*                      required: true,*/}
        {/*                      message: 'Please input your username!'*/}
        {/*                    },*/}
        {/*                  ]}*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Email"*/}
        {/*                  name="email"*/}
        {/*                  rules={[{*/}
        {/*                    required: true,*/}
        {/*                    type: 'email',*/}
        {/*                    message: 'Please enter a valid email!'*/}
        {/*                  }]}*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Date of Birth"*/}
        {/*                  name="dateOfBirth"*/}
        {/*              >*/}
        {/*                <DatePicker className="w-100"/>*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Phone Number"*/}
        {/*                  name="phoneNumber"*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Website"*/}
        {/*                  name="website"*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={24}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Address"*/}
        {/*                  name="address"*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="City"*/}
        {/*                  name="city"*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*            <Col xs={24} sm={24} md={12}>*/}
        {/*              <Form.Item*/}
        {/*                  label="Post code"*/}
        {/*                  name="postcode"*/}
        {/*              >*/}
        {/*                <Input />*/}
        {/*              </Form.Item>*/}
        {/*            </Col>*/}
        {/*          </Row>*/}
        {/*          <Button type="primary" htmlType="submit">*/}
        {/*            Save Change*/}
        {/*          </Button>*/}
        {/*        </Col>*/}
        {/*      </Row>*/}
        {/*    </Form>*/}
        {/*  </div>*/}
        {/*</>*/}
        {/*<Form layout="vertical" form={form} name="control-hooks" onFinish={updateStudent}>*/}
        {/*  <Row gutter={16}>*/}
        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*    <Form.Item name="code" label="Mã sinh viên" rules={rules.code}>*/}
        {/*      <Input/>*/}
        {/*    </Form.Item>*/}
        {/*  </Col>*/}
        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="name" label="Tên sinh viên" rules={rules.name} >*/}
        {/*        <Input />*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="username" label="Họ và tên đệm" rules={rules.username}>*/}
        {/*        <Input/>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}
        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="email" label="Email" rules={rules.email} >*/}
        {/*        <Input />*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="gender" label="Giới tính" rules={rules.gender}>*/}
        {/*        <Input/>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}
        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="birthday" label="Ngày sinh" rules={rules.birthday} >*/}
        {/*        <DatePicker format="YYYY-MM-DD"/>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="phone" label="Số điện thoại" rules={rules.phone}>*/}
        {/*        <Input/>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}
        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="address" label="Địa chỉ" rules={rules.address} >*/}
        {/*        <Input />*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="class_id" label="Class ID">*/}
        {/*        <Select placeholder="Please input the admin id" value="class_id">*/}
        {/*          <Option value="Select">Select</Option>*/}
        {/*          {*/}
        {/*            dataClass?.map(elm => (*/}
        {/*                <Option value={elm.id} key={elm.id}>*/}
        {/*                  <span className="ml-2">{elm.id}</span>*/}
        {/*                </Option>*/}
        {/*            ))*/}
        {/*          }*/}
        {/*        </Select>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}
        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="hobby" label="Sở thích" rules={rules.hobby}>*/}
        {/*        <Input/>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col xs={24} sm={24} md={12}>*/}
        {/*      <Form.Item name="image" label="Ảnh" rules={rules.image}>*/}
        {/*        <Upload*/}
        {/*            // defaultFileList={image}*/}
        {/*            listType="picture-circle"*/}
        {/*            fileList={fileList}*/}
        {/*            onPreview={handlePreview}*/}
        {/*            onChange={handleChange}*/}
        {/*        >*/}
        {/*          {fileList.length >= 8 ? null : uploadButton}*/}
        {/*        </Upload>*/}
        {/*        {previewImage && (*/}
        {/*            <Image*/}
        {/*                wrapperStyle={{*/}
        {/*                  display: 'none',*/}
        {/*                }}*/}
        {/*                preview={{*/}
        {/*                  visible: previewOpen,*/}
        {/*                  onVisibleChange: (visible) => setPreviewOpen(visible),*/}
        {/*                  afterOpenChange: (visible) => !visible && setPreviewImage(''),*/}
        {/*                }}*/}
        {/*                src={previewImage}*/}
        {/*            />*/}
        {/*        )}*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col span={24}>*/}
        {/*      <Form.Item name="description" label="Thông tin chi tiết" rules={rules.description}>*/}
        {/*        <Input.TextArea rows={4} />*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}

        {/*    <Col span={24}>*/}
        {/*      <Form.Item name="admin_id" label="Admin id" rules={rules.admin_id}>*/}
        {/*        <Select*/}
        {/*            placeholder="Please input the admin id"*/}
        {/*        >*/}
        {/*          <Option value="male">1</Option>*/}
        {/*          <Option value="female">2</Option>*/}
        {/*        </Select>*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}

        {/*  <Form.Item {...tailLayout}>*/}
        {/*    <Button className="mr-2">Discard</Button>*/}
        {/*    <Button className="mr-2" type="primary" htmlType="submit">*/}
        {/*      Submit*/}
        {/*    </Button>*/}
        {/*  </Form.Item>*/}
        {/*</Form>*/}
      </Drawer>
  )
}

export default EditStudent