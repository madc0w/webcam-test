document.body.onload=()=>{const e=document.querySelector("video"),t=document.getElementById("start-button"),n=document.getElementById("capture-button");t.addEventListener("click",(()=>{navigator.mediaDevices.getUserMedia({video:!0}).then((t=>(e.srcObject=t,navigator.mediaDevices.enumerateDevices()))).then((e=>{})).catch((e=>{console.error("Error accessing media devices.",e)}))})),n.addEventListener("click",(()=>{const t=document.getElementById("canvas");t.getContext("2d").drawImage(e,0,0,t.width,t.height);const n=t.toDataURL("image/png");console.log(n)}))};