export function assertIsNode(e: EventTarget): asserts e is Node{
    if(!e || !("nodeType" in e)){
        throw new Error('Node Expected')
    }
}

export function getNoOfPage(total:number, limit:number):number{
    return Math.floor(total/limit) + 1;
}

export function addComma(data:number){
    return data.toLocaleString()
}

export function toDataURL(src:File | null){
    return new Promise((resolve, reject)=>{
        if(src){
            const fileReader = new FileReader();
            fileReader.onload = (e)=>{
                const dataURL = e.target?.result as string;
                resolve(dataURL)
            };
    
            fileReader.onerror = (error) =>{
                reject(error);
            }
    
            fileReader.readAsDataURL(src);
        }else{
            reject("File Not Found");
        }
    })
}