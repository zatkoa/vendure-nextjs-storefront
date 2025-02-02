import { US, NL, SK } from 'country-flag-icons/react/3x2';
import React from 'react';

export const getFlagByCode = (langCode: string | undefined, isCurrent?: boolean) => {
    switch (langCode) {
        case 'sk':
            return (
                <>
                    <SK className="no-default-fill" />
                    {!isCurrent && <p>Slovensky</p>}
                </>
            );
        case 'en':
        default:
            return (
                <>
                    <US className="no-default-fill" />
                    {!isCurrent && <p>English</p>}
                </>
            );
        // case 'cz':
        //     return (
        //         <>
        //             <CZ className="no-default-fill" />
        //             {!isCurrent && <p>Czech</p>}
        //         </>
        //     );
    }
};
