var calc = document.getElementById("calc");
	    var exBox = document.getElementById("ex");
	    var re = /^\d+[\+\-\*\/\%\^]?\d+$/;
	    var re2 = /^[^\w\d]$/;
	    var operator;
	    
	    function showEx(){
	        if(exBox.style.display == "none"){
	            exBox.setAttribute("style", "display:initial");
	        } else if (exBox.style.display == "initial"){
	            exBox.setAttribute("style", "display:none");
	        }
	    }
	    
	    function calcInput(){
	        if (re.test(calc.value)) {
	            operatorIdx = calc.value.search(/[^\w\d]/);
	            var num1 = parseInt(calc.value.substring(0,operatorIdx));
	            var num2 = parseInt(calc.value.substring(operatorIdx+1));
	            switch(calc.value.charAt(operatorIdx)){
	                case '+' : calc.value = add(num1,num2); break;
	                case '-' : calc.value = sub(num1,num2); break;
	                case '*' : calc.value = mul(num1,num2); break;
	                case '/' : calc.value = div(num1,num2); break;
	                case '%' : calc.value = mod(num1,num2); break;
	                case '^' : calc.value = exp(num1,num2); break;
	                default : calc.value = "Input not supported";
	            }
	        } else {
	            calc.value = "Input not supported"
	        }
	    }
	    
	    function add(n1, n2){
	        var bAns = ""
	        var b1 = ("0000000000000000" + n1.toString(2)).substring(n1.toString(2).length); //Turning the decimal to 8-bit binary
	        var b2 = ("0000000000000000" + n2.toString(2)).substring(n2.toString(2).length); //Turning the decimal to 8-bit binary
	        var carry = 0;
	        
	        for(k=15;k>=0;k--){
	            var res = (b1.charAt(k) ^ b2.charAt(k)) ^ carry;
	            carry = (b1.charAt(k) & b2.charAt(k)) || ((b1.charAt(k) ^ b2.charAt(k)) & carry);
	            bAns = res + bAns; //Concatenating the binary digits in reverse order, not adding
	        }
	        
	        return parseInt(bAns,2);
	    }
	    
	    function sub(n1, n2){
	        var bAns = ""
	        var b1 = ("0000000000000000" + n1.toString(2)).substring(n1.toString(2).length); //Turning the decimal to 8-bit binary
	        var b2 = ("0000000000000000" + n2.toString(2)).substring(n2.toString(2).length); //Turning the decimal to 8-bit binary
            carry = 1; //Used for twos-complement, never
            b2Compliment = "";
            
            for(k=0;k<16;k++){
                b2Compliment += (1^b2.charAt(k)); //Turning the second number into the ones-compliment
            }
	        
            for(k=15;k>=0;k--){
	            var res = (b1.charAt(k) ^ b2Compliment.charAt(k)) ^ carry;
	            carry = (b1.charAt(k) & b2Compliment.charAt(k)) || ((b1.charAt(k) ^ b2Compliment.charAt(k)) & carry);
	            bAns = res + bAns; //Concatenating the binary digits in reverse order, not adding
	            
	        }

	        if (n2 > n1){ //If it results in a negative number
	            var bAns2 = "";
	            carry = 0;
	            b2 = "0000000000000001";
	            for(k=0;k<16;k++){ //Flip the answer again
                    bAns2 += (1^bAns.charAt(k));
	            }
	            
	            bAns = "";

	            for(j=15;j>=0;j--){ //Add one again
	                res = (bAns2.charAt(j) ^ b2.charAt(j)) ^ carry;
	                carry = (bAns2.charAt(j) & b2.charAt(j)) || ((bAns2.charAt(j) ^ b2.charAt(j)) & carry);
	                bAns = res + bAns; //Concatenating the binary digits in reverse order, not adding
	            } 
	            
	            bAns = "-" + bAns; //This results in the number being how humans use negative numbers.
	        }
	        
	        return parseInt(bAns,2); //Return to decimal
	    }
	    
	    function mul(n1, n2){
	        if(n2 == 0 || n1 == 0){
	           return 0;
	        } else if (n2 > 1){
	            return add(n1,mul(n1,sub(n2,1)));
	        } else {
	            return n1;
	        }
	    }
	    
	    function div(n1,n2){
	        if( n1 < n2){
		        return 0;
	        } else if (n2 == 0){
	            return "Error";
	        }
            return add(div(sub(n1,n2), n2),1);
	    }
	    
	    function mod(n1, n2){
	       if( n1 < n2){
		        return n1;
	        } else if (n2 == 0){
	            return "Error";
	        }
            return mod(sub(n1,n2), n2);
	    }
	    
	    function exp(n1,n2){
	        if(n1 == 0){
	           return 0;
	        } else if (n2 == 0){
	            return 1;
	        } else if (n2 > 1){
	            return mul(n1,exp(n1,sub(n2,1)));
	        } else {
	            return n1;
	        }
	    }
	    
	   /* function fact(n1){
	        if(n1 == 0) {
                return 1
            } else {
                return mul(fact(sub(n1,1)),n1);
             }
	    }*/// Functionally correct, but overloads console with too much recursion. :()