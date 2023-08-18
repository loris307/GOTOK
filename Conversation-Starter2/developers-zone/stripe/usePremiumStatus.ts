import { User } from '@firebase/auth'; // This is the new import for User.
import { useState, useEffect } from 'react';
import isUserPremium from './isUserPremium';

export default function usePremiumStatus(user: User | null) {
    const [isPremiumStatus, setIsPremiumStatus] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            const checkPremiumStatus = async () => {
                const isPremium = await isUserPremium();
                setIsPremiumStatus(isPremium);
            };

            checkPremiumStatus(); // Ensure this is called when user is defined.
        }
    }, [user]);

    return isPremiumStatus;
}
