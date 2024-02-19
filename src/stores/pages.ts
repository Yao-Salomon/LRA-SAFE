import { defineStore } from 'pinia'

export const usePagesStore = defineStore('pages', {

  state:()=> {
    if(localStorage.getItem("lastPageVisited")){
      return JSON.parse(localStorage.getItem("lastPageVisited")!);
    }
    return {
        lastPageVisited: '/',
    };
  },
  getters:{
    getLastPageVisited:(state)=>{
      return state.lastPageVisited
    }
  },
  actions:{
    setLastPageVisited(value:string){
        this.lastPageVisited=value
    },
    reset(){
      this.lastPageVisited='/'
    }
  }
  
})