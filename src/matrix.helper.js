const SECTOR_SIZE = 3
let {getCurrentColumn, getCurrentSector, getCurrentRow,getCondidats} =  require( './condidats.helper')
module.exports = {
    getBlocksFromSimpleMatrix(matrix) {
        let res = []
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                res.push([[matrix[SECTOR_SIZE * y][SECTOR_SIZE * x], matrix[SECTOR_SIZE * y][SECTOR_SIZE * x + 1], matrix[SECTOR_SIZE * y][SECTOR_SIZE * x + 2]],
                [matrix[SECTOR_SIZE * y + 1][SECTOR_SIZE * x], matrix[SECTOR_SIZE * y + 1][SECTOR_SIZE * x + 1], matrix[SECTOR_SIZE * y + 1][SECTOR_SIZE * x + 2]],
                [matrix[SECTOR_SIZE * y + 2][SECTOR_SIZE * x], matrix[SECTOR_SIZE * y + 2][SECTOR_SIZE * x + 1], matrix[SECTOR_SIZE * y + 2][SECTOR_SIZE * x + 2]]])
            }
        }
        return res
    },
    toMatrixFromBlocks(blocks) {
        let matrix = [[], [], [], [], [], [], [], [], []]
        blocks.map((block, i) => {
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    matrix[y + Math.floor(i / 3) * 3][x + (i % 3) * 3] = block[y][x]
                }
            }
        })
        return matrix
    },
    transpose(a) {

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
    },
    toSimpleMatrix(matrixWithCondidats) {
        return matrixWithCondidats.map(row => row.map(value => typeof value === 'object' ? 0 : value))
    },
    toMatrixWithCondidats(matrix) {
        return matrix.map((array, y) =>
            array.map((value, x) => {
                if (value === 0)
                    return getCondidats(getCurrentColumn(x, matrix), getCurrentRow(y, matrix), getCurrentSector(x, y, matrix))
                return value
            })
        )
    },
}