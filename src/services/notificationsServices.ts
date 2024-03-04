import axios from "axios";
import QueryString from "qs";
import { useSessionStore } from "../stores/session";
import { useUserSTore } from "../stores/user";
const DEBUG=import.meta.env.VITE_DEBUG
const DEBUG_URL=import.meta.env.VITE_REST_DEBUG_URL
const PROD_URL=import.meta.env.VITE_PROD_URL
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_NOTIFICATIONS='/rest/services/lab_APIServices/fetchNotifications'
const TRAIL_URL_NOTIFICATIONS_TREATMENT='/rest/services/lab_APIServices/markAsReadOrArchived'


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



export async function fetchNotifications(username:string){
    
   const response=await  axios.request(config)
    .then((response) => {
        let token=response.data.access_token
        let dataParameters = {
            "username": username,
          };
          
        let configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_NOTIFICATIONS:PROD_URL+TRAIL_URL_NOTIFICATIONS,
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

export async function markAsReadOrArchived(notificationID:any,markAsRead:any){
    
    const response=await  axios.request(config)
     .then((response) => {
         let token=response.data.access_token
         let dataParameters = {
             "notificationID": notificationID,
             "markAsRead":markAsRead
           };
           
         let configParameter = {
         method: 'post',
         maxBodyLength: Infinity,
         url: DEBUG?DEBUG_URL+TRAIL_URL_NOTIFICATIONS_TREATMENT:PROD_URL+TRAIL_URL_NOTIFICATIONS_TREATMENT,
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


