const divCreator = function(){
    const containerNode = document.getElementById("numberContainer")
    

    for(let bingoNumber=1;bingoNumber<=76;bingoNumber++){
        let newNumberNode = document.createElement("div")
        newNumberNode.innerText = bingoNumber
        newNumberNode.classList.add("number")
        containerNode.appendChild(newNumberNode)
        
    }
}

const randomGenerator = function(){

    return Math.floor(Math.random()*76 - 1)

}








window.onload = function() {
    
    divCreator()
}