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

export function convertToWords(number:number) {
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
    if (number === 0) {
      return 'zero';
    }
  
    function convertNumber(n:number) {
      let word = '';
  
      if (n < 10) {
        word = units[n];
      } else if (n < 20) {
        word = teens[n % 10];
      } else if (n < 100) {
        word = tens[Math.floor(n / 10)] + ' ' + convertNumber(n % 10);
      } else if (n < 1000) {
        word = units[Math.floor(n / 100)] + ' hundred ' + convertNumber(n % 100);
      } else if (n < 100000) {
        word = convertNumber(Math.floor(n / 1000)) + ' thousand ' + convertNumber(n % 1000);
      } else if (n < 10000000) {
        word = convertNumber(Math.floor(n / 100000)) + ' lakh ' + convertNumber(n % 100000);
      }
  
      return word.trim();
    }
  
    return convertNumber(number);
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

export function getSearchParams(searchParams: URLSearchParams, key: string): number | null {
  const value = searchParams.get(key)
  if (value) {
      const parsed_id = parseInt(value);
      if (parsed_id) {
          return parsed_id;
      }
      return null;
  }
  return null;
}
