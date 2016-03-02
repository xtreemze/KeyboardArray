abc = "abcdefghijklmnopqrstuvwxyz".toUpperCase();

construct = {name: 'abc', class: ''};
letters =  [];

for (i = 0; i < abc.length; i++){
    //console.log(i);
    //console.log(abc[i]);
    letters[i] = Object.create(construct);
    letters[i].name = abc[i];
    //console.log(letters[i]);
};

pick = function(id){
    letters[id].class = "picked";
    //console.log(id);
    el = document.getElementById(id);
    //console.log(el);
    el.classList.add("picked");
    el.disabled = true;
    return id;
};

listAvailable = function(){
    for (i = 0; i < abc.length; i++){
    if (letters[i].class == 'unpicked'){
        console.log(letters[i].name + ' ' + letters[i].class);
    } else {
        console.log(letters[i].name + ' ' + letters[i].class);
    }
}
};

populate = function(reset){
    var data = "";
    for (i = 0; i < abc.length; i++){
        if (reset) {letters[i].class = "";}
        name = letters[i].name;
        classes = letters[i].class;
        clickEvent = "pick('button#"+i +", '"+i+"'');";
    data = data + "<button id='"+i+"' class='frame "+classes+"' onclick="+'pick('+i+');'+">"+name+"</button>";
    }

    document.getElementById('abcs').innerHTML = data;
};

populate();
reset = true;
