; (function (root, factory) {
    root.ENV = factory()
})(this, function () {

    const MASTER_INDEX_FILE_ID = '1iOfa8u5DF74ovrD4bpG5FgUSEhJV_tW1';
    const FORM_ID = "1AneTtseRx2_dSjnBGHKNRVvwRhlGmRSymzdHqFdlhTs"

    const requestsSheetOptions = {
        ssid: '1HC7QfcjqUbTYL7IKvHqUCtsR47IigcWhLJcpcVr3NCI',
        sheetName: 'Requests',
        headerRow: 1,
        startCol: 1
    }



    return {
        MASTER_INDEX_FILE_ID,
        FORM_ID,
        requestsSheetOptions
    }
})