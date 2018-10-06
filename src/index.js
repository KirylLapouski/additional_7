let {
  deleteOneArrayFromAnother,
  entriesInArray
} = require('./array.helper')
let {
  getCurrentRow,
  getCurrentColumn,
  getCurrentSector,
  getBlocksFromSimpleMatrix,
  toMatrixFromBlocks,
  transpose
} = require('./matrix.helper')

function toSimpleMatrix(matrixWithCondidats) {
  return matrixWithCondidats.map(row => row.map(value => typeof value === 'object' ? 0 : value))
}

function toMatrixWithCondidats(matrix) {
  return matrix.map((array, y) =>
    array.map((value, x) => {
      if (value === 0)
        return getCondidats(getCurrentColumn(x, matrix), getCurrentRow(y, matrix), getCurrentSector(x, y, matrix))
      return value
    })
  )
}
module.exports = function solveSudoku(matrix) {
  return resolveTwo(resolveSingleSudoku(matrix))
}
const POSSIBLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function inCurrentColumnRowOrSection(value, array) {
  return array.indexOf(value) !== -1
}

function getCondidats(columnArray, rowArray, sectorArray) {
  let obj = {}
  columnArray.map(value => {
    obj[value] = true
  })
  rowArray.map(value => {
    obj[value] = true
  })
  sectorArray.map(value => {
    obj[value] = true
  })

  return POSSIBLE_NUMBERS.filter(value => Object.keys(obj).indexOf(String(value)) === -1)
}

function checkNull(matrix) {
  return matrix.some(array => array.indexOf(0) !== -1)
}

function resolveSingleSudoku(matrix) {
  let count = 0
  while (checkNull(matrix) && count < 9) {
    count++;
    let tmp = matrix.map((array, y) =>
      array.map((value, x) => {
        let condidats = getCondidats(getCurrentColumn(x, matrix), getCurrentRow(y, matrix), getCurrentSector(x, y, matrix))
        if (value === 0 && (condidats.length === 1))
          return condidats[0]
        return value
      })
    )
    matrix = tmp
  }
  return matrix
}


function resolveTwo(matrix) {
  let blocks = getBlocksFromSimpleMatrix(toMatrixWithCondidats(matrix)).map(block => {
    let equals = equalCondidatesInArray(toArrayWithCondidats(block))
    return checkSingleCondidate(reduceCondidatsInBlock(block, equals))
  })

  matrix =  resolveSingleSudoku(toSimpleMatrix(toMatrixFromBlocks(blocks)))
  let matrixWithCondidats = toMatrixWithCondidats(matrix).map(row=>reduceCondidatsInArray(row,equalCondidatesInArray(row) ))
  matrix = resolveSingleSudoku(toSimpleMatrix(matrixWithCondidats))
  matrixWithCondidats = toMatrixWithCondidats(transpose( matrix)).map(row=>reduceCondidatsInArray(row,equalCondidatesInArray(row) ))
  matrix = transpose(resolveSingleSudoku(toSimpleMatrix( matrixWithCondidats)))
  console.log(matrix)
  return  matrix
}

function checkSingleCondidate(blocks) {
  return blocks.map(block => block.map(value => (typeof value === 'object' && value.length === 1) ? value[0] : value))
}

function reduceCondidatsInBlock(block, array) {
  return block.map(condidate =>
    condidate.map(value => {
      if (typeof value === 'object')
        return deleteOneArrayFromAnother(array, value).length === 0 ? 0 : deleteOneArrayFromAnother(array, value)
      return value
    })
  )
}

function reduceCondidatsInArray(values,array){
  return values.map(value=>{
    if (typeof value === 'object'){
        return deleteOneArrayFromAnother(array, value).length === 0 ? 0 : deleteOneArrayFromAnother(array, value)
      }return value
  })
}
function equalCondidatesInArray(array) {
  return array
    .map(value => JSON.stringify(value))
    .filter((condidate, i, arr) =>  !!entriesInArray(arr,condidate,4) ||  !!entriesInArray(arr,condidate,3) || !!entriesInArray(arr,condidate,2))
    .map(value => JSON.parse(value))
    .reduce((acc, value) => typeof value === 'object' ? acc.concat(value) : acc, [])
}

function toArrayWithCondidats(blocks) {
  let j = 0
  let res = []
  blocks.map(block => {
    for (let i = 0; i < 3; i++) {
      if (typeof block[i] === 'object')
        res[j++] = block[i]
    }
  })
  return res
}

// console.log(entriesInArray([1,2,4,5,6,2,7,12,1],2))
// console.log(deleteOneArrayFromAnother([1,2],[1,2,3,4,5,6]))

// console.log(equalCondidatesInArray([[1,2,3],[0,0],[1,2],[1,2],[1,1,1,1],[1,1,1,1]]))