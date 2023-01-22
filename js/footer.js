let spanElement = document.querySelector("footer span");
let footerElement = document.querySelector("footer");

let content = spanElement.innerText;
footerElement.removeChild(spanElement);

//alert(newElement);
for (let i = 0; i < content.length; i++) {
    let newElement = document.createElement("span");
    footerElement.appendChild(newElement);
    newElement.append(content[i]);
}
footerElement = document.querySelectorAll("footer span");
for (i = 0; i < footerElement.length; i++) {
    footerElement[i].style.color = getRGBString();
}


function getRGBString() {
    let colorr = Math.trunc(Math.random() * 222);
    let colorg = Math.trunc(Math.random() * 222);
    let colorb = Math.trunc(Math.random() * 222);

    return `rgb(${colorr},${colorg},${colorb})`;
}
