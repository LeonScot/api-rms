export interface EnvironmentVariables {
    DB_URI: string,
    BASE_URL: string,

    FIREBASE_PROJECT_ID: string,
    FIREBASE_PRIVATE_KEY: string,
    FIREBASE_CLIENT_EMAIL: string,

    MAIL_PORT: string,
    MAIL_HOST: string,
    MAIL_USER: string,
    MAIL_PASSWORD: string,

    TWILIO_ACCOUNT_SID: string,
    TWILIO_AUTH_TOKEN: string,
    TWILIO_PHONE_NUMBER: string,
    TWILIO_VERIFY_SERVICE_SID: string,
}


export default () => ({
    DB_URI: process.env.DB_URI,
    BASE_URL: process.env.BASE_URL,

    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,

    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,

    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID,
});