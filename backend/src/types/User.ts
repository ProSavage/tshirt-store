export interface User {
    username: string,
    email: string,
    // this is a hash, not the actual password.
    password: string
}