import axios from "axios";
import QueryString from "qs";
import main from "@/constants/main";


const DEBUG=main.debug
const DEBUG_URL=main.urlDev
const PROD_URL=main.urlProd
const TRAIL_URL='/oauth2/token'


const data = QueryString.stringify({
  'grant_type': 'client_credentials' 
});

export async function fetchToken(auth:string){
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

    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expires_in");

    if(token!=null){
        const expiryDate = new Date(Date.now() + Number(expiry) * 1000);
        if(new Date()<expiryDate){
            return token
        }else{
            const response=axios.request(config)
            .then((response) => {
                const token=response.data.access_token
                const expires_in=JSON.stringify(response.data.expires_in)
                localStorage.setItem("token",token);
                localStorage.setItem("expires_in",expires_in);
                return token
            })
            .catch(() => {});
            console.log("The direct path ",token);
            return response;
        }
    }else{
        const response=axios.request(config)
            .then((response) => {
                const token=response.data.access_token
                const expires_in=JSON.stringify(response.data.expires_in)
                localStorage.setItem("token",token);
                localStorage.setItem("expires_in",expires_in);
                return token
            })
            .catch(() => {});
            return response;
    }
}