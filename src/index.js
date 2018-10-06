let {
  deleteOneArrayFromAnother,
  entriesInArray,
  unique,
  blocksToArray,
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
  isCondidat
} = require('./condidats.helper')
let { resolveSingleSudoku } = require("./singles");
let cloneDeep = require('lodash').cloneDeep
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
module.exports = function solveSudoku(matrix) {
  return resolveTwo(matrix)
}

function resolveTwo(matrix) {
  return compose(
    resolveSingleSudoku,
    // toSimpleMatrix,
    // toSimpleMatrix,
    // reduceSingleCondidats,
    updateCondidates,
    resolveRows,
    resolveColumns,
    resolveBlocks,
    toMatrixWithCondidats
  )(matrix)
}


function reduceSingleCondidats(matrix) {
  let toDelete = []
  let newMatrix = matrix.map((row, y) => row.map((value, x) => {
    if (isCondidat(value) && value.length === 1) {
      toDelete.push({ y, x, value })
      return value[0]
    }
    return value
  }))
  toDelete.forEach(value => {
    newMatrix = deleteFromColumn(value.x,value.value,newMatrix)
    newMatrix = deleteFromRow(value.y,value.value,newMatrix)
    // todo
    // newMatrix = deleteFromSector(value.x,value.y,value,newMatrix)
  })
  return newMatrix
}

// function deleteFromSector(x,y,value,matrix){
//   getBlocksFromSimpleMatrix(matrix)
// }
function deleteFromColumn(x, deleteValue, matrix) {
  return deleteFromRow(x,deleteValue,transpose(matrix))
}

function deleteFromRow(y, deleteValue, matrix) {
  matrix[y] =  matrix[y].map(value => {
    if (isCondidat(value))
      return deleteOneArrayFromAnother(deleteValue, value)
    return value
  })
  return matrix
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
    toMatrixFromBlocks,
    arrayToBlocks,
    resolveRows,
    blocksToArray,
    getBlocksFromSimpleMatrix
  )(matrixWithCondidats)
}

function arrayToBlocks(matrix) {
  return matrix.map(row => {
    return [[row[0], row[1], row[2]], [row[3], row[4], row[5]], [row[6], row[7], row[8]]]
  })
}
function resolveRows(matrixWithCondidats) {
  return matrixWithCondidats.map(row => {
    let withoutDoubles = reduceDoubles(row, findDoublesInArray(row, 2))
    let withoutTriples = reduceDoubles(withoutDoubles, findDoublesInArray(row, 3))
    return reduceDoubles(withoutTriples, findDoublesInArray(row, 3))
    // todo hidden doubles
  })
}
function findDoublesInArray(array, dob) {
  return unique(array
    .map(value => JSON.stringify(value))
    .filter((value, i, array) => JSON.parse(value).length === dob && entriesInArray(array, value, dob)))
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
  let matrix = cloneDeep(matrixWithCondidats)
  do {
    matrix = reduceSingleCondidats(toMatrixWithCondidats(toSimpleMatrix(matrix)))
  } while (isSingleCondidatInMatrix(matrix) || canReduceMatrix(matrix))
  return matrix
}

function isSingleCondidatInMatrix(matrix) {
  return matrix.some(array => array.some(value => isCondidat(value) && value.length === 1))
}

function canReduceMatrix(matrix) {
  return matrix.some((row, y) => row.some((value, x) => canReduceCondidate(value, y, x, matrix)))
}

function canReduceCondidate(condidate, y, x, matrix) {
  if (isCondidat(condidate)) {
    return condidate.some(value => {
      return (getCurrentColumn(x, matrix).indexOf(value) !== -1 || getCurrentRow(y, matrix).indexOf(value) !== -1 || getCurrentSector(x, y, matrix).indexOf(value) !== -1)
    })
  }

  return false
}
