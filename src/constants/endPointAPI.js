export const endPointAPI = {
    ADMIN: {
        CLASS: {
            GET_LIST: 'admins/classes',
            GET_PAGINATE: 'admins/classes/get-paginate',
            GET_LIST_SORT_ORDER: 'admins/classes/get-list-sort-order',
            SHOW_CLASS_LIST_BY_ID: 'admins/classes/show-class-list-by-id',
            SHOW_CLASS_LIST_BY_CODE: 'admins/classes/show-class-list-by-code',
            SEARCH: 'admins/classes/search',
            HAS_BY_CODE: 'admins/classes/has-by-code',
            HAS_BY_NAME: 'admins/classes/has-by-name',
            HAS_STUDENT_LISTS: 'admins/classes/has-student-list',

            STORE: 'admins/classes/store',
            UPDATE: 'admins/classes/update',
            DELETE_MULTIPLE: 'admins/classes/delete-multiple',
            RECORD_MULTIPLE: 'admins/classes/record-multiple',
            IMPORT_EXCEL_DATA: 'admins/classes/import-excel-data',
            EXPORT_CSV: 'admins/classes/export-csv',
            EXPORT_XLSX: 'admins/classes/export-xlsx',

            //recycle
            RECYCLE: 'admins/classes/recycle',
            RESTORE_MULTIPLE: 'admins/classes/restore-multiple',
            RESTORE_ALL: 'admins/classes/restore-all',
            FORCE_DELETE_MULTIPLE: 'admins/classes/force-delete-multiple',
            FORCE_DELETE_ALL: 'admins/classes/force-delete-all',
        },
        STUDENT: {
            GET_LIST: 'admins/students',
            SHOW_STUDENT_LIST: 'admins/students/show-student-list',
            HAS_BY_CODE: 'admins/students/has-by-code',
            HAS_BY_EMAIL: 'admins/students/has-by-email',

            STORE: 'admins/students/store',
            DELETE_MULTIPLE: 'admins/students/delete-multiple',
            RECORD_MULTIPLE: 'admins/students/record-multiple',
            IMPORT_EXCEL_DATA: 'admins/students/import-excel-data',
            EXPORT_CSV: 'admins/students/export-csv',
            EXPORT_XLSX: 'admins/students/export-xlsx',
            RECYCLE: 'admins/students/recycle',
        },
    },
    CLASS: 'classes',
    STUDENT: 'students'
}


