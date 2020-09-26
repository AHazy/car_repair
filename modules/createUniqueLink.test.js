const createUniqueLink = require('./createUniqueLink');
const crypto = require('crypto')

const randomBytesMock = jest.spyOn(crypto, 'randomBytes')
const toStringMock = jest.fn(() => 'abcdefghijklmnopqrst')

randomBytesMock.mockImplementation(() => ({
  toString: toStringMock
}))

describe('createUniqueLink', () => {
  it('should generate link', () => {
    const link = createUniqueLink('test@test.com');
    expect(link).toBe('http://localhost:8080/appointment_form?email=test@test.com&id=abcdefghijklmnopqrst')
    expect(randomBytesMock).toHaveBeenCalledWith(20);
    expect(toStringMock).toHaveBeenCalledWith('hex');
  })
})
