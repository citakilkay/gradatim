/** An ISBN as a reader types it, with hyphens and spaces taken out and a final x made capital. */
function compact(input: string): string {
	return input.replace(/[\s-]/g, '').toUpperCase();
}

/** Whether ten characters are an ISBN-10: nine digits and a check digit, 0 to 9 or X. */
export function isIsbn10(isbn: string): boolean {
	if (!/^\d{9}[\dX]$/.test(isbn)) return false;
	const sum = [...isbn].reduce((total, char, i) => total + (char === 'X' ? 10 : Number(char)) * (10 - i), 0);
	return sum % 11 === 0;
}

/** Whether thirteen digits are an ISBN-13, by its check digit. */
export function isIsbn13(isbn: string): boolean {
	if (!/^\d{13}$/.test(isbn)) return false;
	const sum = [...isbn].reduce((total, char, i) => total + Number(char) * (i % 2 === 0 ? 1 : 3), 0);
	return sum % 10 === 0;
}

/** The ISBN-13 of a valid ISBN-10: the prefix 978, its first nine digits, and a new check digit. */
export function isbn10To13(isbn10: string): string {
	const twelve = `978${isbn10.slice(0, 9)}`;
	const sum = [...twelve].reduce((total, char, i) => total + Number(char) * (i % 2 === 0 ? 1 : 3), 0);
	return `${twelve}${(10 - (sum % 10)) % 10}`;
}

/**
 * The ISBN that Shelf keeps for what a reader typed: its ISBN-13, with hyphens and spaces taken out,
 * an ISBN-10 turned into its ISBN-13. Null when the text is no ISBN-10 or ISBN-13.
 */
export function normalizeIsbn(input: string): string | null {
	const isbn = compact(input);
	if (isIsbn13(isbn)) return isbn;
	if (isIsbn10(isbn)) return isbn10To13(isbn);
	return null;
}
