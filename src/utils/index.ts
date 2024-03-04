


export function filterArrayUnique(container:any){
    let ids=container.map((e:any)=>{
        return e.id
    })

    let sortedIds=[...new Set(ids)]

    let iterator=1;
    let uniques=[]

    for(let id in sortedIds){
        for(let index in container){
            if(container[index].id==sortedIds[id]){
                uniques.push(container[index])
            }
            
        }
        while(uniques.length>iterator){
            let popResult=uniques.pop()
        }
        iterator=iterator+1
    }
    return uniques
}

export function filterArrayByTrials(container:any,id:any){

}

export function getMaterialAbbrById(container:any,id:any,date:any,origin:any,situation:any){
    console.log("the parameters passed to the filter function getById",container,id);
    const dateParsed=new Date(date);
    console.log("The date used",dateParsed)
    if(Object.keys(container).length>0 && id.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.id==id;
        })
        
        const originTransformed=origin.trim().split(' ').reduce((accumulator:any,currentValue:any)=>accumulator+currentValue).replaceAll('é','e').replaceAll('à','a').replaceAll('è','ea').replaceAll('ç',"CC").toUpperCase();
        return material[0].materialAbbreviation.toUpperCase()+situation.toUpperCase()+originTransformed.toUpperCase()+dateParsed.getUTCDate()+(dateParsed.getUTCMonth()+1)+dateParsed.getFullYear()
    }else{
        return 0;
    }
    
}
export function getExternalIDById(container:any,id:any){
    
    if(Object.keys(container).length>0 && id.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.id==id;
        })
        
        return material[0].externalID
    }else{
        return '';
    }
    
}
export function getAbbrById(container:any,id:any){
    
    if(Object.keys(container).length>0 && id.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.id==id;
        })
        
        return material[0].materialAbbreviation
    }else{
        return '';
    }
    
}
export function getConstructionSiteById(container:any,id:any){
    
    if(Object.keys(container).length>0 && id.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.id==id;
        })
        
        return material[0].externalID
    }else{
        return '';
    }
    
}

export function getMaterialByCode(container:any,code:any){
    console.log("The probable problem source is: entered")
    if(Object.keys(container).length>0 && code.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.materialCode==code;
        })
        return material[0].materialExternalID
    }else{
        return '';
    }
    
}
export function getMaterialObjectByCode(container:any,code:any){
    console.log("The probable problem source is: entered")
    if(Object.keys(container).length>0 && code.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.materialCode==code;
        })
        return material[0]
    }else{
        return '';
    }
    
}
export function getMaterialIDByCode(container:any,code:any){
    
    if(Object.keys(container).length>0 && code.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.materialCode==code;
        })
        return material[0].materialId
    }else{
        return '';
    }
    
}

export function getTrialByID(container:any,id:any){
    
    if(Object.keys(container).length>0 && id.length>0){
        let trials=container.filter((element:any,index:number)=>{
            return element.id==id;
        })
        console.log("The trials oooooo",trials[0])
        return trials[0]
    }else{
        return '';
    }
    
}

export function getTrialsByCode(container:any,code:any){
   
    if(Object.keys(container).length>0 && code.length>0){

        let material=container.filter((element:any,index:number)=>{
            return element.materialCode==code;
        })
        if(material[0]==undefined){
            return undefined
        }else{
            return material[0]
        }
    }else{
        
        return undefined;
    }
    
}

export function getExternalIDByAbbr(container:any,abbr:any){
    
    if(Object.keys(container).length>0 && abbr.length>0){
        let material=container.filter((element:any,index:number)=>{
            return element.abbreviation==abbr;
        })
        
        return material[0].externalID
    }else{
        return '';
    }
    
}

export function checkValidCode(container:any,code:any){
    console.log("the container in check Valid Code-->",container);
    console.log("the code",code);

    let material=container.filter((element:any,index:number)=>{
        return element.materialCode==code
    })

    if(material.length==0){
        return true
    }else{
        return false
    }
}

