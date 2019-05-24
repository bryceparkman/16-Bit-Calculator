# 16-Bit-Calculator
A calculator written in javascript that uses strictly logic gates and recursion to perform it's calculations - no use of "+",
"-", "*", "/", or "%" in the code to perform mathematics. This calculator works the same way computers add and subtract, and the other operations are done with recursive adding and subtracting. It uses specific logic gates to  add one bit at a time whilst keeping track of the carry. (Known as a full adder)

## How does it work without those operators?
Binary addition works the exact same way decimal addition works, with a very simple carry digit of 1 or 0. Because adding binary works in 1s and 0s, we can use a logic gate to simulate this. If you look at the last column of digits (the first bit) in the table below it reads from top to bottom 0 1 1 0. This happens to be the same truth table as an XOR gate.</p>
    	    
| Addends | Sum |
| ------- | --- |
| 0 + 0 = | 00 |
| 0 + 1 = | 01 |
| 1 + 0 = | 01 |
| 1 + 1 = | 10 | 

<img src="https://qph.fs.quoracdn.net/main-qimg-c69bee7da1a4f2856f1cf2c05a8bae57" width="250">

The XOR operation is represented by "^" in javascript and most other languages.

## What about the other column?
The other column is the carry in a 1-bit adder, since it carries through to the next bit. This carry is only active if both inputs are a 1, which is identical to an AND gate (represented in code by &&).
So this means an XOR of the input gives you the one bit sum, and an AND of the input gives the carry digit. This is all we need to add two bits together.

<img src="https://qph.fs.quoracdn.net/main-qimg-92c32c968c9b0d2e519fc9d210128d7e" width="250">

## I thought this was a 16-bit calculator, not a 1-bit calculator...
Correct, but a 16-bit adder can be made by stringing 16 1-bit adders together, or in programming's case doing a for loop 16 times. However we didn't check for what happens if there is a carry digit going *into* the next bit, only a check if there was one going out. To account for this we need to add the carry in, and check if this carry causes a new carry that wouldn't be there before

To add this carry in, we can simply use an XOR gate again (it is the simplest adder). The inputs this time though are the output from the first XOR calculation for this bit, and the previous bit's carry. If it is the first bit, the carry is initialized as 0. This is analogous addition in which you write the carry over the two numbers and sum up the column. In programming this just has to be done in two steps because the gate only takes in two numbers at a time, not three. In the code this is represented by: (b1 ^ b2) ^ carry

However, we now need to check again if new addition causes a carry for the next bit. There are two scenarios in which there can be a carry now. The original scenario with the AND gate, which is that both digits going into the adder are 1, still applies. The other option is that after the first XOR calculation, if that comes out as a 1 and the carry digit is a 1 then there is now also a carry bit. This is also represented through an AND gate These two scenarios never overlap, because if both original digits are 1 the XOR gives 0. Since either of these options cause a carry, they are compounded with an OR gate (|| in the code). It is represented like so: carry = (b1 & b2) || ((b1 ^ b2) & carry)

<img src ='https://s33.postimg.cc/d57b5xg4v/550px-_Full-adder.svg.png'/>

Now that each bit can input a carry and two numbers and output a sum and a carry it can be chained as long as necessary, as many bits as needed. Each bit takes in the previous calculations carries, and the two digits of each number at that specific bit. The sum is then saved as part of the answer at that same specific bit, and the carry moves onto the next part. I restricted it to 16-bit to keep it relatively simple and fast, but it can be easily expanded.

## Ok, but that doesn't work for subtraction.
True. However, we need to talk about negatives in binary. There is a system divised for representing negative binary numbers, and it's known as the two's compliment. To keep it simple, it's calculated by taking it's positive equivalent and flipping each 0 and 1, and then incrementing by 1. It basically it allows for -5 + 5 to equal 0, and other additions to make sense which one's complement and signing can't do.

To subtract, I do the same thing addition does with a few changes. First the second number has to be turned into a negative number via two's complement, so its positive +  negative. (The same as subtracting). Flipping the bits is done via applying an XOR gate with 1 as an input and each bit as the other input. Looking back at the table above, 1 + 0 gives 01, and 1 + 1 gives 01. If you notice, the second addend and the first bit in the answer are flipped, which is exactly what we want. The XOR gate is very useful. Then, to add one, I used the first carry bit that was previously auto-assigned to 0. That effectively adds 1, and completes the two's complement calculation on the second number. Then the numbers can be added together normally.

This does cause a problem if the second number is larger than the first. 1-2 would result in 65535, or 2<sup>16</sup> -1. Notice the -1  in that math. While this is technically correct, since this is a calculator for humans we would rather see the "-1" answer. To fix this, if the second number is larger the answer is put through the twos compliment again which brings it back to it's positive equivalent, and a "-" sign is concatenated in front.</p>

## And the rest?
Multiplication, division, modulo, and exponents are simple now that we can add and subtract. Given two numbers, n1 and n2, multiplication is just adding n1 to itself *n2* times. Division is just recursive subtraction, and counting how many times n2 can be subtracted without dropping below 0. Modulo is also just recursive subtraction, except instead of counting it returns the number left over after subtracting as many times as it can. Finally, exponents are just recursively multiplying n1 to itself *n2* times.
