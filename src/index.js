export { default as NodeView } from "./view"
export { default as NodeModel } from "./model"



window.addEventListener("load", () => {

    const style = document.createElement("style");
    style.innerHTML = "text { font-size: 25px; font-family: Consolas }";
    document.head.append( style );

});