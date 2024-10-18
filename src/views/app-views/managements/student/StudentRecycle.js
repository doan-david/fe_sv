import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {Card} from "antd";

const StudentRecycle = () => {
    const [value, setValue] = useState('');

    return (
        <Card>
        <ReactQuill theme="snow" value={value} onChange={setValue} />;
        </Card>
    )
}

export default StudentRecycle;