/** 
 * @description 请求用户以登录相关
 */

import request from '../request'

const useUserApi = () => {
    return {
        login
    }
}

/**
 * 登录
 * @param loginForm 
 * @returns 
 */
const login = (loginForm:any) => {
    return request.post('/web/signup',loginForm);
}

export default useUserApi