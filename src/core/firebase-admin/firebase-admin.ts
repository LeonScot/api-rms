// firebase-admin.init.ts
import * as FirebaseAdmin from 'firebase-admin';

FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert('beaute-diamonds-test-firebase-adminsdk-xp211-dbe10b7d7f.json'),
    storageBucket: 'beaute-diamonds-test.appspot.com'
});

export default FirebaseAdmin;
