
const POSSIBLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const SECTOR_SIZE = 3
// let cloneDeep = require('lodash').cloneDeep
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
module.exports = function solveSudoku(matrix) {
  return resolveTwo(matrix)
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
        if (value === 0) {
          let condidats = getCondidats(getCurrentColumn(x, matrix), getCurrentRow(y, matrix), getCurrentSector(x, y, matrix))
          if ((condidats.length === 1)) {
            return condidats[0]
          }
          return 0
        }
        return value
      })
    )
    matrix = tmp
  }
  return matrix
}

function getBlocksFromSimpleMatrix(matrix) {
  let res = []
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      res.push([[matrix[SECTOR_SIZE * y][SECTOR_SIZE * x], matrix[SECTOR_SIZE * y][SECTOR_SIZE * x + 1], matrix[SECTOR_SIZE * y][SECTOR_SIZE * x + 2]],
      [matrix[SECTOR_SIZE * y + 1][SECTOR_SIZE * x], matrix[SECTOR_SIZE * y + 1][SECTOR_SIZE * x + 1], matrix[SECTOR_SIZE * y + 1][SECTOR_SIZE * x + 2]],
      [matrix[SECTOR_SIZE * y + 2][SECTOR_SIZE * x], matrix[SECTOR_SIZE * y + 2][SECTOR_SIZE * x + 1], matrix[SECTOR_SIZE * y + 2][SECTOR_SIZE * x + 2]]])
    }
  }
  return res
}
function toMatrixFromBlocks(blocks) {
  let matrix = [[], [], [], [], [], [], [], [], []]
  blocks.map((block, i) => {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        matrix[y + Math.floor(i / 3) * 3][x + (i % 3) * 3] = block[y][x]
      }
    }
  })
  return matrix
}
function transpose(a) {

  // Calculate the width and height of the Array
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if (h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for (i = 0; i < h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for (j = 0; j < w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}
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
function getCurrentRow(y, matrix) {
  return matrix[y]
}

function getCurrentColumn(x, matrix) {
  return matrix.map(value => value[x])
}

function getCurrentSector(x, y, matrix) {
  let res = []
  let beginYindex = Math.floor(y / SECTOR_SIZE) * SECTOR_SIZE

  for (let i = beginYindex; i < (beginYindex + SECTOR_SIZE); i++) {
    let value = matrix[i]
    let beginingXIndex = Math.floor(x / SECTOR_SIZE) * SECTOR_SIZE
    res.push([value[beginingXIndex], value[beginingXIndex + 1], value[beginingXIndex + 2]])
  }

  return res.reduce((resArray, arr) => resArray = resArray.concat(arr), [])
}
function isCondidat(value) {
  return typeof value === 'object'
}

function deleteOneArrayFromAnother(arrayToDelete, matchArray) {
  return matchArray.filter(function (el) {
    return arrayToDelete.indexOf(el) < 0;
  });
}
function entriesInArray(array, val, res) {
  let count = 0
  for (i = 0; i < array.length; i++)
    if (array[i] == val)
      count++;
  return count == res;
}
function unique(arr) {
  var result = [];

  nextInput: for (var i = 0; i < arr.length; i++) {
    var str = arr[i]; // для каждого элемента
    for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
      if (result[j] == str) continue nextInput; // если да, то следующий
    }
    result.push(str);
  }

  return result;
}
function toSimpleArray(arrayWithCondidats) {
  return arrayWithCondidats.map(value => typeof value === 'object' ? 0 : value)
}
function toArrayWithCondidats(array, matrix, y) {
  return array.map((value, x) => {
    if (value === 0)
      return getCondidats(getCurrentColumn(x, matrix), getCurrentRow(y, matrix), getCurrentSector(x, y, matrix))
    return value
  })
}
function toArrayWithCondidatsFromBlock(blocks) {
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
function blocksToArray(blocks) {
  return blocks.map(block => {
    return block.reduce((res, val) => res.concat(val), [])
  })
}
function blockToArray(block) {
  return block.reduce((res, val) => res.concat(val), [])
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
    newMatrix = deleteFromColumn(value.x, value.value, newMatrix)
    newMatrix = deleteFromRow(value.y, value.value, newMatrix)
    // todo
    // newMatrix = deleteFromSector(value.x,value.y,value,newMatrix)
  })
  return newMatrix
}

// function deleteFromSector(x,y,value,matrix){
//   getBlocksFromSimpleMatrix(matrix)
// }
function deleteFromColumn(x, deleteValue, matrix) {
  return deleteFromRow(x, deleteValue, transpose(matrix))
}

function deleteFromRow(y, deleteValue, matrix) {
  matrix[y] = matrix[y].map(value => {
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
  let matrix = matrixWithCondidats
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
