// export default class UserDto {
//     constructor(user) {
//         this.first_name = user.first_name;
//         this.last_name = user.last_name;
//         this.fullname = `${user.first_name} ${user.last_name}`;
//         this.email = user.email;
//         this.password = user.password;
//         this.age = user.age;

//         console.log('Fullname generado en DTO:', this.fullname);
//     }
// }

export default class UserDto {
    constructor(user) {
        this.email = user.email;
        this.fullname = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
}