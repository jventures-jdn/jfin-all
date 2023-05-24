import { yamls } from '..'

describe('yaml', () => {
    test('minify / unminify', async () => {
        const data = {
            asdfasdf: 'bar',
            asdad: {
                sdfasdf: 1,
                asdfasdf: 2,
                xxx: [1, 2, 3, { goo: 'gle' }],
            },
            sdgsdfg: {
                sdfasdf: 1,
                asdfasdf: 2,
                xxx: [5, 5, 5],
            },
        }
        const minified = yamls.minify(data)
        expect(minified).not.toContain('\n')
        console.log('minified', minified)
        const unminified1 = yamls.unminify(minified)
        expect(unminified1).toEqual(data)

        const minifiedCompressed = yamls.minify(data, { compress: true })
        console.log('compressed', minifiedCompressed)
        const unminifiedCompressed = yamls.unminify(minifiedCompressed, { uncompress: true })
        expect(unminifiedCompressed).toEqual(data)
    })
})
