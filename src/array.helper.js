module.exports = {
    deleteOneArrayFromAnother(arrayToDelete, matchArray) {
        return matchArray.filter(function (el) {
            return arrayToDelete.indexOf(el) < 0;
        });
    },
    entriesInArray(array,val,res) {
        let count = 0
        for (i = 0; i < array.length; i++)
            if (array[i] == val)
                count++;
        return count == res;
    }
}