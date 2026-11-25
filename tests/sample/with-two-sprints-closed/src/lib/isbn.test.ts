import { describe, expect, it } from 'vitest';
import { isbn10To13, isIsbn10, isIsbn13, normalizeIsbn } from './isbn';

describe('normalizeIsbn', () => {
	it('keeps an ISBN-13, with hyphens and spaces taken out', () => {
		expect(normalizeIsbn('9780140449136')).toBe('9780140449136');
		expect(normalizeIsbn('978-0-14-044913-6')).toBe('9780140449136');
		expect(normalizeIsbn(' 978 0141 439518 ')).toBe('9780141439518');
	});

	it('turns an ISBN-10 into its ISBN-13', () => {
		expect(normalizeIsbn('0-14-044913-2')).toBe('9780140449136');
		expect(normalizeIsbn('0141439513')).toBe('9780141439518');
		expect(normalizeIsbn('080442957x')).toBe('9780804429573');
	});

	it('refuses a wrong check digit, a wrong length and letters', () => {
		expect(normalizeIsbn('9780140449137')).toBeNull();
		expect(normalizeIsbn('0140449133')).toBeNull();
		expect(normalizeIsbn('978014044913')).toBeNull();
		expect(normalizeIsbn('97801404491360')).toBeNull();
		expect(normalizeIsbn('isbn 978014044913')).toBeNull();
		expect(normalizeIsbn('')).toBeNull();
	});
});

describe('the check digits', () => {
	it('of an ISBN-10 may be X, and only at its end', () => {
		expect(isIsbn10('080442957X')).toBe(true);
		expect(isIsbn10('08044295X7')).toBe(false);
	});

	it('of an ISBN-13 weigh its digits 1 and 3 in turn', () => {
		expect(isIsbn13('9780306406157')).toBe(true);
		expect(isIsbn13('9780306406158')).toBe(false);
	});

	it('of an ISBN-10 turned into an ISBN-13 are worked out again', () => {
		expect(isbn10To13('0306406152')).toBe('9780306406157');
	});
});
