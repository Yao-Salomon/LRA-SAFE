import axios from "axios";
import QueryString from "qs";
import { useSessionStore } from "../stores/session";
import { useUserSTore } from "../stores/user";
const DEBUG=import.meta.env.VITE_DEBUG
const DEBUG_URL=import.meta.env.VITE_REST_DEBUG_URL
const PROD_URL=import.meta.env.VITE_PROD_URL
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_DRAFTED='/rest/services/lab_APIServices/fetchDraftedCommand'
const TRAIL_URL_MANAGE_DRAFTED='/rest/services/lab_APIServices/manageDraftedCommand'
const TRAIL_URL_MTLS='/rest/services/lab_APIServices/loadMTLs'

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



export async function fetchDraftedCommand(username:string){
    
   const response=await  axios.request(config)
    .then((response) => {
        let token=response.data.access_token
        let dataParameters = {
            "username": username,
          };
          
        let configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_DRAFTED:PROD_URL+TRAIL_URL_DRAFTED,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        data : dataParameters
        };
        
        const responses=axios.request(configParameter)
        .then((object) => {
        
          return object.data;  
        })
        .catch((error) => {
          console.log(error);
        });
        return responses;
    })
    .catch((error) => {

    });

    return response;

}

export async function manageDraftedCommand(commandId:string){
    
    const response=await  axios.request(config)
     .then((response) => {
         let token=response.data.access_token
         let dataParameters = {
             "commandId": commandId,
           };
           
         let configParameter = {
         method: 'post',
         maxBodyLength: Infinity,
         url: DEBUG?DEBUG_URL+TRAIL_URL_MANAGE_DRAFTED:PROD_URL+TRAIL_URL_MANAGE_DRAFTED,
         headers: { 
             'Authorization': `Bearer ${token}`
         },
         data : dataParameters
         };
         
         const responses=axios.request(configParameter)
         .then((object) => {
         
           return object.data;  
         })
         .catch((error) => {
           console.log(error);
         });
         return responses;
     })
     .catch((error) => {
        
     });
 
     return response;
 
}

export async function loadMTLs(){
    
    const response=await  axios.request(config)
     .then((response) => {
         let token=response.data.access_token
           
         let configParameter = {
         method: 'post',
         maxBodyLength: Infinity,
         url: DEBUG?DEBUG_URL+TRAIL_URL_MTLS:PROD_URL+TRAIL_URL_MTLS,
         headers: { 
             'Authorization': `Bearer ${token}`
         }
         };
         
         const responses=axios.request(configParameter)
         .then((object) => {
         
           return object.data;  
         })
         .catch((error) => {
           console.log(error);
         });
         return responses;
     })
     .catch((error) => {
        
     });
 
     return response;
 
}



