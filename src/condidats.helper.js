const POSSIBLE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const SECTOR_SIZE = 3

module.exports = {
    getCondidats(columnArray, rowArray, sectorArray) {
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
    },
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
    isCondidat(value) {
        return typeof value === 'object'
    }
}