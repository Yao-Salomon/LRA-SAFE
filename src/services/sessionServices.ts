import axios from "axios";
import QueryString from "qs";
import main from "@/constants/main";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'
const TRAIL_URL_SESSION='/rest/services/lab_APIServices/checkTokenValidity'


const data = QueryString.stringify({
  'grant_type': 'client_credentials' 
});


export async function checkSessionValidity(username:string,auth:string){
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

    const response=axios.request(config)
    .then((response) => {
        console.log("The main response in the session: ",response)
        const token=response.data.access_token
        const expiring_date=JSON.stringify(response.data.expires_in)
        
        const configSession = {
          method: 'get',
          maxBodyLength: Infinity,
          url: DEBUG?DEBUG_URL+TRAIL_URL_SESSION+`?username=${username}&tokenExpectancy=${expiring_date}`:PROD_URL+TRAIL_URL_SESSION+`?username=${username}&tokenExpectancy=${expiring_date}`,
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        };
       const responses =axios.request(configSession)
        .then((object) => {
          console.log("The result of the main fetch: ",object)
          return object.data
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