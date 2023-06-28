export function assertIsNode(e: EventTarget): asserts e is Node{
    if(!e || !("nodeType" in e)){
        throw new Error('Node Expected')
    }
}

export function getNoOfPage(total:number, limit:number):number{
    return total/limit;
}

export function addComma(data:number){
    return data.toLocaleString()
}