import axios from "axios";
import QueryString from "qs";
import main from "@/constants/main";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_SESSION='/rest/services/lab_APIServices/checkTokenValidity'


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



export async function checkSessionValidity(username:string){

    const response=axios.request(config)
    .then((response) => {
        let token=response.data.access_token
        let expiring_date=JSON.stringify(response.data.expires_in)
        
        let configSession = {
          method: 'get',
          maxBodyLength: Infinity,
          url: DEBUG?DEBUG_URL+TRAIL_URL_SESSION+`?username=${username}&tokenExpectancy=${expiring_date}`:PROD_URL+TRAIL_URL_SESSION+`?username=${username}&tokenExpectancy=${expiring_date}`,
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        };
        
       const responses =axios.request(configSession)
        .then((object) => {
          return object.data
        })
        .catch((error) => {
          console.log(error);
        });
        return responses;
    })
    .catch((error) => {
      //
    });

    return response;
}