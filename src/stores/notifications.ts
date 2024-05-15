import { defineStore } from 'pinia'

export const useNotifStore = defineStore('notifications', {

    state: () => {
          return {
            content:[],
          };
    },
    getters:{
    getContent:(state)=>{
        return state.content
    }
    },
    actions:{
        setContent(value:any){
            this.content=value
        },
        reset(){
        this.content=[]
        }
    }
})