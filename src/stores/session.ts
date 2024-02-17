import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {

  state:()=> {
    return {
      validity: false,
    };
  },
  getters:{
    getSession:(state)=>{
      return state.validity
    }
  },
  actions:{
    setSession(value:boolean){
        this.validity=value
    },
    reset(){
      this.validity=false
    }
  }
  
})