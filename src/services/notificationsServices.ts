import axios from "axios";
import QueryString from "qs";
import main from "@/constants/main";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_NOTIFICATIONS='/rest/services/lab_APIServices/fetchNotifications'
const TRAIL_URL_NOTIFICATIONS_TREATMENT='/rest/services/lab_APIServices/markAsReadOrArchived'


const data = QueryString.stringify({
  'grant_type': 'client_credentials' 
});



export async function fetchNotifications(username:string,auth:string){
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: DEBUG?DEBUG_URL+TRAIL_URL:PROD_URL+TRAIL_URL,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': 'Basic '+auth,
    },
    data : data
  };
   const response=await  axios.request(config)
    .then((response) => {
        const token=response.data.access_token
        const dataParameters = {
            "username": username,
          };
          
        const configParameter = {
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
    .catch(() => {
      return {}
    });

    return response;

}

export async function markAsReadOrArchived(notificationID:any,markAsRead:any,auth:string){
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: DEBUG?DEBUG_URL+TRAIL_URL:PROD_URL+TRAIL_URL,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': 'Basic '+auth,
    },
    data : data
  };
    const response=await  axios.request(config)
     .then((response) => {
         const token=response.data.access_token
         const dataParameters = {
             "notificationID": notificationID,
             "markAsRead":markAsRead
           };
           
         const configParameter = {
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
     .catch(() => {
 
     });
 
     return response;
 
 }


