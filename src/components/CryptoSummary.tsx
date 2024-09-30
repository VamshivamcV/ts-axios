import { Crypto } from '../Types';
import { useEffect, useState } from 'react';

export type AppProps = {
    crypto: Crypto;
    updateOwned: (crypto: Crypto, amount: number) => void;
}


export default function CryptoSummary({ crypto, updateOwned }: AppProps): JSX.Element {
    const [amount, setAmount] = useState<number>(NaN);

    useEffect(() => {
        console.log(crypto.name, amount, crypto.current_price * amount);
    })

    return (
        <div>
            <span> {crypto.name + ' $' + crypto.current_price}</span>
            <input
                style={{ margin: 10 }}
                type='number'
                value={amount}
                onChange={(e) => {
                    setAmount(parseFloat(e.target.value))
                    updateOwned(crypto, parseFloat(e.target.value))
                }}>
            </input>
            {}
            <p>
                {isNaN(amount) ? '$0.00' : 
                    "$" +
                    (crypto.current_price * amount)
                    .toLocaleString(undefined, 
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }
            </p>
        </div>
    );
}