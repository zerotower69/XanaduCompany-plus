/**
 * @description产品api
 * */

import request from '../request'

const useProductApi = () => {
    return {
        getProduct
    }
}

/**
 * 获取产品信息
 * @returns 
 */
const getProduct = () => {
    return request.get('/web/product');
}

export default useProductApi