import axios from "axios";
import QueryString from "qs";
import { useSessionStore } from "../stores/session";
import { useRouter } from 'vue-router'
const DEBUG=import.meta.env.VITE_DEBUG
const DEBUG_URL=import.meta.env.VITE_REST_DEBUG_URL
const PROD_URL=import.meta.env.VITE_PROD_URL
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_SESSION='/rest/services/lab_APIServices/checkTokenValidity'


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



export async function checkSessionValidity(username:string){

    const router=useRouter()

    axios.request(config)
    .then((response) => {
        let token=response.data.access_token
        let expiring_date=JSON.stringify(response.data.expires_in)
        
        let configSession = {
          method: 'get',
          maxBodyLength: Infinity,
          url: DEBUG?DEBUG_URL+TRAIL_URL_SESSION+`?username=${username}&tokenExpectancy=${expiring_date}`:PROD_URL+TRAIL_URL_SESSION+`?username=${username}&tokenExpectancy=${expiring_date}`,
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        };
        
        axios.request(configSession)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const sessionStore=useSessionStore();
          
          if(response.data.status==200){
            sessionStore.setSession(true)
            console.log("case session Valid")
            router.push('/')
          }else{
            console.log("case session Expired")
            sessionStore.setSession(false)
            router.push('/login')
          }
          
        })
        .catch((error) => {
          console.log(error);
        });

    })
    .catch((error) => {
        router.push('/')
    });
}