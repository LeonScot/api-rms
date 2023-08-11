// firebase-admin.init.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as FirebaseAdmin from 'firebase-admin';
import { EnvironmentVariables } from '../config/configuration';


class FireInit {

    constructor(public configService: ConfigService<EnvironmentVariables>) {}

    async init() {
        await ConfigModule.envVariablesLoaded;

        const { privateKey } = JSON.parse(this.configService.get('FIREBASE_PRIVATE_KEY'));

        FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.cert({
                projectId: this.configService.get('FIREBASE_PROJECT_ID'),
                privateKey: privateKey,
                clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
            }),
            storageBucket: 'beaute-diamonds-test.appspot.com'
        });

        return FirebaseAdmin;
    }
}

const FirebaseControl = new FireInit(new ConfigService).init()

export default FirebaseControl;
