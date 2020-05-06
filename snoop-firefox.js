console.log("Snoop is running on this page");

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

    // transferring range to a new node
    var newNode = document.createElement("span");
    newNode.setAttribute("class", "selectedText");
    range.surroundContents(newNode);

    var residual = document.getElementById('popDiv');
    if(residual)
        residual.remove()

    // initializing popup
    var popDiv = document.createElement('span');
    popDiv.setAttribute('id', 'popDiv')
    popDiv.setAttribute('class', 'popDiv');

    if (newNode.innerHTML.length > 0){
        newNode.appendChild(popDiv);
    }

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
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection){ 
        document.selection.empty();
    }

    console.log(queryText, dict);

    var popDiv = document.getElementById('popDiv');
    popDiv.style.visibility = "visible"
    popDiv.setAttribute('style', 
        'display: inline; min-height: 10vh; width: 20vw; position:absolute; background-color: #000; color: #fff')

    popDiv.innerHTML = queryText + dict[0] + dict[1];
}