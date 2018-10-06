let {
  deleteOneArrayFromAnother,
  entriesInArray,
  unique,
  toSimpleArray,
  toArrayWithCondidats,
  toArrayWithCondidatsFromBlock,
  blocksToArray,
  blockToArray
} = require('./array.helper')
let {
  getBlocksFromSimpleMatrix,
  toMatrixFromBlocks,
  transpose,
  toSimpleMatrix,
  toMatrixWithCondidats
} = require('./matrix.helper')
let {
  getCurrentRow,
  getCurrentColumn,
  getCurrentSector,
  getCondidats,
  isCondidat
} = require('./condidats.helper')
let { resolveSingleSudoku } = require("./singles");
let cloneDeep = require('lodash').cloneDeep
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
module.exports = function solveSudoku(matrix) {
  return resolveTwo(matrix)
}

function resolveTwo(matrix) {
  compose(
    console.log,
    updateCondidates,
    reduceSingleCondidats,
    resolveRows,
    resolveColumns,
    resolveBlocks,
    toMatrixWithCondidats
  )(matrix)
}

function reduceSingleCondidats(matrix) {
  return matrix.map((row,y) => row.map((value,x) =>{
    if(isCondidat(value) && value.length === 1){
      return value[0]
    }
    return value
    }))
}
function resolveColumns(matrixWithCondidats) {
  return compose(
    transpose,
    resolveRows,
    transpose
  )(matrixWithCondidats)
}

function resolveBlocks(matrixWithCondidats) {
  return compose(
    resolveRows,
    blocksToArray,
    getBlocksFromSimpleMatrix
  )(matrixWithCondidats)
}

function resolveRows(matrixWithCondidats) {
  return matrixWithCondidats.map(row => {
    return reduceDoubles(row, findDoublesInArray(row))
  })
}
function findDoublesInArray(array) {
  return unique(array
    .map(value => JSON.stringify(value))
    .filter((value, i, array) => JSON.parse(value).length === 2 && entriesInArray(array, value, 2)))
    .map(value => JSON.parse(value))
}

function reduceDoubles(array, doubles) {
  return array.map(value => {
    if (isCondidat(value)) {
      for (let i = 0; i < doubles.length; i++) {
        if (!equalToDouble(doubles[i], value)) {
          value = deleteOneArrayFromAnother(doubles[i], value)
        }
      }
    }
    return value
  })
}

function equalToDouble(double, value) {
  return value.length !== 1 && JSON.stringify(double) === JSON.stringify(value)
}

function updateCondidates(matrixWithCondidats) {
  let matrix =  cloneDeep(matrixWithCondidats)
  do {
    console.log('-------------')
    console.log(toSimpleMatrix(matrix))
    console.log(toMatrixWithCondidats(toSimpleMatrix(matrix)))
    matrix  = toMatrixWithCondidats(toSimpleMatrix(reduceSingleCondidats(matrix)))
  }while(isSingleCondidatInMatrix(matrix) || canReduceMatrix(matrix))
  return matrix
}

function isSingleCondidatInMatrix(matrix){
  return matrix.some(array=>array.some(value=> isCondidat(value) && value.length === 1))
}

function canReduceMatrix(matrix){
  return matrix.some((row,y)=>row.some((value,x)=> canReduceCondidate(value,y,x,matrix)))
}

function canReduceCondidate(condidate,y,x,matrix){
  if(isCondidat(condidate)){
    return condidate.some(value=>{
      return (getCurrentColumn(x,matrix).indexOf(value)!==-1 ||  getCurrentRow(y,matrix).indexOf(value)!==-1 || getCurrentSector(x,y,matrix).indexOf(value)!==-1)})}
  
  return false
}