
const useThen = async (name) => {
    thenFunction(name).then(val => {
        console.log(val);
    });
}

const thenFunction = (name) => {
    return new Promise((resolve, reject) => {
        resolve("Hello " + name);
    });
}

useThen("Hung");