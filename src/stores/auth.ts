import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {

  state:()=> {
    if(localStorage.getItem("credential")){
      return JSON.parse(localStorage.getItem("credential")!);
    }
    return {
      credential: '',
    };

  },
  getters:{
    getCredential:(state)=>{
      return state.credential

    }
  },
  actions:{
    setCredential(value:string){
        this.credential=value
    },
    reset(){
      this.credential=""
    }
  }
  
})