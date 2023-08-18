export default {
  executeConditionCode: (str, args) => {
    const conditionFunction = new Function('args', str)
    const conditionRes = conditionFunction(args)
    return conditionRes
  },

  executeAsyncConditionCode: async (str, args) => {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

    // Define two named arguments: inValue, delay
    const asyncFn = new AsyncFunction('args', str)

    // resolves to 'hello' after 100ms
    const result = await asyncFn(args)

    console.log('async result', result)
  },
}
