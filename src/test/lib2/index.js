import * as lib1 from 'lib1'

export default class Library {
    description() {
        return lib1.description() + " I am library 2."
    }
}