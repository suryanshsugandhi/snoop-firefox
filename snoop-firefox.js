// env
const SnoopURL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/',
    SnoopKey = '?key=e58fc628-83c4-433c-a9fc-82b34cb12366';
// GET request URL + queryText + Key

console.log("Snoop is running on this page");

// initializing selector empty
if (!window.CurrentSelection) {
    CurrentSelection = {}
}
CurrentSelection.Selector = {}

// mouse up event listener
document.addEventListener("mouseup", function () {
    var selectedText = mouseUpSelected();
    if (selectedText){
        console.log("Selected Text: ",selectedText);
        loadDoc(selectedText);
    }
});

// function for mouse up event -
function mouseUpSelected() {
    var st = CurrentSelection.Selector.getSelected();
    var range = st.getRangeAt(0)

    if(newNode){
        newNode.remove();
    }
    // transferring range to a new node
    var newNode = document.createElement("span");
    range.surroundContents(newNode);

    // delete existing popDiv
    var residual = document.getElementById('popDiv');
    console.log("Deleting residual popDiv");
    if (residual){
        console.log("Existing popDiv: ", residual);
        residual.remove()
    }

    // creating popDiv
    var popDiv = document.createElement('span');
    popDiv.setAttribute('id', 'popDiv');
    if(newNode.innerHTML.length > 0) {
        console.log("Initializing popDiv");
        console.log("newNode: ", newNode);
        
        newNode.insertAdjacentElement("afterend",popDiv);
    }     

    //Remove Selection: To avoid extra text selection
    // if (window.getSelection) {
    //   window.getSelection().removeAllRanges();
    // }
    // else if (document.selection){ 
    //     document.selection.empty();
    // }

    var selectedText = range.toString();
    if (selectedText && selectedText != "") {
        return selectedText
    }
}

// get currently selected text
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


// GET request from dictionaryapi
function loadDoc(queryText) {    
    console.log("Requesting dictionary", queryText);
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        console.log("response status: ", xmlHttp.status);
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            loadHTTPResponse(xmlHttp.responseText, queryText);
    }
    xmlHttp.open("GET",
        SnoopURL + queryText + SnoopKey,
        true); // true for asynchronous 

    xmlHttp.send(null);
}


// API response processing 
function loadHTTPResponse(response, queryText) {
    console.log("Successfully loaded response", response);
    
    response = JSON.parse(response)

    if(response.length > 0){
        if (response[0].fl) {
            var pronounciation = response[0].hwi.prs[0].mw;
            var dict = [];
            response.forEach(function (r) {
                var type = r.fl, meaning = r.shortdef[0];
                dict.push([type, meaning])
            })
    
            createPopup(queryText, pronounciation, dict);
        }
    }
}

// popup creation
function createPopup(queryText, pronounciation, dict) {
    // Setting popDiv properties
    popDiv = document.getElementById('popDiv');
    if(popDiv){
        let title = document.createElement('span');
        title.innerHTML = "<strong>" + queryText + "</strong> "
        title.setAttribute('style',
            'font-size: 0.9rem; color: #444');

        let pr = document.createElement('span');
        pr.innerHTML = "<em>" + pronounciation + "</em>"
        pr.setAttribute('style',
            'font-size:0.8rem; color: #595959;');

        let meanings = document.createElement('span');
        meanings.innerHTML = "<br><em><strong>" + dict[0][0] + "</strong></em><br>" + dict[0][1] + "<br><em><strong>" + dict[1][0] + "</strong></em><br>" + dict[1][1];
        meanings.setAttribute('style',
            'font-size: 0.8rem; color: #595959;')

        popDiv.appendChild(title)
        popDiv.appendChild(pr)
        popDiv.appendChild(meanings)

        // let htmlText = "<strong>" + queryText + "</strong> " + pronounciation + "<br><br><em>" + dict[0][0] + "</em>: " + dict[0][1] + "<br><br><em>" + dict[1][0] + "</em>: " + dict[1][1];

        // popDiv.innerHTML = htmlText;
        popDiv.setAttribute('style',
             'min-height: 10vh; max-width: 20vw; position:absolute; background-color: #eeeeeeee; padding: 10px; box-shadow: 2px 3px 4px #444;');
        console.log(popDiv);
    }
}