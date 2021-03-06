const formTitle = document.getElementById('tituloCaluladora');
formTitle.innerHTML = 'SIMULA TU PRESTAMO';

document.body.onload = addElement;

function addElement() {

    let h1 = document.createElement("h1");
    let newH1 = document.createTextNode("FINANCIALO");
    h1.appendChild(newH1);

    let form = document.getElementById("simulador");
    document.body.insertBefore(h1, form);
}

const boton = $('#boton');
const tarjeta = $('#tarjeta').val();
const tabla = document.querySelector('#list-table tbody');
const tarjeta2 = document.querySelector('#tarjeta');
const tablaDolar = document.querySelector('#apiList');
const notice = document.querySelector('#nota');
const cardDolar = document.querySelector('#cardDolar');
const form = $('#formulario');

boton.click(click);


function click(e) {
    e.preventDefault()
    const nombre = $('#nombre').val();
    const age = $('#age').val();
    const email = $('#email').val();
    const phone = $('#phone').val();
    const monto = $('#monto').val();
    const cuotas = $('#cuotas').val();
    const interes = calculoInteres(cuotas);
    if (validarForm()) {
        calcularCuota(monto, cuotas, interes);
        mostrarCard(nombre, age, email, phone);
        animar();
        notaFin();
        $("#formulario").trigger("reset");
        const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
        const user = {
            email: email,
            id: 1,
            phone: phone,
            name: nombre,
            age: age,
            monto: monto,
            cuotas: cuotas
        };
        $.post(URLPOST, user, (response, status) => {
            if (status === 'success') {
                Swal.fire(
                    'Buen trabajo',
                    'Sus datos fueron guardados con exito!',
                )
            }
        });
    }
}

function validarForm() {

    if ($("#nombre").val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El campo nombre no puede estar vacío!',
        });
        $("#nombre").focus();
        return false;
    }
    if ($("#age").val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El campo edad no puede estar vacío!',
        });
        $("#age").focus();
        return false;
    }
    if ($("#email").val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El campo email no puede estar vacío!',
        });
        $("#email").focus();
        return false;
    }
    if ($("#phone").val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El campo teléfono no puede estar vacío!',
        });
        $("#phone").focus();
        return false;
    }
    if ($("#monto").val() == "0") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe elegir un monto!',
        });
        $("#monto").focus();
        return false;
    }
    if ($("#cuotas").val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe elegir cantidad de cuotas',
        });
        $("#cuotas").focus();
        return false;
    }
    return true;
}

function calculoInteres(cuotas) {

    let interesAnual = 45;
    let meses = 12;
    let variacionInteres = [0, 2, 4, 6, 8, 10, 12, 14];

    switch (parseInt(cuotas)) {
        case 12:
            return parseFloat((interesAnual + variacionInteres[0]) / meses).toFixed(2)
        case 18:
            return parseFloat((interesAnual + variacionInteres[1]) / meses).toFixed(2)
        case 24:
            return parseFloat((interesAnual + variacionInteres[2]) / meses).toFixed(2)
        case 36:
            return parseFloat((interesAnual + variacionInteres[3]) / meses).toFixed(2)
        case 48:
            return parseFloat((interesAnual + variacionInteres[4]) / meses).toFixed(2)
        case 60:
            return parseFloat((interesAnual + variacionInteres[5]) / meses).toFixed(2)
        case 72:
            return parseFloat((interesAnual + variacionInteres[6]) / meses).toFixed(2)
        case 84:
            return parseFloat((interesAnual + variacionInteres[7]) / meses).toFixed(2)
    }
}


function mostrarCard(nombre, age, email, phone) {

    while (tarjeta2.firstChild) {
        tarjeta2.removeChild(tarjeta2.firstChild);
    }

    const enJson = JSON.stringify(nombre);
    localStorage.setItem('Nombre', enJson);
    const enJson1 = JSON.stringify(age);
    localStorage.setItem('Edad', enJson1);
    const enJson2 = JSON.stringify(email);
    localStorage.setItem('Correo', enJson2);
    const enJson3 = JSON.stringify(phone);
    localStorage.setItem('Teléfono', enJson3);

    let datos = `<ul class="list-group list-group-flush">
                    <li class="list-group-item">Nombre: ${nombre}</li>
                    <li class="list-group-item">Edad: ${age}</li>
                    <li class="list-group-item">Correo: ${email}</li>
                    <li class="list-group-item">Teléfono: ${phone}</li>
                </ul>`;
    $('#tarjeta').append(datos)
}

function calcularCuota(monto, cuotas, interes) {

    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
    let fechas = [];
    let fechaActual = Date.now();
    let mes_actual = moment(fechaActual);
    mes_actual.add(1, 'month');

    let pagoInteres = 0,
        pagoCapital = 0,
        cuota = 0;
    cuota = monto * (Math.pow(1 + interes / 100, cuotas) * interes / 100) / (Math.pow(1 + interes / 100, cuotas) - 1);
    const enJason4 = JSON.stringify(cuota);
    localStorage.setItem('cuota', enJason4);

    for (let i = 1; i <= cuotas; i++) {
        pagoInteres = parseFloat(monto * (interes / 100));
        pagoCapital = cuota - pagoInteres;
        monto = parseFloat(monto - pagoCapital);

        fechas[i] = mes_actual.format('DD-MM-YYYY');
        mes_actual.add(1, 'month');

        const row = `<tr id="fila">
                        <td>${fechas[i]}</td>
                        <td>${cuota.toFixed(2)}</td>
                        <td>${pagoCapital.toFixed(2)}</td>
                        <td>${pagoInteres.toFixed(2)}</td>
                        <td>${monto.toFixed(2)}</td>
                    </tr>`;
        $('#resumenCuotas').append(row);
    }
}

boton.click(animar2);

function animar() {
    $('h1').animate({
        marginLeft: '1250px',
        margingRight: '50px',
    }, 1500, function () {
        $()
        $('h1').css("backgroundColor", "lightBlue");
        $('#fila:nth-child(odd)').css("backgroundColor", "#B5B2B2")
    })
}

function animar2() {
    $('h1').animate({
        marginLeft: '50px',
    }, 1500)
}

function notaFin() {
    while (notice.firstChild) {
        notice.removeChild(notice.firstChild);
    }

    $("#nota").append(`<h2 id="notice">Calculo Plan de Pago Mensual Finalizado</h2>`);
    $("#notice").slideUp(3000);
}

$("#botonDolar").click((e) => {
    e.preventDefault()
    cotizar();
    cuotaDolar();
});

function cotizar() {

    while (tablaDolar.firstChild) {
        tablaDolar.removeChild(tablaDolar.firstChild);
    }

    let url = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';

    $.get(url, function (response, status) {
        const apiArray = response[0];
        const datos = Object.values(apiArray)
        if (status === "success") {
            for (const dato of datos) {
                $('#apiList').append(`<table id= tablaDolar class=table>
                                        <thead>
                                            <tr>
                                                <th>Compra</th>
                                                <th>Venta</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>${dato.compra}</th>
                                                <th>${dato.venta}</th>
                                            </tr>
                                        </tbody>
                                    </table>`)
                    .css("width", "35%");
                const enJson5 = JSON.stringify(datos);
                localStorage.setItem('dolar', enJson5);
            }
        }
    })
}

function cuotaDolar(cuotaEnDolares) {

    while (cardDolar.firstChild) {
        cardDolar.removeChild(cardDolar.firstChild);
    }

    const cuotaPesos = localStorage.getItem('cuota');
    const datoDolar = localStorage.getItem('dolar');
    const dolar = JSON.parse(datoDolar);
    const dolarVenta = dolar[0];

    cuotaEnDolares = parseFloat(cuotaPesos) / parseFloat(dolarVenta.venta);
    $('#cardDolar').append(`<div class="card" style="width: 18rem; margin: 10px">
                        <div class="card-body" >
                            <h5 class="card-title" style="color: black; fontweight: bold">CUOTA EN DOLARES</h5>
                            <h6 class="card-subtitle mb-2 text-muted">El valor de la cuota es: u$s${cuotaEnDolares.toFixed(2)}</h6>
                            </div>
                        </div>`);
}