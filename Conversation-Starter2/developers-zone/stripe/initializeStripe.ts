import {Stripe, loadStripe} from '@stripe/stripe-js';

let StripePromise: Stripe | null

const initializeStripe = async () => {
    if(!StripePromise){
        StripePromise = await loadStripe("pk_test_51NcWqjAmn8sb0ycrVKjeLjD22QScb58tmTqI6sm8G5bIWcty51LXjor3FR5ej9M4UZHmP9GqPeWCzQv5CTsnXddy00znuKSE4t")
    }
    return StripePromise
}

export default initializeStripe