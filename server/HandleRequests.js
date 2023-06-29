; (function (root, factory) {
    root.HANDLE_REQUESTS = factory()
})(this, function () {

    const { Toolkit, imp, FORMULATOR, SHEETS } = CCLIBRARIES
    const { createFormsInstance } = FORMULATOR
    const { readFromJSON, timestampCreate } = Toolkit
    const { createWriteArr, writeToSheet } = SHEETS
    const { requestsSheetOptions, FORM_ID, MASTER_INDEX_FILE_ID } = ENV

    let allFileIds
    let profDBObj
    let requestsDBObj
    let avaiableCodesArray

    let sheetObj
    let profObj


    function handleRequest(request) {
        getReferences()
        inititateRequestsDB();
        getprofObj(request);
        getSheetObj(requestsSheetOptions)
        const standardRequest = new StandardRequestObj(request)
        addToSheet(standardRequest);
        addToRequestsDB(standardRequest);

        doubleEmailer.init(request);
        saveAndCloseFiles()
        return true
    }

    function getReferences() {
        allFileIds = readFromJSON(MASTER_INDEX_FILE_ID);
        profDBObj = readFromJSON(allFileIds.profDB);
        requestsDBObj = readFromJSON(allFileIds.requestsDB);
        avaiableCodesArray = readFromJSON(allFileIds.availableRatingCodes);
    }

    function inititateRequestsDB() {
        if (!requestsDBObj.allRequestsArr) {
            requestsDBObj.allRequestsArr = [];
        }
        allRequestsArr = requestsDBObj.allRequestsArr;
    }

    function getprofObj(request) {
        namesIndex = profDBObj.namesIndex;
        profInfoObj = profDBObj.profInfoObj;
        var id = namesIndex[request.selectedProfessional];
        profObj = profInfoObj[id];
    }

    function StandardRequestObj(request) {
        const self = this;
        Object.assign(this, request)
        this.timestamp = timestampCreate(undefined, 'MM/dd/YYYY HH:mm:ss');
        this.ratingCode = generateCode()
        this.prefilledLink = getPrefilledLink(self)
    }

    function getSheetObj(dbParams) {
        const { ssid, sheetName, parseObj } = dbParams
        const ssMan = imp.createSpreadsheetManager(ssid).addSheets(sheetName)
        sheetObj = ssMan.sheets[sheetName].parseSheet(parseObj).objectifyValues()
        sheetObj.sheetName = sheetName;
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

    function getPrefilledLink(standardRequest) {
        const form = createFormsInstance(FORM_ID);
        const { ratingCode, selectedProfessional } = standardRequest
        const fillingObj = {
            "Rating Code": {
                value: ratingCode,
                questionType: "asTextItem"
            },
            "Professional": {
                value: selectedProfessional,
                questionType: "asListItem"
            }
        }
        const prefilledLink = form.createPreFilledLink(fillingObj)
        return prefilledLink
    }

    function addToSheet(standardRequest) {
        const writeArr = createWriteArr(standardRequest)
        writeToSheet(writeArr, sheetObj)
    }

    function addToRequestsDB(standardRequest) {
        allRequestsArr.push(standardRequest);
        profObj.requests.push(standardRequest);
    }

    function saveAndCloseFiles() {
        Toolkit.writeToJSON(allFileIds.availableRatingCodes, avaiableCodesArray);
        Toolkit.writeToJSON(allFileIds.requestsDB, requestsDBObj);
        Toolkit.writeToJSON(allFileIds.profDB, profDBObj);
    }

    return {
        handleRequest
    }

})
