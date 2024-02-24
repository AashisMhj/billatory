export function assertIsNode(e: EventTarget): asserts e is Node{
    if(!e || !("nodeType" in e)){
        throw new Error('Node Expected')
    }
}

export function getNoOfPage(total:number, limit:number):number{
    return Math.floor(total/limit) + 1;
}

export function addComma(data:number){
  if(data){
    return data.toLocaleString()
  }else {
    return '0'
  }
}

export function convertToWords(number:number) {
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
    if (number === 0) {
      return 'zero';
    }
  
    function convertNumber(n?:number) {
      let word = '';
      if(!n) return '';

      if(n < 0){
        return ''
      }

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

      console.log(word);
  
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

export function formatBytes(bytes:number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Function to pad character to left and right of a string of given length
 * @param inputString 
 * @param padLength 
 * @param padCharacter 
 * @returns 
 */
export function padString(inputString:string, padLength:number, padCharacter:string) {
  inputString = inputString.toString();
  padCharacter = padCharacter || ' ';

  const totalPadding = padLength - inputString.length;
  if (totalPadding <= 0) {
    return inputString;
  }

  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;

  const leftPaddedString = padCharacter.repeat(leftPadding) + inputString;
  const fullyPaddedString = leftPaddedString + padCharacter.repeat(rightPadding);

  return fullyPaddedString;
}
