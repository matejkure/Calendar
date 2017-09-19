/**
 *
 */

var months = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
var days   = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle"];
var daysShort = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

var birthdays = {
	"01-01": ["My Person 1"],
	"10-03": ["My Person 2"],
	"11-11": ["My Person 3", "My Person 4", "My Person 5"],
	"11-26": ["My Person 6"],
	"12-17": ["My Person 7"]
};

var publicHolidays = {
	"2017-01-01":   "Nový rok",
	"2017-04-14":   "Velký pátek",
	"2017-04-17":   "Velikonoční pondělí",
	"2017-05-01":   "Svátek práce",
	"2017-05-08":   "Den vítězství",
	"2017-07-05":   "Cyrila a Metoděj",
	"2017-07-06":   "Jan Hus",
	"2017-09-28":   "Den české státnosti",
	"2017-10-28":   "Vznik samostatného československého státu",
	"2017-11-17":   "Den boje za svobodu a demokracii",
	"2017-12-24":   "Štědrý den",
	"2017-12-25":   "1. svátek vánoční",
	"2017-12-26":   "2. svátek vánoční",

	"2018-01-01":   "Nový rok",
	"2018-03-30":   "Velký pátek",
	"2018-04-02":   "Velikonoční pondělí",
	"2018-05-01":   "Svátek práce",
	"2018-05-08":   "Den vítězství",
	"2018-07-05":   "Cyrila a Metoděj",
	"2018-07-06":   "Jan Hus",
	"2018-09-28":   "Den české státnosti",
	"2018-10-28":   "Vznik samostatného československého státu",
	"2018-11-17":   "Den boje za svobodu a demokracii",
	"2018-12-24":   "Štědrý den",
	"2018-12-25":   "1. svátek vánoční",
	"2018-12-26":   "2. svátek vánoční",

	"2019-01-01":   "Nový rok",
	"2019-04-19":   "Velký pátek",
	"2019-04-22":   "Velikonoční pondělí",
	"2019-05-01":   "Svátek práce",
	"2019-05-08":   "Den vítězství",
	"2019-07-05":   "Cyrila a Metoděj",
	"2019-07-06":   "Jan Hus",
	"2019-09-28":   "Den české státnosti",
	"2019-10-28":   "Vznik samostatného československého státu",
	"2019-11-17":   "Den boje za svobodu a demokracii",
	"2019-12-24":   "Štědrý den",
	"2019-12-25":   "1. svátek vánoční",
	"2019-12-26":   "2. svátek vánoční",
};

var periods = {
	semester: [["2017-10-02", "2018-01-07"], ["2018-02-01", "2018-02-14"]],
	semesterHoliday: [["2017-07-03", "2017-09-29"]],
	holidays: [],
	exams: [["2018-01-18", "2017-01-31"], ["2017-05-29", "2017-06-30"]]
};



/**
 * Get the week number according to ISO 8601
 *
 * return Number
 */
function getISOWeek (date) {
	// Create a copy of this date object
	var target = new Date(date.valueOf());

	// ISO week date weeks start on monday
	// so correct the day number
	dayNumber = (target.getDay() + 6) % 7;

	// ISO 8601 states that week 1 is the week
	// with the first thursday of that year.
	// Set the target date to the thursday in the target week
	target.setDate(target.getDate() - dayNumber + 3);
	// Store the millisecond value of the target date
	var thursday = target.valueOf();

	// Set the target to the first thursday of the year
	// First set the target to january first
	target.setMonth(0, 1);
	// Not a thursday? Correct the date to the next thursday
	if(target.getDay() != 4) {
		target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
	}

	// The weeknumber is the number of weeks between the
	// first thursday of the year and the thursday in the target week
	return 1 + Math.ceil((thursday - target)/ 604800000); // 604800000 = 7 * 24 * 3600 * 1000
}

function getSchoolWeek (date) {

	return "sw";
}


/**
 * return Date object with set date
 *
 * param	date	string	"yyyy-mm-dd" format
 * return	Date
 */
function str2date (date) {
	var strDate = date.split("-");
	return new Date (strDate[0], strDate[1]-1, strDate[2], 12);
}

function date2ISOstr (date) {
	var str = "";
	str = date.getFullYear() + "-";

	if (date.getMonth()+1 < 10)
		str +="0"+ (date.getMonth()+1) + "-";
	else
		str += (date.getMonth()+1) + "-";

	if(date.getDate() < 10)
		str += "0" + date.getDate();
	else
		str += date.getDate();

	return str;
}



/**
 * Vypíše kalendář v zadaném rozsahu
 *
 * begin	@string	"YYYY-MM-DD" date format
 * end		@string	"YYYY-MM-DD" date format
 */
function renderInterval(begin, end, container) {

	var table = document.createElement("table");
	table.classList.add("pipical-table");

	var thead = document.createElement("thead");
	var tbody = document.createElement("tbody");

	table.appendChild(thead)
	table.appendChild(tbody);

	var row, cell, cellMonth;

	var beginDate = str2date(begin);
	var endDate	  = str2date(end);


	// Table head
	row = document.createElement("tr");

	// month column
	cell = document.createElement("td");
	cell.classList.add("pipical-month");
	row.appendChild(cell);

	// school week column
	cell = document.createElement("td");
	cell.classList.add("pipical-schoolWeek");
	row.appendChild(cell);

	// week column
	cell = document.createElement("td");
	cell.classList.add("pipical-week");
	row.appendChild(cell);

	// days
	for (var i=1; i<8; i++) {
		cell = document.createElement("td");
		cell.classList.add("pipical-day");
		cell.innerText = daysShort[i];

		row.appendChild(cell);
	};

	// row properties and appending
	row.classList.add("pipical-row", "pipical-header");
	thead.appendChild(row);



	// Days in table
	var rows = 0;
	var days = 0;

	// ISO day numbering
	var presentDate  = new Date(beginDate.valueOf());
	var currentMonth = presentDate.getMonth();

	while (presentDate <= endDate) {
		var presentDay = (presentDate.getDay() + 6) % 7;

		if (presentDate.valueOf() == beginDate.valueOf()) {
			row = document.createElement("tr");
			rows++;

			cellMonth = document.createElement("th");
			cellMonth.classList.add("pipical-month");
			cellMonth.innerText = months[presentDate.getMonth()];
			row.appendChild(cellMonth);

			cell = document.createElement("td");
			cell.innerText = getSchoolWeek(presentDate)
			cell.classList.add("pipical-schoolWeek");
			row.appendChild(cell);

			cell = document.createElement("td");
			cell.innerText = getISOWeek(presentDate);
			cell.classList.add("pipical-week");
			row.appendChild(cell);

			// whitespaces before first day in the interval
			for (i=0; i < presentDay; i++) {
				cell = document.createElement("td");
				cell.classList.add("pipical-day");
				row.appendChild(cell);
			}
		}

		// New month
		if (currentMonth != presentDate.getMonth()) {
			var previousDate = new Date(presentDate.valueOf() - 86400000);
			var previousDay = (previousDate.getDay() + 6) % 7;

			// finish row in previous month
			for (i=previousDay+1; i < 7; i++) {
				cell = document.createElement("td");
				cell.classList.add("pipical-day");
				row.appendChild(cell);
			}

			cellMonth.rowSpan = rows;
			rows = 0;
			tbody.appendChild(row);

			currentMonth = presentDate.getMonth();

			row = document.createElement("tr");
			row.classList.add("pipical-row");
			rows++;

			cellMonth = document.createElement("th");
			cellMonth.classList.add("pipical-month");
			cellMonth.innerText = months[presentDate.getMonth()];
			row.appendChild(cellMonth);

			cell = document.createElement("td");
			cell.innerText = getSchoolWeek(presentDate)
			cell.classList.add("pipical-schoolWeek");
			row.appendChild(cell);

			cell = document.createElement("td");
			cell.innerText = getISOWeek(presentDate);
			cell.classList.add("pipical-week");
			row.appendChild(cell);

			for (i=0; i < presentDay; i++) {
				cell = document.createElement("td");
				cell.classList.add("pipical-day");
				row.appendChild(cell);
			}
		}
		// Monday = new week = new row
		else if (presentDay == 0 && (presentDate.valueOf() != beginDate.valueOf())) {
			tbody.appendChild(row);

			row = document.createElement("tr");
			row.classList.add("pipical-row");
			rows++;

			cell = document.createElement("td");
			cell.innerText = getSchoolWeek(presentDate)
			cell.classList.add("pipical-schoolWeek");
			row.appendChild(cell);

			cell = document.createElement("td");
			cell.innerText = getISOWeek(presentDate);
			cell.classList.add("pipical-week");
			row.appendChild(cell);
		}

		cell  = document.createElement("td");
		cell.classList.add("pipical-day");
		cell.innerText = presentDate.getDate();

		if (presentDay == 5 || presentDay == 6) {
			cell.classList.add("pipical-weekend");
		}

		if (publicHolidays[date2ISOstr(presentDate)] != undefined) {
			cell.classList.add("pipical-public-holiday")
		}

		row.appendChild(cell)


		if (presentDate.valueOf() == endDate.valueOf()) {
			for (i=presentDay+1; i < 7; i++) {
				cell  = document.createElement("td");
				cell.classList.add("pipical-day");
				row.appendChild(cell);
			}
		}

		var pd = new Date(presentDate.valueOf() + 86400000);
		presentDate = new Date(pd.getFullYear(), pd.getMonth(), pd.getDate(), 12);



		/*
		 * OLD ALGORITHM
		 */
		// zachycení dalšího měsíce
		// if (currentMonth != presentDate.getMonth()) {
		// 	var previous = new Date(presentDate.valueOf() - 86400000);
		// 	var previousDay = (previous.getDay() + 6) % 7;
		//
		// 	if (previousDay != 6) {
		// 		// fill rest of row with empty fields
		// 		for (i=previousDay+1; i < 7; i++) {
		// 			cell = document.createElement("td");
		// 			cell.classList.add("pipi-cal-day");
		// 			row.appendChild(cell);
		// 		}
		//
		// 		row.classList.add("pipi-cal-row");
		// 		tbody.appendChild(row);
		// 		cellMonth.rowSpan = rows;
		//
		// 		// reset čítadla řádků
		// 		rows = 0;
		// 	}
		// 	else {
		// 		cellMonth.rowSpan = rows-1;
		// 	}
		//
		// 	//nový měsíc = aktuální
		// 	currentMonth = presentDate.getMonth();
		//
		// 	// reset čítadla řádků a dnů
		// 	rows = 0;
		// 	days = 0;
		//
		// 	// buňky pro nový měsíc
		// 	if (previousDay != 6) {
		// 	//if (previous.getDay()) {
		// 		row = document.createElement("tr");
		// 		rows++;
		//
		// 		cellMonth = document.createElement("th");
		// 		cellMonth.innerText = months[presentDate.getMonth()];
		// 		cellMonth.classList.add("pipi-cal-month");
		//
		// 		row.appendChild(cellMonth);
		//
		// 		cell = document.createElement("td");
		// 		cell.classList.add("pipi-cal-schoolWeek");
		// 		row.appendChild(cell);
		//
		// 		cell = document.createElement("td");
		// 		cell.innerText = getISOWeek(presentDate);
		// 		cell.classList.add("pipi-cal-week");
		// 		row.appendChild(cell);
		// 	}
		// 	else {
		// 		cellMonth = document.createElement("th");
		// 		cellMonth.innerText = months[presentDate.getMonth()];
		// 		cellMonth.classList.add("pipi-cal-month");
		//
		// 		row.insertBefore(cellMonth, row.childNodes[0]);
		// 		rows++;
		// 	}
		//
		// 	// ofset měsíce
		// 	beginDay = presentDay;
		//
		// 	while (beginDay) {
		// 		cell = document.createElement("td");
		// 		cell.classList.add("pipi-cal-day");
		// 		row.appendChild(cell);
		//
		// 		beginDay--;
		// 	}
		//
		// }

		// cell = document.createElement("td");
		// cell.innerText = presentDate.getDate();
		// cell.classList.add("pipi-cal-day");
		//
		// // colors weekend
		// if (presentDay == 5 || presentDay == 6) {
		// 	cell.classList.add("pipi-cal-weekend");
		// }
		//
		// // color public holidays
		// if (typeof(publicHolidays[date2ISOstr(presentDate)]) != "undefined") {
		// 	cell.classList.add("pipi-cal-public-holiday");
		// }
		//
		// row.appendChild(cell);

		// next day
		//presentDate = new Date (presentDate.valueOf() + 86400000); // 24*60*60*1000

		// if (presentDate < endDate) {
		// 	if (presentDay == 6) {
		// 	// if (!(days%7)) {
		// 		row.classList.add("pipi-cal-row");
		// 		tbody.appendChild(row);
		//
		// 		row = document.createElement("tr");
		// 		rows++;
		//
		// 		cell = document.createElement("td");
		// 		cell.classList.add("pipi-cal-schoolWeek");
		// 		row.appendChild(cell);
		//
		// 		cell = document.createElement("td");
		// 		cell.innerText = getISOWeek(presentDate);
		// 		cell.classList.add("pipi-cal-week");
		// 		row.appendChild(cell);
		// 	}
		// }
	}

	// Finish row with blank spaces
	var day = (presentDate.getDay() + 6) % 7;

	for (i=day; i < 6; i++) {
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-day");
		row.appendChild(cell);
		days++;
	}

	row.classList.add("pipi-cal-row");
	tbody.appendChild(row);

	cellMonth.rowSpan = rows;

	// appends table into container
	table.classList.add("pipi-cal", "pipi-cal-table");
	container.appendChild(table);
}


/**
 * Renders table with year
 */
function renderYear(year, container) {
	var begin = year + "-01-01";
	var end = year + "-12-31";
	renderInterval(begin, end, container);
}

/**
 * Renders table with month
 */
function renderMonth (date, container) {
	var _newDate = new Date(date);
	var _endDate = new Date(_newDate.getFullYear(), _newDate.getMonth()+1, 1,12);
	_endDate = new Date(_endDate.getTime() - 24*3600*1000);

 	var	begin = date2ISOstr(_newDate),
		end   = date2ISOstr(_endDate);

	renderInterval(begin, end, container);
}

/**
 * Renders table with current month
 */
function render (container) {
	var now = new Date(),
		str = now.getFullYear() + "-" + (now.getMonth() + 1);

	renderMonth(str, container);
}



/**
 * Třída PipiCal reprezentující kalendář
 */
function PipiCalendar (element, options) {

	var self = this;

}
