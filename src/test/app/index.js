import Library from "lib";

export default class Application {
    description() {
        return "I am an application. I use libraries: " + Library.description()
    }
}