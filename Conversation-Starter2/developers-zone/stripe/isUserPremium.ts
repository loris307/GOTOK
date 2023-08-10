import { getIdTokenResult } from "firebase/auth";
import { auth } from '../firebase.js';

export default async function isUserPremium(): Promise<boolean> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        return false;
    }

    await currentUser.getIdToken(true);
    const decodedToken = await getIdTokenResult(currentUser);

    return decodedToken.claims.stripeRole ? true : false;
}