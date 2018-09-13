# This is a parser program.

## Instructions
* Basically, it converts `.MAT` format files into `.json` format files. Following a set of rules.
* Every line in the MAT file has a specific meaning. They work as an instruction. 
* Lines, or instructions, get converted to a json object `{}` with specific properties.

## Example:
* MAT
```
@     R,10,20,2
```

* JSON
```json
{
    "type": "algorithm",
    "variable": "#2",
    "algorithm": "random",
    "min": "10",
    "max": "20"
}
```

## To run the program:

    * npm install
    * node index.js

## Questions:

1) Describe how the program works. You can go as deep as you want. Detail as much as you want. Be as much clear and concise as you can.

2) What does the first letter in each row of the `.MAT` file represents?

3) What the letter 'T' in the `.MAT` file represents?

4) What the letter 'V' in the `.MAT` file represents?

5) In line 5 of the `TSUBQ.MAT`. What is #1 and #2? What do they mean? Detail as much as you can.


## Send it back to: igor@pulacapital.com.au