import request, {apiFormData} from 'utils/request'
import { endPointAPI } from 'constants/endPointAPI'

const classService = () => {
    const getListClass = async (currentPage, pageSize, sortOrder, field, dataSearch) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.CLASS.GET_LIST}`, {
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

    // const getListClassPaginate = async (currentPage, pageSize, dataSearch) => {
    //     try {
    //         const response = await request.get(`${endPointAPI.ADMIN.CLASS.GET_LIST}`, {
    //             params: {
    //                 page: currentPage,
    //                 pageSize: pageSize,
    //                 name: dataSearch,
    //                 // code: dataSearch,
    //             }
    //         });
    //         return response.data;
    //     } catch {
    //         return null;
    //     }
    // }
    //
    // const search = async (currentPage, pageSize, dataSearch) => {
    //     try {
    //         const res = await request.get(`${endPointAPI.ADMIN.CLASS.SEARCH}`, {
    //             params: {
    //                 page: currentPage,
    //                 pageSize: pageSize,
    //                 code: dataSearch,
    //                 name: dataSearch,
    //                 mentor: dataSearch,
    //             },
    //         });
    //         return res.data
    //     } catch  {
    //         return null;
    //     }
    // }
    //
    // const getListSortOrder = async (currentPage, pageSize, sortOrder, field) => {
    //     try {
    //         const response = await request.get(`${endPointAPI.ADMIN.CLASS.GET_LIST_SORT_ORDER}`, {
    //             params: {
    //                 page: currentPage,
    //                 pageSize: pageSize,
    //                 sortOrder: sortOrder,
    //                 field: field
    //             }
    //         });
    //         return response.data;
    //     } catch {
    //         return null;
    //     }
    // }
    
    const show = async (id) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/show`);
            return response.data;
        } catch {
            return null;
        }
    };

    const showClassListById = async (ids) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.CLASS.SHOW_CLASS_LIST_BY_ID}`, ids);
            return response.data;
        } catch {
            return null;
        }
    }

    const showClassListByCode = async (currentPage, pageSize, sortOrder, field, dataSearch, codes) => {
        try {
            const response = await request.get(`/${endPointAPI.ADMIN.CLASS.SHOW_CLASS_LIST_BY_CODE}`,{
                params: {
                    page: currentPage,
                    pageSize: pageSize,
                    sortOrder: sortOrder,
                    field: field,
                    name: dataSearch,
                    codes,
                }
            });
            return response.data;
        } catch {
            return null;
        }
    }

    const showStudentList = async (id) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/student/show-student-list`);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasStudentList = async () => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.CLASS.HAS_STUDENT_LISTS}`);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasByCode = async (code) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${code}/has-by-code`,);
            return res.data;
        } catch {
            return null;
        }
    }

    const hasByName= async (name) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${name}/has-by-name`);
            return res.data;
        } catch {
            return null;
        }
    }

    const searchByName = async (name) => {
        try {
            const res = await request.get(`/${endPointAPI.ADMIN.CLASS.SEARCH_BY_NAME}`, name);
            return res.data;
        } catch {
            return null;
        }
    }
    
    const store = async (data) => {
        return await request.post(`/${endPointAPI.ADMIN.CLASS.STORE}`, data);
    };
    
    const update = async (id, dataClass) => {
        return await request.patch(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/update`, dataClass);
    };

    const updateStatus = async (id, status) => {
        return await request.patch(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/update-status`,{ status: status}
        );
    };
    
    const deleteClass = async (id) => {
        return await request.delete(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/delete`);
    };

    const deleteMultiple = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.CLASS.DELETE_MULTIPLE}`, ids);
            return res.data;
        } catch (error) {
            console.error('Error deleting multiple records:', error);
            return null;
        }
    };

    const record = async (id) => {
        try {
            return await request.post(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/record`);
        } catch  {
            return null;
        }
    };

    const recordMultiple = async (ids) => {
        try {
            const res = await request.post(`/${endPointAPI.ADMIN.CLASS.RECORD_MULTIPLE}`, ids);
            return res.data;
        } catch  {
            return null;
        }
    }

    const importClass = async (data) => {
        try {
            const res = await apiFormData.post(`/${endPointAPI.ADMIN.CLASS.IMPORT_EXCEL_DATA}`, data);
            return res.data;
        } catch (error){
            console.error('There was an error upload the file!', error);
            return null;
        }
    }

    const exportCSV = async (data) => {
        try {
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.CLASS.EXPORT_CSV}`, {
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
            const res = await apiFormData.get(`/${endPointAPI.ADMIN.CLASS.EXPORT_XLSX}`, {
                params:data,
                responseType: 'blob',
            });
            return res.data;
        } catch (error) {
            console.error('There was an error downloading the file!', error);
            return null;
        }
    }

    //recycle
    const recycle = async (currentPage, pageSize, value) => {
        try {
            const response = await request.
                get(`${endPointAPI.ADMIN.CLASS.RECYCLE}?page=${currentPage}&pageSize=${pageSize}`, {
                    params: {
                        name: value
                    }
            });
            return response.data;
        } catch  {
            return null;
        }
    }

    const showRecycled = async (id) => {
        try {
            const response = await request.
            get(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/show-recycled`);
            return response.data;
        } catch  {
            return null;
        }
    }

    const restore = async (id) => {
        try {
            const response = await request
                .post(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/restore`);
            return response.data;
        } catch  {
            return null;
        }
    }

    const restoreMultiple = async (ids) => {
        try {
            const response = await request
                .post(`/${endPointAPI.ADMIN.CLASS.RESTORE_MULTIPLE}`, ids);
        } catch  {
            return null;
        }
    }

    const restoreAll = async () => {
        try {
            const response = await request
                .post(`/${endPointAPI.ADMIN.CLASS.RESTORE_ALL}`);
            return response.data;
        } catch  {
            return null;
        }
    }

    const forceDelete = async (id) => {
        try {
            const response = await request
                .delete(`/${endPointAPI.ADMIN.CLASS.GET_LIST}/${id}/force-delete`);
            return response.data;
        } catch {
            return null;
        }
    }

    const forceDeleteMultiple = async (ids) => {
        try {
            const response = await request
                .delete(`/${endPointAPI.ADMIN.CLASS.FORCE_DELETE_MULTIPLE}`, ids);
            return response.data;
        } catch  {
            return null;
        }
    }

    const forceDeleteAll = async () => {
        try {
            const response = await request
                .delete(`/${endPointAPI.ADMIN.CLASS.FORCE_DELETE_ALL}`);
            return response.data;
        } catch  {
            return null;
        }
    }

    return {
        getListClass,
        // getListClassPaginate,
        // getListSortOrder,
        show,
        hasByCode,
        hasByName,

        store,
        showClassListById,
        showClassListByCode,
        showStudentList,
        update,
        updateStatus,
        deleteClass,
        record,
        recordMultiple,
        deleteMultiple,

        //
        importClass,
        exportCSV,
        exportXLSX,
        // search,

        //recycle
        recycle,
        restore,
        restoreMultiple,
        restoreAll,
        forceDelete,
        forceDeleteMultiple,
        forceDeleteAll,
    };
};

export default classService;