import request from '../request'

const useNewsApi = () => {
    return {
        apiGetHotNews,
        searchNewsByKeyword,
        getNewsItems,
        getNewsDetail,
        getRecommendNews
    }
}

/**
 * 获取热点新闻
 * @param params 
 * @returns 
 */
const apiGetHotNews = () => {
     return request.get('/web/hotnews');
}

/**
 * 通过关键词搜索新闻
 * @param querystring 
 * @returns 
 */
const searchNewsByKeyword = (querystring: string) => {
    return request.get('/web/searchnews' + querystring);
}

/**
 * 根据新闻 类型、日期 查询新闻，并按日期排序
 * @param params 
 * @returns 
 */
const getNewsItems = (params:any) => {
    return request.get('/web/newslist', {
        params
    })
}

/**
 * 获取推荐的新闻
 * @returns 
 */
const getRecommendNews=() => {
    return request.get('/web/recomNews');
}

/**
 * 获取新闻详情
 * @param articlePath 
 * @returns 
 */
const getNewsDetail = (articlePath:string) => {
    return request.get('/web/article/' + articlePath);
}


export default useNewsApi