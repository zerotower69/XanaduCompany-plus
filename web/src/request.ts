import { Message } from 'element-plus'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
const request =axios.create({
    timeout:10000,//10s
    baseURL:'http://localhost:3000'
})
    
request.interceptors.request.use((config:AxiosRequestConfig)=>{

    return config
})

request.interceptors.response.use(
    response=>{

        return response
    },
    error => {
        // Message.warning(error.message);

        return error;
    }
)


export default request