import { Crypto } from '../Types';

export type AppProps = {
    crypto: Crypto;
}

export default function CryptoSummary({crypto} : any){
    return (<p> {crypto.name + ' $' + crypto.current_price}</p>);
}