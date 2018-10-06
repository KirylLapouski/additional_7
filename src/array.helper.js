let {
    getCurrentRow,
    getCurrentColumn,
    getCurrentSector,
    getCondidats
  } =require('./condidats.helper')
module.exports = {
    deleteOneArrayFromAnother(arrayToDelete, matchArray) {
        return matchArray.filter(function (el) {
            return arrayToDelete.indexOf(el) < 0;
        });
    },
    entriesInArray(array,val,res) {
        let count = 0
        for (i = 0; i < array.length; i++)
            if (array[i] == val)
                count++;
        return count == res;
    },
    unique(arr) {
        var result = [];
      
        nextInput:for (var i = 0; i < arr.length; i++) {
            var str = arr[i]; // для каждого элемента
            for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
              if (result[j] == str) continue nextInput; // если да, то следующий
            }
            result.push(str);
          }
      
        return result;
    },
    toSimpleArray(arrayWithCondidats) {
        return arrayWithCondidats.map(value => typeof value === 'object' ? 0 : value)
    },
    toArrayWithCondidats(array,matrix,y){
        return array.map((value, x) => {
            if (value === 0)
                return getCondidats(getCurrentColumn(x, matrix), getCurrentRow(y, matrix), getCurrentSector(x, y, matrix))
            return value
        })
    },
    toArrayWithCondidatsFromBlock(blocks) {
        let j = 0
        let res = []
        blocks.map(block => {
          for (let i = 0; i < 3; i++) {
            if (typeof block[i] === 'object')
              res[j++] = block[i]
          }
        })
        return res
      },
    blocksToArray(blocks){
        return blocks.map(block=>{
            return block.reduce((res,val)=>res.concat(val),[])
        })
    },
    blockToArray(block){
        console.log(block)
        return block.reduce((res,val)=>res.concat(val),[])
    }
}