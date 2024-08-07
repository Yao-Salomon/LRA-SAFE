import axios from "axios";
import main from "@/constants/main";
import { fetchToken } from "./tokenService";

const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL_SESSION='/rest/services/lab_APIServices/checkTokenValidity'

export async function checkSessionValidity(username:string,auth:string){

  const response=fetchToken(auth)
  .then((response) => {
      const configSession = {
        method: 'get',
        maxBodyLength: Infinity,
        url: DEBUG?DEBUG_URL+TRAIL_URL_SESSION+`?username=${username}`:PROD_URL+TRAIL_URL_SESSION+`?username=${username}`,
        headers: { 
          'Authorization': `Bearer ${response}`
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
  .catch(() => {
    //
  });

  return response;
}