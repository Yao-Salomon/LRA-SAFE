import { getFileByRef } from "@/services/reportingServices";


export async function downloadFile(fileRef:any,title:string,auth:string){
    const fileResponse=await getFileByRef(encodeURIComponent(fileRef),auth);
    const blob = new Blob([fileResponse], {
        type: 'application/pdf',
        });
    const link = document.createElement('a');
    // create a blobURI pointing to our Blob
    const URL = window.URL || window.webkitURL;
    
    link.href = URL.createObjectURL(blob);
    link.download = title;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
}