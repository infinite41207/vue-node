export default {

  executeConditionCode(str, args) {

    const conditionFunction = new Function('args', str);
    const conditionRes = conditionFunction(args);
    return conditionRes;
    
  },

  async executeAsyncConditionCode(str, args) {

    // const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    // const asyncFunc = new AsyncFunction(args, str);
    // asyncFunc(args);
    // return true;

    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    
    // Define two named arguments: inValue, delay
    const asyncFn = new AsyncFunction('args', str);
    
    // resolves to 'hello' after 100ms
    const result = await asyncFn(args);
    
    console.log('async result', result);

    // After 200ms the promise will be resolved with the value 'world'
    // asyncFn('world', 200).then((result) => {
    //     console.log(result);
    // });  
  },
  
}
