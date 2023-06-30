; (function (root, factory) {
    root.HANDLE_REQUESTS = factory()
})(this, function () {

    const { Toolkit, imp, FORMULATOR, SHEETS, SENDEMAILV2 } = CCLIBRARIES
    const { createFormsInstance } = FORMULATOR //Manage forms
    const { readFromJSON, timestampCreate, htmlToPlainText } = Toolkit //Helpers to read and write to JSONs, convert HTML to text for email plain body andcreate timestamps
    const { createWriteArr, writeToSheet } = SHEETS //To write to sheets
    const { sendTemplateEmail } = SENDEMAILV2; //sending of emails

    const { requestsSheetOptions, FORM_ID, MASTER_INDEX_FILE_ID } = ENV //Environment parameters

    const TEST = true
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
        this.topics = request.topics.join(", ")
        this.timestamp = timestampCreate(undefined, 'MM/dd/YYYY HH:mm:ss');
        this.ratingCode = generateCode()
        this.ratingLink = getPrefilledLink(self)
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
        const writeArr = createWriteArr([standardRequest],sheetObj.header)
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
        const htmlTemplateFile = "server/htmlEmails/CCPNEmailToProfessionals"
        this.testMode = TEST;
        this.testEmail = testEmail
        this.name = "Cairo Confessions Professionals Network";
        this.htmlBody = _I(htmlTemplateFile, { profObjData: profObj.userData, standardRequest });
        this.body = htmlToPlainText(this.htmlBody)
        this.to = profObj.userData["Contact Email"]
        this.replyTo = standardRequest.requesterEmail
        this.subject = "Dr. " + profObj.userData["First Name"] + ", You have a request!"
    }

    function RequesterEmailObj(standardRequest) {
        const htmlTemplateFile = "server/htmlEmails/CCPNEmailToRequester"
        this.testMode = TEST;
        this.testEmail = testEmail
        this.name = "Cairo Confessions Professionals Network";
        this.htmlBody = _I(htmlTemplateFile, { profObjData: profObj.userData, standardRequest });
        this.body = htmlToPlainText(this.htmlBody)
        this.to = standardRequest.requesterEmail
        this.replyTo = profObj.userData["Contact Email"]
        this.subject = "Hello, you have made a request to be connected to a professional"
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
    // request = {
    //     selectedProfessional: "David George",
    //     requesterName: "Mohamed Allam",
    //     requesterEmail: "mh.allam@yahoo.com",
    //     age: "34",
    //     genderchoice: "Male",
    //     category: "Relationship issue",
    //     problemExplained: "I am tired of having toxic relationships, I do not want to do this anymore, please make this stop",
    //     topics: ["Issue 1, Issue 2, Issue 3"]
    // }
    return HANDLE_REQUESTS.handleRequest(request)
}
