import axios, { type ResponseType } from "axios";
import QueryString from "qs";
import main from "@/constants/main";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_REPORTING='/rest/services/lab_APIServices/getReportId'
const TRAIL_URL_TDR_REPORTING='/rest/services/lab_APIServices/getTDRReportId'
const TRAIL_URL_RUN_REPORTING='/rest/reports/run/'
const TRAIL_URL_FILE_REF='/rest/files'


const data = QueryString.stringify({
  'grant_type': 'client_credentials' 
});


export async function getReportId(username:string,auth:string){
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
        url: DEBUG?DEBUG_URL+TRAIL_URL_REPORTING:PROD_URL+TRAIL_URL_REPORTING,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        data : dataParameters
        };
        
        const responses=axios.request(configParameter)
        .then(() => {
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
    .catch(() => {

    });

    return response;

}

export async function runReport(reportId:string,parameters:any,auth:string){
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
           "parameters": parameters,
         };
       //ResponseType to arraybuffer. 
       const responseType:ResponseType="arraybuffer"

       const configParameter = {
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
       .then(() => {
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
   .catch(() => {

   });

   return response;

}

export async function getTDRReportId(username:string,auth:string){
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
       url: DEBUG?DEBUG_URL+TRAIL_URL_TDR_REPORTING:PROD_URL+TRAIL_URL_TDR_REPORTING,
       headers: { 
           'Authorization': `Bearer ${token}`
       },
       data : dataParameters
       };
       
       const responses=axios.request(configParameter)
       .then(() => {
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
   .catch(() => {

   });

   return response;

}

export async function runTDRReport(reportId:string,parameters:any,auth:string){
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
           "parameters": parameters,
         };
       //ResponseType to arraybuffer. 
       const responseType:ResponseType="arraybuffer"

       const configParameter = {
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
       .then(() => {
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
   .catch(() => {

   });

   return response;

}

export async function getFileByRef(fileRef:any,auth:string){
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
       //ResponseType to arraybuffer. 
       const responseType:ResponseType="arraybuffer"
       const configParameter = {
        method: 'get',
        maxBodyLength: Infinity,
        url: (DEBUG?DEBUG_URL+TRAIL_URL_FILE_REF:PROD_URL+TRAIL_URL_FILE_REF)+'?fileRef='+fileRef,
        headers: { 
            'Authorization': `Bearer ${token}`
        },
        responseType:responseType 
       };
       
       const responses=axios.request(configParameter)
       .then(() => {
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
   .catch(() => {

   });

   return response;

}

