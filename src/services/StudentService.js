import request, {apiFormData} from 'utils/request'
import { endPointAPI } from 'constants/endPointAPI'

const studentService = () => {
    const getListStudent = async (currentPage, pageSize, sortOrder, field, dataSearch) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}`, {
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    sortOrder: sortOrder,
                    field: field,
                    name: dataSearch,
                    // code: dataSearch,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    };

    const show = async (id) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${id}/show`);
            return response.data;
        } catch {
            return null;
        }
    };

    const showStudentList = async (ids) => {
        try {
            const response = await request.post(`/${endPointAPI.ADMIN.STUDENT.SHOW_STUDENT_LIST}`, ids);
            return response.data;
        } catch {
            return null;
        }
    }

    const hasByCode = async (code) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${code}/has-by-code`);
            return res.data;
        } catch (e) {
            return null;
        }
    }

    const hasByEmail = async (email) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${email}/has-by-email`);
            return res.data;
        } catch (e) {
            return null;
        }
    }

    const hasByPhone = async (phone) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${phone}/has-by-phone`);
            return res.data;
        } catch (e) {
            return null;
        }
    }
    
    const store = async (data) => {
            return await request.post(`/${endPointAPI.ADMIN.STUDENT.STORE}`, data);
    }
    
    const update = async (id, data) => {
        return await request.patch(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${id}/update`, data);
    }

    const updateStatus = async (id, status) => {
        return await request.patch(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${id}/update-status`, {
            status: status
        });
    }
    
    const deleteStudent = async (id) => {
        return await request.delete(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${id}/delete`);
    }

    const deleteMultiple = async (ids) => {
        try {
            return await request.delete(`/${endPointAPI.ADMIN.STUDENT.DELETE_MULTIPLE}`, ids );
        } catch (error) {
            console.error('Error deleting multiple records:', error);
            return null;
        }
    };

    const record = async (id) => {
        try {
            return await request.post(`/${endPointAPI.ADMIN.STUDENT.GET_LIST}/${id}/record`);
        } catch  {
            return null;
        }
    };

    const recordMultiple = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.STUDENT.RECORD_MULTIPLE}`, ids);
            return res.data;
        } catch  {
            return null;
        }
    }

    const importStudent = async (data) => {
        try {
            const res = await apiFormData.post(`/${endPointAPI.ADMIN.STUDENT.IMPORT_EXCEL_DATA}`, data);
            return res.data;
        } catch (error){
            console.error('There was an error upload the file!', error);
            return null;
        }
    }

    const exportCSV = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.STUDENT.EXPORT_CSV}`, {
                params:data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    }

    const exportXLSX = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.STUDENT.EXPORT_XLSX}`, {
                params:data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    }

    const search = async (data) => {
        try {
            return await request.get(endPointAPI.ADMIN.STUDENT.SEARCH, data);
        } catch  {
            return null;
        }
    }

    return {
        getListStudent,
        show,
        store,
        showStudentList,
        hasByCode,
        hasByEmail,
        hasByPhone,

        update,
        updateStatus,
        deleteStudent,
        record,
        recordMultiple,
        deleteMultiple,
        importStudent,
        exportCSV,
        exportXLSX,
        search,
    };
};

export default studentService;