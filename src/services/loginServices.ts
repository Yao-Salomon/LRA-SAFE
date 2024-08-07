import axios from "axios";
import main from "@/constants/main";
import { fetchToken } from "./tokenService";
const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL_LOGIN='/rest/services/lab_APIServices/logUserIn'
const TRAIL_URL_CHANGE_PASSWORD='/rest/services/lab_APIServices/logUserIn'
const TRAIL_URL_UPDATE_USER='/rest/services/lab_APIServices/logUserIn'
const TRAIL_URL_OUT='/rest/services/lab_APIServices/logUserOut'

export async function logUserIn(username:string,password:string){
      
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: DEBUG?DEBUG_URL+TRAIL_URL_LOGIN:PROD_URL+TRAIL_URL_LOGIN,
    data : {
      "username":username,
      "password":password
    }
    };
   const response=await  axios.request(config)
    .then((response) => {
        return response.data;
    })
    .catch(() => {
      return {};
    });
    return response;

}

export async function logUserOut(username:string,auth:string){
  
  const response=await  fetchToken(auth)
   .then((response) => {
       const dataLogout = {
           "username": username,
         };
       const configLogin = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_OUT:PROD_URL+TRAIL_URL_OUT,
       headers: { 
           'Authorization': `Bearer ${response}`
       },
       data : dataLogout
       };
       
       const loginResponse=axios.request(configLogin)
       .then((object) => {
         return object.data;  
       })
       .catch((error) => {
         console.log(error);
       });
       return loginResponse;
   })
   .catch(() => {
     
   });

   return response;

}

export async function updateUser(username:string,firstName:string,lastName:string,number:string,email:string,auth:string){
  
  const response=await  fetchToken(auth)
   .then((response) => {
       const dataLoad = {
           "username": username,
           "firstName":firstName,
           "lastName":lastName,
           "number":number,
           "email":email
         };
         
       const configLogin = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_UPDATE_USER:PROD_URL+TRAIL_URL_UPDATE_USER,
       headers: { 
           'Authorization': `Bearer ${response}`
       },
       data : dataLoad
       };
       
       const loginResponse=axios.request(configLogin)
       .then((object) => {
         return object.data;  
       })
       .catch((error) => {
         console.log(error);
       });
       return loginResponse;
   })
   .catch(() => {
     
   });

   return response;

}

export async function changePassword(username:string,password:string,auth:string){
  const response=await  fetchToken(auth)
   .then((response) => {
       const dataLoad = {
           "username": username,
           "password":password,
         };
         
       const configLogin = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_CHANGE_PASSWORD:PROD_URL+TRAIL_URL_CHANGE_PASSWORD,
       headers: { 
           'Authorization': `Bearer ${response}`
       },
       data : dataLoad
       };
       
       const loginResponse=axios.request(configLogin)
       .then((object) => {
         return object.data;  
       })
       .catch((error) => {
         console.log(error);
       });
       return loginResponse;
   })
   .catch(() => {
     
   });

   return response;

}
