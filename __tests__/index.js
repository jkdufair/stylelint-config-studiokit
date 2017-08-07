const config = require('../')
const fs = require('fs')
const stylelint = require('stylelint')

const validCss = fs.readFileSync('./__tests__/css-valid.css', 'utf-8')
const invalidCss = fs.readFileSync('./__tests__/css-invalid.css', 'utf-8')

describe('flags no warnings with valid css', () => {
	let result

	beforeEach(() => {
		result = stylelint.lint({
			code: validCss,
			config
		})
	})

	it('did not error', () => {
		return result.then(data => expect(data.errored).toBeFalsy())
	})

	it('flags no warnings', () => {
		return result.then(data => expect(data.results[0].warnings.length).toBe(0))
	})
})

describe('flags warnings with invalid css', () => {
	let result

	beforeEach(() => {
		result = stylelint.lint({
			code: invalidCss,
			config
		})
	})

	it('did error', () => {
		return result.then(data => expect(data.errored).toBeTruthy())
	})

	it('flags three warning', () => {
		return result.then(data => expect(data.results[0].warnings.length).toBe(3))
	})

	it('flags indentation', () => {
		return result.then(data => {
			expect(data.results[0].warnings[0]).toEqual({
				line: 2,
				column: 3,
				rule: 'indentation',
				severity: 'error',
				text: 'Expected indentation of 1 tab (indentation)'
			})
		})
	})

	it('flags no-missing-end-of-source-newline', () => {
		return result.then(data => {
			expect(data.results[0].warnings[1]).toEqual({
				line: 3,
				column: 1,
				rule: 'no-missing-end-of-source-newline',
				severity: 'error',
				text: 'Unexpected missing end-of-source newline (no-missing-end-of-source-newline)'
			})
		})
	})

	it('flags number-leading-zero', () => {
		return result.then(data => {
			expect(data.results[0].warnings[2]).toEqual({
				line: 2,
				column: 8,
				rule: 'number-leading-zero',
				severity: 'error',
				text: 'Expected a leading zero (number-leading-zero)'
			})
		})
	})
})
