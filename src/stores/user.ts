import { defineStore } from 'pinia'

export const useUserSTore = defineStore('user', {

  state:()=> {
    if(localStorage.getItem("username")){
      return JSON.parse(localStorage.getItem("username")!);
    }
    return {
      username: '',
    };

  },
  getters:{
    getUsername:(state)=>{
      return state.username

    }
  },
  actions:{
    setUsername(value:string){
        this.username=value
    },
    reset(){
      this.username=""
    }
  }
  
})