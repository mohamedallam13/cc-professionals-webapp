(function (root, factory) {
    root.LEGACY_HELPERS = factory();
})(this, function () {

    function mergeObjects(obj_1, obj_2) {
        var obj = {};
        var keys_1 = Object.keys(obj_1)
        var keys_2 = Object.keys(obj_2)
        keys_1.forEach(function (key) {
            obj[key] = obj_1[key];
        })
        keys_2.forEach(function (key) {
            obj[key] = obj_2[key];
        })
        return obj;
    }

    function objArrToArray(objArr, header, columnBool) {
        var keys = header ? header : Object.keys(objArr[0]);
        var array = objArr.map(function (row) {
            return keys.map(function (header) {
                if (columnBool) {
                    return [row[header]];
                }
                return row[header];
            })
        })
        return array;
    }
    return {
        objArrToArray,
        mergeObjects
    };
});
