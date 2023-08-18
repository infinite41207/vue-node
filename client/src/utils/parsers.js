

export const modbusParse = (inData) => {
  var weight_with_reg = inData[0];
  var clear_tail = 0b00000000000000001111111111111111;
  var LE = weight_with_reg << 8;
  var BE = weight_with_reg >> 8;
  var str = (LE | BE) & clear_tail;

  if (str >= 50000) {
    var LE_1 = weight_with_reg & 0b0000000011111111;
    var BE_1 = weight_with_reg >> 8;

    var buf2 = Buffer.from([BE, LE]);
    var out = buf2.readInt16LE(0);

    return out;
  } else {
    return str;
  }
}

export const simpleParse = (inData) =>{
  return Number(inData
    .replace('S', "")
    .replace('S', "")
    .replace('kg', "")
  )
}


export const simpleParseTwice = (inData)=>{
  return Number(inData[1]
    .replace('S', "")
    .replace('S', "")
    .replace('kg', "")
  )
}
