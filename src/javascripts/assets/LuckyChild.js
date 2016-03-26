export default class {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    test() {
        console.log(this.id, this.name);
    }
};