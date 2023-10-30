const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");

const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=chechbox]");

const symbols='!@#$%^&*()?/.,:+-*/';
//initial me password ki length zero hai 
let password="";
let passwordLength=10;

//ik check box tick hai
let checkCount=1;
handleSlider();
//initial me strength ka color gray hoga

//set password length using slider
//handle slider ka itna kaam hai ki password ki length ko ui pr show  krwana 
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)+"%100%");
}

//set color indicator
setIndicator("#ccc");
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;  
}

//get random integer

  function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
  }

function  generateRandomNumber(){
    return getRndInteger(1,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=true;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper&& hasLower && hasNum&& passwordLength>=8){
        setIndicator("#0f0");
    }

    else if((hasUpper|| hasLower) && (hasNum||hasSym)&& passwordLength>=8){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }
}
//depends upon css
async function  copyContent(){
    try {
        await  navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to make copy wala text visible      
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

//slide aur paasword length jisse dono same rahe 

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});


//copy button tbhi hoga jb usme koi value padi hogi
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
       copyContent();
});


function handlecheckboxchange(){
        checkCount=1;
        allCheckBox.forEach((checkbox)=>{
             if(checkbox.checked)
               checkCount++;
        })

        //special case 
        if(passwordLength<checkCount){
             passwordLength=checkCount;
             handleSlider();
        }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange);
})

//sbase niche aur main wala generate button 

generateBtn.addEventListener('click',()=>{
    //none of the check box check
    // if(checkCount<=0)
    // return;

    if (passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //lets start journey to find new pass 
     console.log("started the journey");
    //remove old password 

    password="";

    //lets put the stuff put in checnkbox
    //jo jo checkbox check honnge hm use usse call krenge taki vo sare character ajaye
    
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
   
    let funArr=[];
     
    if(uppercaseCheck.checked){
       funArr.push(generateUpperCase);}

    if(lowercaseCheck.checked){
       funArr.push(generateLowerCase);}

    if(numbersCheck.checked){
       funArr.push(generateRandomNumber);}

    if(symbolsCheck.checked){
       funArr.push(generateSymbol);}

    //compulsory means ki jo jo tick ho uski family ke atleast ik to aye he phle phir uske baar random ho skte 
    //but kam se  kam ik to aye he 

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }
    console.log("compulsory addition done ");
    //remainning addition 

    for(let i=0;i<passwordLength-funArr.length;i++){
         let randIndex=getRndInteger(0,funArr.length);
         password+=funArr[randIndex]();
    }
      
    console.log("remaining done");

    function shufflepassword(array){
        //fisher yets method 
        for(let i=array.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            const temp= array[i];
            array[i]=array[j];
            array[j]=temp;
        }
        let str="";
        array.forEach((el)=>(str+=el));
        return str;

    }
    //shuffle the password 
    password=shufflepassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;
    console.log("started the journey");
    //calculating strength\

    calcStrength();

})