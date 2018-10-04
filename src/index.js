module.exports = function solveSudoku(matrix) {
  return resolveSudoku(matrix)
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
function resolveSudoku(matrix){
  while(checkNull(matrix)){
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

console.log(checkNull([
  [5, 3, 4, 6, 7, 8, 9, 0, 0],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
]))