// API request
function loadHTTPResponse(responseText){
    responseText = JSON.parse(responseText)
    console.log(responseText)

    if(responseText['def'].length > 0){
        var def = responseText['def'][0]
        var word = def['text']
        var ts = def['ts']
        var pos = def['pos']
        var meanings = []
        def['tr'].forEach(function(m){
            meanings.push(m['text'])
        })
        
        console.log("word:", word);
        console.log("pronounciation:", ts);
        console.log("type:", pos);
        console.log("meaning:", meanings);
    }
}

function loadDoc(queryText) {
    queryText = queryText.trim();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            loadHTTPResponse(xmlHttp.responseText);
    }
    xmlHttp.open("GET", 
            'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20200506T094355Z.ccb2803e85479f25.ccc11cffc54d99e1d85717daa418d073c234c8d9&lang=en-en&text='+queryText,
            true); // true for asynchronous 

    xmlHttp.send(null);
}

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
    var newNode = document.createElement("span");
    // newNode.setAttribute("class", "selectedText");
    range.surroundContents(newNode);

    var selectedText = newNode.innerText
    if (selectedText && selectedText != " "){
        console.log(selectedText)
        return selectedText
    }
    else{
        return false;
    }
}

// event listener
document.addEventListener("mouseup", function(){
    let body = document.getElementsByTagName('body');
    console.log("Here");
    
    var selectedText = mouseUpSelected();
    if(selectedText)
        loadDoc(selectedText);
});