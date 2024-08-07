import axios from "axios";
import main from "@/constants/main";
import { fetchToken } from "./tokenService";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL_DRAFTED='/rest/services/lab_APIServices/fetchDraftedCommand'
const TRAIL_URL_COMMAND='/rest/services/lab_APIServices/fetchCommands'
const TRAIL_URL_MANAGE_DRAFTED='/rest/services/lab_APIServices/manageDraftedCommand'
const TRAIL_URL_MTLS='/rest/services/lab_APIServices/loadMTLs'
const TRAIL_URL_SITES='/rest/services/lab_APIServices/fetchConstructionSites'
const TRAIL_URL_SITUATION='/rest/services/lab_APIServices/fetchSituations'
const TRAIL_URL_CREATION='/rest/services/lab_APIServices/createCommand'

export async function fetchCommands(username:string,auth:string){
  const response=fetchToken(auth)
   .then((response) => {
       const dataParameters = {
           "username": username,
         };
         
       const configParameter = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_COMMAND:PROD_URL+TRAIL_URL_COMMAND,
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
    //
   });

   return response;

}

export async function fetchDraftedCommand(username:string,auth:string){
   const response=await  fetchToken(auth)
    .then((response) => {
        const dataParameters = {
            "username": username,
          };
          
        const configParameter = {
        method: 'post',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_DRAFTED:PROD_URL+TRAIL_URL_DRAFTED,
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
      //
    });

    return response;

}

export async function manageDraftedCommand(commandId:string,auth:string){
    const response=await  fetchToken(auth)
     .then((response) => {
         const dataParameters = {
             "commandId": commandId,
           };
           
         const configParameter = {
         method: 'post',
         maxBodyLength: Infinity,
         url: DEBUG?DEBUG_URL+TRAIL_URL_MANAGE_DRAFTED:PROD_URL+TRAIL_URL_MANAGE_DRAFTED,
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
        //
     });
 
     return response;
 
}

export async function loadMTLs(auth:string){
    const response=await  fetchToken(auth)
     .then((response) => {
           
         const configParameter = {
         method: 'post',
         maxBodyLength: Infinity,
         url: DEBUG?DEBUG_URL+TRAIL_URL_MTLS:PROD_URL+TRAIL_URL_MTLS,
         headers: { 
             'Authorization': `Bearer ${response}`
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
     .catch(() => {
        
     });
 
     return response;
 
}

export async function fetchConstructionSites(username:string,auth:string){
  const response=await fetchToken(auth)
   .then((response) => {
       const dataParameters = {
           "username": username,
         };
       const configParameter = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_SITES:PROD_URL+TRAIL_URL_SITES,
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
    //
   });

   return response;

}

export async function loadSituations(auth:string){
  const response=await  fetchToken(auth)
   .then((response) => {         
       const configParameter = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_SITUATION:PROD_URL+TRAIL_URL_SITUATION,
       headers: { 
           'Authorization': `Bearer ${response}`
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
   .catch(() => {
      //
   });

   return response;

}

export async function createCommand(username:string,constructionSite:any,command:any,auth:string){
  const response=await  fetchToken(auth)
   .then((response) => {
       const dataParameters = {
          "username":username,
          "constructionSite":constructionSite,
          "command":command
         };
         
       const configParameter = {
       method: 'post',
       maxBodyLength: Infinity,
       url: DEBUG?DEBUG_URL+TRAIL_URL_CREATION:PROD_URL+TRAIL_URL_CREATION,
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
    //
   });

   return response;
}


