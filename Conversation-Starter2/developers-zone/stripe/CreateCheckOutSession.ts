import { getFirestore, collection, doc, addDoc, onSnapshot } from 'firebase/firestore';
//import "firebase/firestore";
import initializeStripe from "./initializeStripe";

export async function createCheckoutSession(uid: string) {

    const db = getFirestore();

    const checkoutSessionRef = await addDoc(collection(db, "users", uid, "checkout_sessions"), {
        price: "price_1NcWxdAmn8sb0ycrMmm8Sh7f",
        success_url: window.location.origin,
        cancel_url: window.location.origin,
    });

    onSnapshot(checkoutSessionRef, async (snap) => {
        const { sessionId } = snap.data();
        if (sessionId) {
            const stripe = await initializeStripe();
            stripe?.redirectToCheckout({ sessionId });
        }
    });
}