export function assertIsNode(e: EventTarget): asserts e is Node{
    if(!e || !("nodeType" in e)){
        throw new Error('Node Expected')
    }
}