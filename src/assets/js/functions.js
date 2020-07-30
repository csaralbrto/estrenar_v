function addDayDate() {
  var dateInit = new Date($("#dateAgenda").val());

  var fecha = new Date(dateInit.setDate(dateInit.getDate() + 2));
  var final = (fecha.getFullYear() + '-' +
    ('0' + (fecha.getMonth() + 1)).slice(-2) +
    '-' + ('0' + (fecha.getDate())).slice(-2));
  $("#dateAgenda").val(final);
  console.log(fecha);
  console.log(final);
  console.log("text");
  drawDateField();
}

function delDayDate() {
  var dateInit = new Date($("#dateAgenda").val());

  var fecha = new Date(dateInit.setDate(dateInit.getDate()));
  var final = (fecha.getFullYear() + '-' +
    ('0' + (fecha.getMonth() + 1)).slice(-2) +
    '-' + ('0' + (fecha.getDate())).slice(-2));
  $("#dateAgenda").val(final);
  drawDateField();
}

function todayDate() {
  var fecha = new Date();
  var final = (fecha.getFullYear() + '-' +
    ('0' + (fecha.getMonth() + 1)).slice(-2) +
    '-' + ('0' + (fecha.getDate())).slice(-2));
  $("#dateAgenda").val(final);
  drawDateField();
}

function drawDateField() {
  var dateInit = new Date($("#dateAgenda").val());
  var fecha = new Date(dateInit.setDate(dateInit.getDate() + 1));
  var weekdays = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  var months = [
    "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  month = fecha.getMonth() + 1;
  day = fecha.getDate();
  day2 = fecha.getDay();

  stringDay = weekdays[day2];
  stringMonth = months[month];

  $("#MonthAgendaLabel").html(stringMonth);
  $("#DayAgendaLabel").html(stringDay);
  $("#DayAgenda").html(day);
  console.log("ssss " + dateInit);
  console.log($("#dateAgenda").val());
}
