; (function (root, factory) {
    root.requestHandler = factory()
})(this, function () {

    var requestHandler = {};

    const { Toolkit, FORMULATOR } = CCLIBRARIES

    const MASTER_INDEX_FILE_ID = '1iOfa8u5DF74ovrD4bpG5FgUSEhJV_tW1';
    var allFileIds

    var sheetOptions = {
        ssid: '1HC7QfcjqUbTYL7IKvHqUCtsR47IigcWhLJcpcVr3NCI',
        sheetName: 'Requests',
        headerRow: 1,
        startCol: 1
    }

    var sheet

    var profDBObj
    var avaiableCodesArray
    var requestsDBObj;
    var allRequestsArr;

    var namesIndex
    var profInfoObj

    var profObj

    function inititateRequestsDB() {
        requestsDBObj = Toolkit.readFromJSON(allFileIds.requestsDB);
        if (!requestsDBObj.allRequestsArr) {
            requestsDBObj.allRequestsArr = [];
        }
        allRequestsArr = requestsDBObj.allRequestsArr;
    }

    function init(request) {
        getReferences()
        inititateRequestsDB();
        getprofObj(request);
        request.timestamp = Toolkit.timestampCreate(undefined, 'MM/dd/YYYY HH:mm:ss');
        var header = getHeader();
        var code = generateCode();
        request.ratingCode = code;
        addToSheet(request, header);
        addToRequestsDB(request);
        doubleEmailer.init(request);
        saveAndCloseFiles()
        return true
    }

    function getReferences() {
        allFileIds = Toolkit.readFromJSON(MASTER_INDEX_FILE_ID);
        profDBObj = Toolkit.readFromJSON(allFileIds.profDB);
        avaiableCodesArray = Toolkit.readFromJSON(allFileIds.availableRatingCodes);
        namesIndex = profDBObj.namesIndex;
        profInfoObj = profDBObj.profInfoObj;
    }

    function getHeader() {
        sheet = SpreadsheetApp.openById(sheetOptions.ssid).getSheetByName(sheetOptions.sheetName);
        var header = sheet.getRange(sheetOptions.headerRow, sheetOptions.startCol, sheet.getLastRow(), sheet.getLastColumn()).getValues()[0];
        return header;
    }

    function getprofObj(request) {
        var id = namesIndex[request.selectedProfessional];
        profObj = profInfoObj[id];
    }

    function generateCode() {
        var result = '';
        var length = 7
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result = result.toUpperCase();
        avaiableCodesArray.push(result)
        return result;
    }

    function addToSheet(request, header) {
        var requestArr = [request];
        var writeArr = LEGACY_HELPERS.objArrToArray(requestArr, header);
        var lastRow = sheet.getLastRow();
        var writeRange = sheetOptions.sheetName + '!' + Toolkit.colNumToA1(sheetOptions.startCol) + (lastRow + 1);
        Toolkit.writeDataAdv(writeArr, writeRange, sheetOptions.ssid);
    }

    

    function addToRequestsDB(request) {
        allRequestsArr.push(request);
        profObj.requests.push(request);
    }

    function saveAndCloseFiles() {
        Toolkit.writeToJSON(allFileIds.availableRatingCodes, avaiableCodesArray);
        Toolkit.writeToJSON(allFileIds.requestsDB, requestsDBObj);
        Toolkit.writeToJSON(allFileIds.profDB, profDBObj);
    }

    requestHandler.init = init;

    return requestHandler

})

function receiveRequest(request) {
    //  var request = {selectedProfessional: "David George", requesterEmail: "mh.allam@yahoo.com", age: "22", genderchoice: "Male", problemExplained: "asd"}

    return requestHandler.init(request);
}