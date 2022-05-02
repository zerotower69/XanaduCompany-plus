/**@description 设置全局状态 */

import { createStore } from 'vuex' 

interface rootState {
    BannerHeight:string|number,
    headerShadowActive:boolean,
    headerShow:boolean,
    headerLogoShow:boolean,
    navDarkActive:boolean,
    articlePath:string
}

import { computed } from "vue";
import { mapState, useStore } from "vuex"

export const useMapState = (getKeys:string[]) => {

    const store = useStore();
    
    const storeState = {}
    const storeFns = mapState(getKeys)

    Object.keys(storeFns).forEach((fnKeys:any) => {
        const fn = storeFns[fnKeys].bind({$store: store})
        //@ts-ignore
        storeState[fnKeys] = computed(fn)
    })

    return storeState
}

const store=createStore<rootState>({
    state: {
        BannerHeight: 0,
        headerShadowActive:false,
        headerShow: false,
        headerLogoShow: true,
        navDarkActive: false,
        articlePath:''
    },
    mutations: {
        //设置雪碧图高度
        setBannerHeight(state:rootState,value:string|number){
            state.BannerHeight = value;
        },
        //
        setShadowActive(state:rootState,value:boolean){
            state.headerShadowActive=value;
        },
        //
        setHeaderShow(state:rootState,value:boolean){
            state.headerShow=value;
        },
        //
        setHeaderLogo(state:rootState,value:boolean){
            state.headerLogoShow = value;
        },
        //
        setNavDarkActive(state:rootState,value:boolean){
            state.navDarkActive = value;
        },
        SET_ARTICLE_PATH(state:rootState,path:string){
            state.articlePath=path
        }
    },
    actions: {
        setArticlePath({commit},path:string){
            return new Promise(resolve=>{
                commit('SET_ARTICLE_PATH',path);
                resolve({});
            })
        }
    },
    modules: {
        
    }
}) 
export default store