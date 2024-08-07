import axios from "axios";
import main from "@/constants/main";
import { fetchToken } from "./tokenService";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL_NOTIFICATIONS='/rest/services/lab_APIServices/fetchNotifications'
const TRAIL_URL_NOTIFICATIONS_TREATMENT='/rest/services/lab_APIServices/markAsReadOrArchived'


export async function fetchNotifications(username:string,auth:string){
   const response=await  fetchToken(auth)
    .then((response) => {
        const dataParameters = {
            "username": username,
          }; 
        const configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_NOTIFICATIONS:PROD_URL+TRAIL_URL_NOTIFICATIONS,
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
      return {}
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


