interface Credentials {
    identifier?: string,
    password?: string
}

export interface Token {
    token: string
}

interface Signup {
    email?: string,
    password?: string
    firstname?: string
    lastname?: string
}

interface ForgotPassword {
    identifier?: string
}
