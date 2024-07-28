import axios from "axios";
import QueryString from "qs";
import main from "@/constants/main";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_LOGIN='/rest/services/lab_APIServices/logUserIn'
const TRAIL_URL_OUT='/rest/services/lab_APIServices/logUserOut'


const data = QueryString.stringify({
  'grant_type': 'client_credentials' 
});


const config = {
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
        const token=response.data.access_token
        const dataLogin = {
            "username": username,
            "password": password
          };
          
        const configLogin = {
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

export async function logUserOut(username:string){
    
  const response=await  axios.request(config)
   .then((response) => {
       const token=response.data.access_token
       const dataLogout = {
           "username": username,
         };
         
       const configLogin = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_OUT:PROD_URL+TRAIL_URL_OUT,
       headers: { 
           'Authorization': `Bearer ${token}`
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

export async function updateUser(username:string,firstName:string,lastName:string,number:string,email:string){
    
  const response=await  axios.request(config)
   .then((response) => {
       const token=response.data.access_token
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
       url: DEBUG?DEBUG_URL+TRAIL_URL_OUT:PROD_URL+TRAIL_URL_OUT,
       headers: { 
           'Authorization': `Bearer ${token}`
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
