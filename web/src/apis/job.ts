/**
*  岗位api
 */

import request from '../request'
 
const useJobApi = () => {
    return {
        getJobDetail,
        getJobFilters,
        getJobList
    }
}

export default useJobApi

/**
 * 请求职位筛选条件
 */
const getJobFilters=()=>{
    return request.get('/web/job-filters')
}

/**
 * 请求职位列表
 * @param params 
 * @returns 
 */
const getJobList=(params:any)=>{
    return request.post('/web/job',params);
}

/**
 * 获取职位详情
 * @param jobPath 
 * @returns 
 */
const getJobDetail = (jobPath:string) => {
    return request.get('/web/job' + jobPath);
}