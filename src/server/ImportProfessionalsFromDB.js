(function (root, factory) {
    root.HANDLE_PROFESSIONALS_DB = factory();
})(this, function () {

    const { Toolkit } = CCLIBRARIES
    const { readFromJSON } = Toolkit

    const PROFESSIONALS_DB_FILE_ID = "11Wo48BOFbKQ3j8Ewmss0IEK6k2ktuON4"

    function getProfessionalsData() {
        const data = getData()
        const pagePath = "client/components/Cards/Cards"
        const HTMLContent = MW.include(pagePath, { data });
        return HTMLContent
    }

    function getData() {
        const dbData = readFromJSON(PROFESSIONALS_DB_FILE_ID)
        const {profInfoObj} = dbData;
        const arrayOfData = Object.entries(profInfoObj).map(([,professionalObj])=> professionalObj)
        return arrayOfData
    }

    return {
        getProfessionalsData
    };
});

function getProfessionalsData() {
    return HANDLE_PROFESSIONALS_DB.getProfessionalsData()
}