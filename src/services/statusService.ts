import axios from "axios";
import QueryString from "qs";
import main from "@/constants/main";
import { fetchToken } from "./tokenService";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_CL='/rest/services/lab_APIServices/fetchCommandLines'
const TRAIL_URL_NOTIFICATIONS_TREATMENT='/rest/services/lab_APIServices/markAsReadOrArchived'
const TRAIL_URL_INDICATORS='/rest/services/lab_APIServices/fetchIndicators'


const data = QueryString.stringify({
  'grant_type': 'client_credentials' 
});

export async function fetchCls(username:string,auth:string){
   const response=await  fetchToken(auth)
    .then((response) => {
        const dataParameters = {
            "username": username,
          };
          
        const configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_CL:PROD_URL+TRAIL_URL_CL,
        headers: { 
            'Authorization': `Bearer ${response}`
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
    .catch(() => {

    });

    return response;

}

export async function markAsReadOrArchived(notificationID:any,markAsRead:any,auth:string){
    const response=await fetchToken(auth)
     .then((response) => {
         const dataParameters = {
             "notificationID": notificationID,
             "markAsRead":markAsRead
           };
           
         const configParameter = {
         method: 'post',
         maxBodyLength: Infinity,
         url: DEBUG?DEBUG_URL+TRAIL_URL_NOTIFICATIONS_TREATMENT:PROD_URL+TRAIL_URL_NOTIFICATIONS_TREATMENT,
         headers: { 
             'Authorization': `Bearer ${response}`
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
     .catch(() => {
 
     });
 
     return response;
 
 }

 export async function fetchIndicators(username:string,auth:string){
  const response=await  fetchToken(auth)
   .then((response) => {
       const dataParameters = {
           "username": username,
         };
         
       const configParameter = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_INDICATORS:PROD_URL+TRAIL_URL_INDICATORS,
       headers: { 
           'Authorization': `Bearer ${response}`
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
   .catch(() => {

   });

   return response;

}


