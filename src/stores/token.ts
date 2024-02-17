import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
import QueryString from "qs";


//Constants
const DEBUG=import.meta.env.VITE_DEBUG
const DEBUG_URL=import.meta.env.VITE_REST_DEBUG_URL
const PROD_URL=import.meta.env.VITE_PROD_URL
const TRAIL_URL='/oauth2/token'

let data = QueryString.stringify({
    'grant_type': 'client_credentials' 
  });
  
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: DEBUG?DEBUG_URL+TRAIL_URL:PROD_URL+TRAIL_URL,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': 'Basic emhkZm14YWZxZzppanVJY2dlWGNy',
    },
    data : data
  };



export const useTokenStore = defineStore('tokenizer', {

  state:()=> {
    if(localStorage.getItem("token")){
      return JSON.parse(localStorage.getItem("token")!);
    }
    return {
      token: '',
    };
  },
  getters:{
    getToken:(state)=>{
      return state.token
    }
  },
  actions:{
    async refreshToken(){
      await axios.request(config)
            .then((response) => {
                this.token=JSON.stringify(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
  }
  
})