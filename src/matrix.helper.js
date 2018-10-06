const SECTOR_SIZE = 3
module.exports = {
    getCurrentRow(y, matrix) {
        return matrix[y]
    },

    getCurrentColumn(x, matrix) {
        return matrix.map(value => value[x])
    },

    getCurrentSector(x, y, matrix) {
        let res = []
        let beginYindex = Math.floor(y / SECTOR_SIZE) * SECTOR_SIZE

        for (let i = beginYindex; i < (beginYindex + SECTOR_SIZE); i++) {
            let value = matrix[i]
            let beginingXIndex = Math.floor(x / SECTOR_SIZE) * SECTOR_SIZE
            res.push([value[beginingXIndex], value[beginingXIndex + 1], value[beginingXIndex + 2]])
        }

        return res.reduce((resArray, arr) => resArray = resArray.concat(arr), [])
    },
    getBlocksFromSimpleMatrix(matrix){
        let res= []
        for(let y=0;y<3;y++){
          for(let x=0;x<3;x++){
            res.push([[matrix[SECTOR_SIZE*y][SECTOR_SIZE*x],matrix[SECTOR_SIZE*y][SECTOR_SIZE*x+1], matrix[SECTOR_SIZE*y][SECTOR_SIZE*x+2]],
                      [matrix[SECTOR_SIZE*y+1][SECTOR_SIZE*x],matrix[SECTOR_SIZE*y+1][SECTOR_SIZE*x+1],matrix[SECTOR_SIZE*y+1][SECTOR_SIZE*x+2]],
                      [matrix[SECTOR_SIZE*y+2][SECTOR_SIZE*x],matrix[SECTOR_SIZE*y+2][SECTOR_SIZE*x+1],matrix[SECTOR_SIZE*y+2][SECTOR_SIZE*x+2]]])
            }
        }
        return res
    },
    toMatrixFromBlocks(blocks){
        let matrix = [[],[],[],[],[],[],[],[],[]]
        blocks.map((block,i)=>{
            for(let y=0;y<3;y++){
                for(let x=0;x<3;x++){
                    matrix[y+Math.floor(i/3)*3][x+(i%3)*3] = block[y][x]
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
        if(h === 0 || w === 0) { return []; }
      
        /**
         * @var {Number} i Counter
         * @var {Number} j Counter
         * @var {Array} t Transposed data is stored in this array.
         */
        var i, j, t = [];
      
        // Loop through every item in the outer array (height)
        for(i=0; i<h; i++) {
      
          // Insert a new row (array)
          t[i] = [];
      
          // Loop through every item per item in outer array (width)
          for(j=0; j<w; j++) {
      
            // Save transposed data.
            t[i][j] = a[j][i];
          }
        }
      
        return t;
      }
      
}