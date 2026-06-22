let gpsActual = {};

const lat = document.getElementById("lat");
const lon = document.getElementById("lon");
const alt = document.getElementById("alt");

cargarGPS();

document
.getElementById("btnGps")
.addEventListener("click", cargarGPS);

document
.getElementById("btnAdd")
.addEventListener("click", guardarUbicacion);

document
.getElementById("btnEdit")
.addEventListener("click", mostrarListado);

document
.getElementById("btnCsv")
.addEventListener("click", exportarCSV);

document
.getElementById("btnUpdate")
.addEventListener("click", actualizarRegistro);

function cargarGPS(){

 navigator.geolocation.getCurrentPosition(
 async pos => {

    gpsActual.latitud =
        pos.coords.latitude;

    gpsActual.longitud =
        pos.coords.longitude;

    gpsActual.altitud =
        pos.coords.altitude || 0;

    lat.textContent =
        gpsActual.latitud;

    lon.textContent =
        gpsActual.longitud;

    alt.textContent =
        gpsActual.altitud;

 },
 err => alert(err.message),
 {
    enableHighAccuracy:true
 });

}

async function obtenerDireccion(lat,lon){

 try{

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );

    const data = await res.json();

    return {
       provincia:
       data.address.state || "",

       lugar:
       data.display_name || ""
    };

 }
 catch{

    return {
      provincia:"",
      lugar:""
    };
 }

}

function obtenerDatos(){

 return JSON.parse(
   localStorage.getItem("gps")
   || "[]"
 );

}

function guardarDatos(datos){

 localStorage.setItem(
   "gps",
   JSON.stringify(datos)
 );

}

async function guardarUbicacion(){

 const ahora = new Date();

 const dir =
 await obtenerDireccion(
    gpsActual.latitud,
    gpsActual.longitud
 );

 const registro = {

    longitud:
      gpsActual.longitud,

    latitud:
      gpsActual.latitud,

    altitud:
      gpsActual.altitud,

    fecha:
      ahora.toLocaleDateString(),

    hora:
      ahora.toLocaleTimeString(),

    provincia:
      dir.provincia,

    lugar:
      dir.lugar,

    notas:""

 };

 const datos = obtenerDatos();

 datos.push(registro);

 guardarDatos(datos);

 alert("Ubicación guardada");

}

function mostrarListado(){

 document
 .getElementById("panelListado")
 .classList.remove("hidden");

 const tbody =
 document.querySelector("#tabla tbody");

 tbody.innerHTML="";

 const datos =
 obtenerDatos();

 datos.forEach((d,i)=>{

    const tr =
    document.createElement("tr");

    tr.innerHTML=`
      <td>${d.fecha}</td>
      <td>${d.lugar}</td>
      <td>
        <button onclick="editar(${i})">
          Editar
        </button>
      </td>
    `;

    tbody.appendChild(tr);

 });

}

function editar(i){

 const datos =
 obtenerDatos();

 const d = datos[i];

 document
 .getElementById("panelEdicion")
 .classList.remove("hidden");

 idx.value=i;

 eLon.value=d.longitud;
 eLat.value=d.latitud;
 eAlt.value=d.altitud;
 eFecha.value=d.fecha;
 eHora.value=d.hora;
 eProvincia.value=d.provincia;
 eLugar.value=d.lugar;
 eNotas.value=d.notas;

}

function actualizarRegistro(){

 const datos =
 obtenerDatos();

 const i =
 document.getElementById("idx").value;

 datos[i]={

   longitud:eLon.value,
   latitud:eLat.value,
   altitud:eAlt.value,
   fecha:eFecha.value,
   hora:eHora.value,
   provincia:eProvincia.value,
   lugar:eLugar.value,
   notas:eNotas.value

 };

 guardarDatos(datos);

 alert("Actualizado");

 mostrarListado();

}

function exportarCSV(){

 const datos =
 obtenerDatos();

 let csv =
 "longitud;latitud;altitud;fecha;hora;provincia;lugar;notas\n";

 datos.forEach(d=>{

    csv +=
    `${d.longitud};${d.latitud};${d.altitud};${d.fecha};${d.hora};${d.provincia};${d.lugar};${d.notas}\n`;

 });

 const blob =
 new Blob([csv],
 {type:"text/csv;charset=utf-8;"});

 const a =
 document.createElement("a");

 a.href =
 URL.createObjectURL(blob);

 a.download =
 "ubicaciones.csv";

 a.click();

}
