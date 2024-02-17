import axios from "axios";
import QueryString from "qs";
import { useSessionStore } from "../stores/session";
import { useUserSTore } from "../stores/user";
import { useRouter } from 'vue-router'
const DEBUG=import.meta.env.VITE_DEBUG
const DEBUG_URL=import.meta.env.VITE_REST_DEBUG_URL
const PROD_URL=import.meta.env.VITE_PROD_URL
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_LOGIN='/rest/services/lab_APIServices/logUserIn'


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



export async function logUserIn(username:string,password:string){
    
   const response=await  axios.request(config)
    .then((response) => {
        let token=response.data.access_token
        let dataLogin = {
            "username": username,
            "password": password
          };
          
        let configLogin = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_LOGIN:PROD_URL+TRAIL_URL_LOGIN,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        data : dataLogin
        };
        
        const loginResponse=axios.request(configLogin)
        .then((object) => {
          const sessionStore=useSessionStore();
          const userStore=useUserSTore();
          const serviceResponse=object.data.response
          const user=object.data.user
        
          return object.data;  
        })
        .catch((error) => {
          console.log(error);
        });
        return loginResponse;
    })
    .catch((error) => {
       // router.push('/')
    });

    return response;

}