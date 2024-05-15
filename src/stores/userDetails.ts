import { defineStore } from 'pinia'

export const useKeyStore = defineStore('userDetails', {

    state: () => {
        if(localStorage.getItem("userInfos")){
            return JSON.parse(localStorage.getItem("userInfos")!);
          }
          return {
            userInfos:{},
          };
        
    },
    getters:{
    getUserInfos:(state)=>{
        return state.userInfos
    }
    },
    actions:{
        setUserInfos(value:any){
            this.userInfos=value
        },
        reset(){
        this.userInfos={}
        }
    }
})