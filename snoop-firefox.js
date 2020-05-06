// initializing selector as empty
if (!window.CurrentSelection) {
    CurrentSelection = {}
}
CurrentSelection.Selector = {}

//get the current selection
CurrentSelection.Selector.getSelected = function () {
    var sel = '';
    if (window.getSelection) {
        sel = window.getSelection()
    }
    else if (document.getSelection) {
        sel = document.getSelection()
    }
    return sel
}

// function activated on mouse button up
function mouseUpSelected(){
    var st = CurrentSelection.Selector.getSelected();
    var range = st.getRangeAt(0)

    var selectedText = range.toString();
    if (selectedText && selectedText != " "){
        return selectedText
    }
    else{
        return false;
    }
}

// event listener
document.addEventListener("mouseup", function(){
    var selectedText = mouseUpSelected();
    if(selectedText)
        loadDoc(selectedText);
});

function loadDoc(queryText) {
    queryText = queryText.trim();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            loadHTTPResponse(xmlHttp.responseText, queryText);
    }
    xmlHttp.open("GET", 
            'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +  queryText +'?key=e58fc628-83c4-433c-a9fc-82b34cb12366',
            true); // true for asynchronous 

    xmlHttp.send(null);
}

// API response processing and popup creation
function loadHTTPResponse(response, queryText){
    response = JSON.parse(response)
    
    if(response[0].fl){
        var pronounciation = response[0].hwi.prs[0].mw;
        var dict = [];
        response.forEach(function(r){
            var type = r.fl, meaning = r.shortdef[0];
            dict.push([type, meaning])
        })

        createPopup(queryText, pronounciation, dict);
    }
}

function createPopup(queryText, pronounciation, dict){
    return
}