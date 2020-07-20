//Trade off beteween query performance vs consistency

///Using References (consistency)
let author = {
    name: 'Mosh Hamedani'
}

let course = {
    author: 'id'
}

///Using Embedded Documents (performances)
let course = {
    author: {
        name: "Mosh Hamedani",
        image: url('./photos/person.gif')
    }
}

///Hybrid
let author = {
    name: "Mosh Hamedani"
        ///50 properties
}

let course = {
    author: {
        name: "Mosh Hamedani",
        courseId: 124
    }
}