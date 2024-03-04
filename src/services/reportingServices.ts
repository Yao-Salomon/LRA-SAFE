import axios, { type ResponseType } from "axios";
import QueryString from "qs";
import { useSessionStore } from "../stores/session";
import { useUserSTore } from "../stores/user";
const DEBUG=import.meta.env.VITE_DEBUG
const DEBUG_URL=import.meta.env.VITE_REST_DEBUG_URL
const PROD_URL=import.meta.env.VITE_PROD_URL
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_REPORTING='/rest/services/lab_APIServices/getReportId'
const TRAIL_URL_TDR_REPORTING='/rest/services/lab_APIServices/getTDRReportId'
const TRAIL_URL_RUN_REPORTING='/rest/reports/run/'


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



export async function getReportId(username:string){
    
   const response=await  axios.request(config)
    .then((response) => {
        let token=response.data.access_token
        let dataParameters = {
            "username": username,
          };
          
        let configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_REPORTING:PROD_URL+TRAIL_URL_REPORTING,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        data : dataParameters
        };
        
        const responses=axios.request(configParameter)
        .then((object) => {
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
          console.log(error);
        });
        return responses;
    })
    .catch((error) => {

    });

    return response;

}

export async function runReport(reportId:string,parameters:any){
    
  const response=await  axios.request(config)
   .then((response) => {
       let token=response.data.access_token
       let dataParameters = {
           "parameters": parameters,
         };
       //ResponseType to arraybuffer. 
       let responseType:ResponseType="arraybuffer"

       let configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_RUN_REPORTING+reportId:PROD_URL+TRAIL_URL_RUN_REPORTING+reportId,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        data : dataParameters,
        responseType:responseType 
       };
       
       const responses=axios.request(configParameter)
       .then((object) => {
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
         console.log(error);
       });
       return responses;
   })
   .catch((error) => {

   });

   return response;

}

export async function getTDRReportId(username:string){
    
  const response=await  axios.request(config)
   .then((response) => {
       let token=response.data.access_token
       let dataParameters = {
           "username": username,
         };
         
       let configParameter = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_TDR_REPORTING:PROD_URL+TRAIL_URL_TDR_REPORTING,
       headers: { 
           'Authorization': `Bearer ${token}`
       },
       data : dataParameters
       };
       
       const responses=axios.request(configParameter)
       .then((object) => {
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
         console.log(error);
       });
       return responses;
   })
   .catch((error) => {

   });

   return response;

}

export async function runTDRReport(reportId:string,parameters:any){
    
  const response=await  axios.request(config)
   .then((response) => {
       let token=response.data.access_token
       let dataParameters = {
           "parameters": parameters,
         };
       //ResponseType to arraybuffer. 
       let responseType:ResponseType="arraybuffer"

       let configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_RUN_REPORTING+reportId:PROD_URL+TRAIL_URL_RUN_REPORTING+reportId,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        data : dataParameters,
        responseType:responseType 
       };
       
       const responses=axios.request(configParameter)
       .then((object) => {
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
         console.log(error);
       });
       return responses;
   })
   .catch((error) => {

   });

   return response;

}

