module.exports = function solveSudoku(matrix) {
  return resolveSingleSudoku(matrix)
}
const SECTOR_SIZE = 3
const POSSIBLE_NUMBERS = [1,2,3,4,5,6,7,8,9]
function getCurrentRow(y,matrix){
  return matrix[y]
}

function getCurrentColumn(x,matrix){
  return matrix.map(value=> value[x])
}

function getCurrentSector(x,y,matrix){
  let res = []
  let beginYindex = Math.floor(y/SECTOR_SIZE)*SECTOR_SIZE

  for(let i = beginYindex; i < (beginYindex+SECTOR_SIZE);i++){
    let value = matrix[i]
    let beginingXIndex = Math.floor(x/SECTOR_SIZE)*SECTOR_SIZE
    res.push([value[beginingXIndex], value[beginingXIndex+1], value[beginingXIndex+2]])
  }

  return res.reduce((resArray,arr)=>resArray = resArray.concat(arr),[])
}

function inCurrentColumnRowOrSection(value,array){
  return array.indexOf(value) !== -1
}

function getCondidats(columnArray, rowArray, sectorArray){
  let obj = {}
  columnArray.map(value=>{
    obj[value] = true
  })
  rowArray.map(value=>{
    obj[value] = true
  })
  sectorArray.map(value=>{
    obj[value] = true
  })

  return POSSIBLE_NUMBERS.filter(value=> Object.keys(obj).indexOf(String(value)) === -1)
}

function checkNull(matrix){
  return matrix.some(array=>array.indexOf(0) !== -1)
}
function resolveSingleSudoku(matrix){
  let count = 0
  while(checkNull(matrix) && count< 81 ){
    count++;
    let tmp = matrix.map((array,y)=>
      array.map((value,x)=>{
        let condidats = getCondidats(getCurrentColumn(x,matrix),getCurrentRow(y,matrix),getCurrentSector(x,y,matrix))
        if(value === 0 && (condidats.length === 1))
          return condidats[0]
        return value
      })
    )

    matrix = tmp
  }

  return matrix
}

function toMatrixWithCondidats(matrix){
  return matrix.map((array,y)=>
    array.map((value,x)=>{
      if(value===0)
        return getCondidats(getCurrentColumn(x,matrix),getCurrentRow(y,matrix),getCurrentSector(x,y,matrix))
      return value
    })
  )
}
function resolveTwo(blockWithCondidats){
    blockWithCondidats.map(block=>{
      let equals = equalCondidatesInArray(toArrayWithCondidats(block)).reduce((acc,value)=> typeof value === 'object'?acc.concat(value):acc,[])
      console.log(deleteEmptyCondidates(checkSingleCondidate(reduceCondidatsInBlock(block,equals))))
      // treaples?
    })
}

function checkSingleCondidate(blocks){
  return blocks.map(block=> block.map(value=> (typeof value === 'object' && value.length===1)?value[0]:value))
}

function deleteEmptyCondidates(blocks){
  return blocks.map(block=> block.map(value=> (typeof value === 'object' && value.length===0)?0:value))
}
function reduceCondidatsInBlock(block,array ){
  return block.map(condidate=>
    condidate.map(value=>{
      if(typeof value === 'object')
        return deleteOneArrayFromAnother(array,value)
      return value
    })
  )
}
function equalCondidatesInArray(array){
  return array
          .map(value=>JSON.stringify(value))
          .filter((condidate,i,arr)=>arr.indexOf(condidate,i+1)!==-1)
          .map(value=>JSON.parse(value))
}
function toArrayWithCondidats(blocks){
  let j=0
  let res = []
  blocks.map(block=>{
    for(let i=0;i<3;i++){
      if(typeof block[i] === 'object')
        res[j++]=block[i]
    }
  })
  return res
}

function getBlocks(matrix){
  let res= []
  for(let y=0;y<3;y++){
    for(let x=0;x<3;x++){
      res.push([[matrix[SECTOR_SIZE*y][SECTOR_SIZE*x],matrix[SECTOR_SIZE*y][SECTOR_SIZE*x+1], matrix[SECTOR_SIZE*y][SECTOR_SIZE*x+2]],
                [matrix[SECTOR_SIZE*y+1][SECTOR_SIZE*x],matrix[SECTOR_SIZE*y+1][SECTOR_SIZE*x+1],matrix[SECTOR_SIZE*y+1][SECTOR_SIZE*x+2]],
                [matrix[SECTOR_SIZE*y+2][SECTOR_SIZE*x],matrix[SECTOR_SIZE*y+2][SECTOR_SIZE*x+1],matrix[SECTOR_SIZE*y+2][SECTOR_SIZE*x+2]]])
      }
  }
  return res
}

function deleteOneArrayFromAnother(arrayToDelete,matchArray){
  return matchArray.filter( function( el ) {
    return arrayToDelete.indexOf( el ) < 0;
  } );
}

resolveTwo( getBlocks(toMatrixWithCondidats([
  [6, 5, 0, 7, 3, 0, 0, 8, 0],
  [0, 0, 0, 4, 8, 0, 5, 3, 0],
  [8, 4, 0, 9, 2, 5, 0, 0, 0],
  [0, 9, 0, 8, 0, 0, 0, 0, 0],
  [5, 3, 0, 2, 0, 9, 6, 0, 0],
  [0, 0, 6, 0, 0, 0, 8, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 6],
  [0, 0, 7, 0, 0, 0, 0, 5, 0],
  [1, 6, 5, 3, 9, 0, 4, 7, 0]
])))

// console.log(deleteOneArrayFromAnother([1,2],[1,2,3,4,5,6]))

// console.log(equalCondidatesInArray([[1,2,3],[0,0],[1,2],[1,2],[1,1,1,1],[1,1,1,1]]))