let { getCurrentSector, getCurrentColumn, getCurrentRow, getCondidats } = require('./condidats.helper')

function checkNull(matrix) {
    return matrix.some(array => array.indexOf(0) !== -1)
  }
  
  
module.exports = {
    resolveSingleSudoku(matrix) {
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
}