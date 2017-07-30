/**
 *	Příklady z GitHubu:
 *
 *	https://github.com/Serhioromano/bootstrap-calendar/blob/master/js/calendar.js
 *	https://github.com/Baremetrics/calendar/blob/master/dev/js/Calendar.js
 */


/**
 * Source data for my Excel Calendar
 */

var birthday = {
	"01-01": ["My Person 1"],
	"02-03": ["My Person 2"],
	"03-11": ["My Person 3", "My Person 4", "My Person 5"],
	"04-26": ["My Person 6"],
	"06-17": ["My Person 7"]
};

var periods = {
	semester: [["2016-10-03", "2017-01-13"],["2017-02-20", "2017-05-26"]],
	semesterHoliday: [],
	holidays: [],
	exams: [["2017-01-16", "2017-02-17"], ["2017-05-29", "2017-06-30"]]
};

/**
 *
 */

var today = new Date();

var thisMonth = today.getMonth(),
	thisYear  = today.getFullYear();

var months = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
var days   = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota", "neděle"];
var daysShort = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So", "Ne"];



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



/**
 * Vypíše kalendář v zadaném rozsahu
 *
 * begin	@string	"YYYY-MM-DD" date format
 * end		@string	"YYYY-MM-DD" date format
 */
function renderInterval(begin, end, container) {
	var table = document.createElement("table"),
		row,
		cell,
		cellMonth;

	var rows = 0;
	var days = 0;

	var beginDate   = str2date(begin);
	var beginDay    = beginDate.getDay() == 0 ? 7 : beginDate.getDay();
	var beginOffset = beginDay-1;

	var endDate		= str2date(end);

	var presentDate = beginDate;

	/*
	 * Hlavička tabulky
	 */
		row = document.createElement("tr");

		// month column
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-month");
		row.appendChild(cell);

		// school week column
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-schoolWeek");
		row.appendChild(cell);

		// week column
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-week");
		row.appendChild(cell);

		// days columns
		for (var i=1; i<8; i++) {
			cell = document.createElement("td");
			cell.classList.add("pipi-cal-day");
			cell.innerText = daysShort[i];

			row.appendChild(cell);
		};

		// row properties and appending
		row.classList.add("pipi-cal-row", "pipi-cal-header");
		table.appendChild(row);

	/*
	 * Days in table
	 */
	row = document.createElement("tr");
	rows++;

	cellMonth = document.createElement("th");
	cellMonth.innerText = months[presentDate.getMonth()];
	cellMonth.classList.add("pipi-cal-month");

	row.appendChild(cellMonth);

	cell = document.createElement("td");
	cell.classList.add("pipi-cal-schoolWeek");
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerText = getISOWeek(presentDate);
	cell.classList.add("pipi-cal-week");
	row.appendChild(cell);

	var currentMonth = presentDate.getMonth();

	while (presentDate <= endDate) {

		// white spaces before first day in the interval
		while(beginOffset) {
			cell = document.createElement("td");
			cell.classList.add("pipi-cal-day");
			row.appendChild(cell);

			days++;
			beginOffset--;
		}

		// zachycení dalšího měsíce
		if (currentMonth != presentDate.getMonth()) {
			var previous = new Date(presentDate.getTime() - 86400000);

			if(previous.getDay()) {
				// empty fields to end up table row
				while(days%7) {
					cell = document.createElement("td");
					cell.classList.add("pipi-cal-day");
					row.appendChild(cell);
					days++;
				}

				row.classList.add("pipi-cal-row");
				table.appendChild(row);
				cellMonth.rowSpan = rows;

				// reset čítadla řádků
				rows = 0;
			}
			else {
				cellMonth.rowSpan = rows-1;
			}

			//nový měsíc = aktuální
			currentMonth = presentDate.getMonth();

			// reset čítadla řádků a dnů
			rows = 0;
			days = 0;

			// buňky pro nový měsíc
			if(previous.getDay()) {
				row = document.createElement("tr");
				rows++;

				cellMonth = document.createElement("th");
				cellMonth.innerText = months[presentDate.getMonth()];
				cellMonth.classList.add("pipi-cal-month");

				row.appendChild(cellMonth);

				cell = document.createElement("td");
				cell.classList.add("pipi-cal-schoolWeek");
				row.appendChild(cell);

				cell = document.createElement("td");
				cell.innerText = getISOWeek(presentDate);
				cell.classList.add("pipi-cal-week");
				row.appendChild(cell);
			}
			else {
				cellMonth = document.createElement("th");
				cellMonth.innerText = months[presentDate.getMonth()];
				cellMonth.classList.add("pipi-cal-month");

				row.insertBefore(cellMonth, row.childNodes[0]);
				rows++;
			}

			// ofset měsíce
			beginDay   = presentDate.getDay() == 0 ? 7 : presentDate.getDay();
			var offset = beginDay-1;

			//console.log("Month: %i \tDay: %i \toffset: %i", presentDate.getMonth()+1, presentDate.getDay(), offset);

			while (offset) {
				cell = document.createElement("td");
				cell.classList.add("pipi-cal-day");
				row.appendChild(cell);
				days++;
				offset--;
			}

		}

		cell = document.createElement("td");
		cell.innerText = presentDate.getDate();
		cell.classList.add("pipi-cal-day");
		row.appendChild(cell);

		days++;

		// adds day
		presentDate = new Date (presentDate.getTime() + 86400000); // 24*60*60*1000

		if(!(days%7)) {
			row.classList.add("pipi-cal-row");
			table.appendChild(row);

			row = document.createElement("tr");
			rows++;

			cell = document.createElement("td");
			cell.classList.add("pipi-cal-schoolWeek");
			row.appendChild(cell);

			cell = document.createElement("td");
			cell.innerText = getISOWeek(presentDate);
			cell.classList.add("pipi-cal-week");
			row.appendChild(cell);
		}
	}

	if(!(days%7)) {
		row.classList.add("pipi-cal-row");
		table.appendChild(row);

		row = document.createElement("tr");
		rows++;

		cell = document.createElement("td");
		cell.classList.add("pipi-cal-schoolWeek");
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerText = getISOWeek(presentDate);
		cell.classList.add("pipi-cal-week");
		row.appendChild(cell);
	}



	row.classList.add("pipi-cal-row");
	table.appendChild(row);

	cellMonth.rowSpan = rows;

	// appends table into container
	table.classList.add("pipi-cal", "pipi-cal-table");
	container.appendChild(table);
}



function renderYear(year, container) {
	var begin = year + "-01-01";
	var end = year + "-12-31";
	renderInterval(begin, end, container);
}



/**
 * Renders table with actual month
 */
function renderMonth (month, container) {
	var now   = new Date(),
		begin = now.getFullYear() + "-" + month + "-01",
		end   = now.getFullYear() + "-" + month + "-01";

	//renderInterval(begin, end, container);


	var table = document.createElement("table"),
		row,
		cell,
		cellMonth;

	var rows = 0;
	var days = 0;

	var beginDate   = new Date(thisYear, thisMonth, 1, 12);
	var beginDay    = beginDate.getDay() == 0 ? 7 : beginDate.getDay();
	var beginOffset = beginDay-1;

	var presentDate = beginDate;

	/*
	 * Hlavička tabulky
	 */
		row = document.createElement("tr");

		// month column
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-month");
		row.appendChild(cell);

		// school week column
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-schoolWeek");
		row.appendChild(cell);

		// week column
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-week");
		row.appendChild(cell);

		// days columns
		for (var i=1; i<8; i++) {
			cell = document.createElement("td");
			cell.classList.add("pipi-cal-day");
			cell.innerText = daysShort[i];

			row.appendChild(cell);
		};

		// row properties and appending
		row.classList.add("pipi-cal-row", "pipi-cal-header");
		table.appendChild(row);

	/*
	 * Days in table
	 */
	row = document.createElement("tr");
	rows++;

	cellMonth = document.createElement("th");
	cellMonth.innerText = months[presentDate.getMonth()];
	cellMonth.classList.add("pipi-cal-month");

	row.appendChild(cellMonth);

	cell = document.createElement("td");
	cell.classList.add("pipi-cal-schoolWeek");
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerText = getISOWeek(presentDate);
	cell.classList.add("pipi-cal-week");
	row.appendChild(cell);

	while(presentDate.getMonth() == thisMonth) {

		if(beginOffset) {
			cell = document.createElement("td");
			cell.classList.add("pipi-cal-day");
			row.appendChild(cell);
			beginOffset--;
		}
		else {
			cell = document.createElement("td");
			cell.innerText = presentDate.getDate();
			cell.classList.add("pipi-cal-day");
			row.appendChild(cell);

			// add day
			presentDate = new Date (presentDate.getTime() + 86400000); // 24*60*60*1000
		}

		days++;

		//console logging
		var dumpDate = new Date (presentDate.getTime()-86400000);
		console.log("Datum: " + dumpDate.getDate() + ": den: " + days);

		if(!(days%7)) {
			row.classList.add("pipi-cal-row");
			table.appendChild(row);

			row = document.createElement("tr");
			rows++;

			cell = document.createElement("td");
			cell.classList.add("pipi-cal-schoolWeek");
			row.appendChild(cell);

			cell = document.createElement("td");
			cell.innerText = getISOWeek(presentDate);
			cell.classList.add("pipi-cal-week");
			row.appendChild(cell);
		}
	}

	// empty fields to end up table row
	while(days%7) {
		cell = document.createElement("td");
		cell.classList.add("pipi-cal-day");
		row.appendChild(cell);
		days++;
	}

	row.classList.add("pipi-cal-row");
	table.appendChild(row);

	cellMonth.rowSpan = rows;

	// appends table into container
	table.classList.add("pipi-cal", "pipi-cal-table");
	container.appendChild(table);
}

/**
 * Třída PipiCal reprezentující kalendář
 */
function PipiCalendar (element, options) {}
