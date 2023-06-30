; (function (root, factory) {
    root.HANDLE_REQUESTS = factory()
})(this, function () {

    const { Toolkit, imp, FORMULATOR, SHEETS, SENDEMAILV2 } = CCLIBRARIES
    const { createFormsInstance } = FORMULATOR
    const { readFromJSON, timestampCreate, htmlToPlainText } = Toolkit
    const { createWriteArr, writeToSheet } = SHEETS
    const { sendTemplateEmail } = SENDEMAILV2;

    const { requestsSheetOptions, FORM_ID, MASTER_INDEX_FILE_ID } = ENV

    const TEST = false
    const testEmail = "mh.allam@yahoo.com"

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
        const emailSuccessBool = sendEmails(standardRequest)
        saveAndCloseFiles()
        if (!emailSuccessBool) return
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

    function sendEmails(standardRequest) {
        const professionalEmailObj = new ProfessionalEmail(standardRequest);
        const requesterEmailObj = new RequesterEmailObj(standardRequest)
        const professionalEmailResponse = sendTemplateEmail(professionalEmailObj);
        const requesterEmailResponse = sendTemplateEmail(requesterEmailObj);
        if (!professionalEmailResponse && !requesterEmailResponse) return true
        if (professionalEmailResponse) console.log("Professional Email failed with error: " + professionalEmailResponse)
        if (requesterEmailResponse) console.log("Requester Email failed with error: " + requesterEmailResponse)
        return
    }

    function ProfessionalEmail(standardRequest) {
        const htmlTemplateFile = "htmlEmails/CCPNEmailToProfessionals"
        this.htmlBody = _I(htmlTemplateFile, { profObj, standardRequest });
        this.body = htmlToPlainText(this.htmlBody)

    }

    function RequesterEmailObj(standardRequest) {
        const htmlTemplateFile = "htmlEmails/CCPNEmailToRequester"
        this.htmlBody = _I(htmlTemplateFile, { profObj, standardRequest });
        this.body = htmlToPlainText(this.htmlBody)

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

function handleRequest(request) {
    const request = {

    }
    return HANDLE_REQUESTS.handleRequest(request)
}
