export class PhoneFormat {
    private readonly _original: string
    private readonly _nonInternationalized: string | undefined
    private readonly _internationalized: string | undefined
    private readonly _isValid: boolean

    constructor(phoneString: string, options?: { suppressException?: boolean }) {
        this._original = (phoneString || '').trim()
        let _phoneString = phoneString
        // set _isValid
        this._isValid = false
        // extract only numbers
        _phoneString = _phoneString.match(/\d+/g)?.join('') || ''
        if (this._original.startsWith('+')) _phoneString = `+${_phoneString}`
        // convert thai number to internationalized and vise versa
        if (this.isValidThaiMobilePhone(_phoneString)) {
            this._nonInternationalized = _phoneString
            this._internationalized = `+66${_phoneString.substring(1)}`
            this._isValid = true
        } else if (this.isValidInternationalizedThaiMobilePhone(_phoneString)) {
            this._internationalized = _phoneString
            this._nonInternationalized = `0${_phoneString.substring(3)}`
            this._isValid = true
        }
        if (!this._isValid && !options?.suppressException) {
            throw Error('Invalid phone format')
        }

        // TODO: support international phone formats validation
    }

    private isValidThaiMobilePhone(phone: string) {
        const validLength = phone.length === 10
        const validStart =
            phone.startsWith('06') || phone.startsWith('08') || phone.startsWith('09')
        return validLength && validStart
    }

    private isValidInternationalizedThaiMobilePhone(phone: string) {
        const validLength = phone.length === 12
        const validStart =
            phone.startsWith('+666') || phone.startsWith('+668') || phone.startsWith('+669')
        return validLength && validStart
    }

    get isValid() {
        return this._isValid
    }

    // without country code
    get nonInternationalized() {
        return this._nonInternationalized
    }

    // with country code
    get internationalized() {
        return this._internationalized
    }
}
