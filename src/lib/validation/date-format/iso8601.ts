const ISO8601_FORMATS = {
	CALENDAR:
		/^(\d{4})-([01]\d)-([0-3]\d)(?:T([012]\d):([0-5]\d):([0-5]\d)(?:\.(\d+))?(Z|([+-])([01]\d):([0-5]\d))?)?$/,
	ORDINAL: /^(\d{4})-(\d{3})$/,
	WEEK: /^(\d{4})-W([0-5]\d)(?:-([1-7]))?$/
};

const parseWeekDate: (year: number, week: number, day?: number) => Date = (year, week, day = 1) => {
	// January 4th is always in week 1 per ISO-8601
	const jan4th = new Date(year, 0, 4);
	const startOfWeek1 = new Date(jan4th);

	startOfWeek1.setDate(jan4th.getDate() - jan4th.getDay() + 1);

	// Calculate target date
	const targetDate = new Date(startOfWeek1);

	targetDate.setDate(startOfWeek1.getDate() + (week - 1) * 7 + (day - 1));

	// Validate the resulting year is correct
	if (targetDate.getFullYear() !== year) {
		throw new Error('Invalid week date');
	}

	return targetDate;
};

const parseOrdinalDate: (year: number, ordinalDay: number) => Date = (year, ordinalDay) => {
	const date = new Date(year, 0, 1);

	date.setDate(ordinalDay);

	// Validate the resulting year is correct
	if (date.getFullYear() !== year) {
		throw new Error('Invalid ordinal date');
	}

	return date;
};

const parseDate: (dateString: string) => Date = (dateString) => {
	const dateMatch = dateString.match(ISO8601_FORMATS.CALENDAR);

	if (dateMatch) {
		const [, y, m, d, h, min, s, ms, tz, o, hoff, minoff] = dateMatch;

		void tz;

		const year = Number(y);
		const month = Number(m);
		const day = Number(d);
		const hour = h ? Number(h) : 0;
		const minute = min ? Number(min) : 0;
		const second = s ? Number(s) : 0;
		const millisecond = ms ? Number(ms) : 0;
		const hourOffset = hoff ? Number(`${o}${hoff}`) : 0;
		const minuteOffset = minoff ? Number(`${o}${minoff}`) : 0;

		const date = new Date(dateString);

		if (date instanceof Date === false) {
			throw new Error('Invalid calendar date');
		} else if (
			date.getFullYear() !== year ||
			date.getMonth() + 1 !== month ||
			date.getDate() !== day ||
			date.getHours() !== hour - hourOffset ||
			date.getMinutes() !== minute - minuteOffset ||
			date.getSeconds() !== second ||
			date.getMilliseconds() !== millisecond
		) {
			throw new Error('Invalid calendar date');
		} else {
			return date;
		}
	}

	const weekMatch = dateString.match(ISO8601_FORMATS.WEEK);

	if (weekMatch) {
		const [, y, w, d] = weekMatch;

		const year = Number(y);
		const week = Number(w);
		const day = d ? Number(d) : 1;

		if (week < 1 || week > 53) {
			throw new Error('Invalid week number');
		}

		if (week === 53) {
			const dec31 = new Date(year, 11, 31);

			const lastWeek =
				Math.floor((dec31.getTime() - new Date(year, 0, 1).getTime()) / (86400000 * 7)) + 1;

			if (lastWeek !== 53) {
				throw new Error('Invalid week number');
			}
		}

		return parseWeekDate(year, week, day);
	}

	const ordinalMatch = dateString.match(ISO8601_FORMATS.ORDINAL);

	if (ordinalMatch) {
		const [, y, od] = ordinalMatch;

		const year = Number(y);
		const ordinalDay = Number(od);

		// Validate ordinal day number
		const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
		const maxDays = isLeapYear ? 366 : 365;

		if (ordinalDay < 1 || ordinalDay > maxDays) {
			throw new Error('Invalid ordinal day number');
		}

		return parseOrdinalDate(year, ordinalDay);
	}

	throw new Error('Invalid ISO-8601 date format');
};

const isValidDate: (dateString: string) => boolean = (date) => {
	try {
		return parseDate(date) instanceof Date;
	} catch {
		return false;
	}
};

export { isValidDate, parseDate };
