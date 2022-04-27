import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
    state: () => {
        return {
            bannerHeight: 0,
            headerShadowActive: false,
            headerShow: false,
            headerLogoShow: true,
            navDarkActive: false,
            articlePath: ''
        }
    },
    actions: {
        setBannerHeight(value:number){
            this.bannerHeight=value
        },
        setHeaderLogo(val:boolean){
            this.headerLogoShow=val
        },
        setShadowActive(val:boolean){
            this.headerShadowActive=val
        },
        setHeaderShow(val:boolean){
            this.headerShow = val;
        },
        setNavDarkActive(val:boolean){
            this.navDarkActive = val;
        },
        SET_ARTICLE_PATH(val:string){
            this.articlePath=val;
        }
    }
})