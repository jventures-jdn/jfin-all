import jdn from '../assets/images/partners/jdn.png'
import tbwg from '../assets/images/partners/tbwg.png'
import tokenine from '../assets/images/partners/tokenine.png'
import iam from '../assets/images/partners/iam.png'
import jet from '../assets/images/partners/jet.png'
import jmb from '../assets/images/partners/jmb.png'
import bnb from '../assets/images/partners/bnb.png'
import fox from '../assets/images/partners/fox.png'
import ava from '../assets/images/partners/ava.png'
import warden from '../assets/images/partners/warden.png'
import kmrs from '../assets/images/partners/kmars.png'
import kanedigital from '../assets/images/partners/kanedigital.jpg'
import maxbit from '../assets/images/partners/maxbit.jpg'
import kub from '../assets/images/partners/kub.png'
import six from '../assets/images/partners/six.png'

export const VALIDATOR_WALLETS: Record<string, { name: string; image: string }> = {
    '0xa22fD0F35d2416eC293E2D00A8eB0c3Bc633Aa91': {
        name: 'JDN',
        image: jdn,
    },
    '0x88Cf3c2a965e2636155bCEf7264B805E8f57EF97': {
        name: 'TOKENINE',
        image: tokenine,
    },
    '0xCd4A92A21539Fd2b50d1ecabce89cCf7294100C8': {
        name: 'Kane Digital',
        image: kanedigital,
    },
    '0x4280e5b57b4d75d6A1aE563f8A09dA8fe05a67d6': {
        name: 'KUB',
        image: kub,
    },
    '0x88a2D9b0B0c357085E63C790f0551B1aAFB88378': {
        name: 'SIX Network',
        image: six,
    },
    '0x78BBA445e1C15E5206adcD671500C7Fa63384A36': {
        name: 'Maxbit',
        image: maxbit,
    },
    '0xe8391988483355e6a8170AC10f5726D4868e5C68': {
        name: 'I AM',
        image: iam,
    },
    '0x6DE767908d0d792385200E30d66A5696B24f709c': {
        name: 'JET',
        image: jet,
    },
    '0xA46f2a9761B4FE539F50df64aD7089Ad446E96d6': {
        name: 'B&B',
        image: bnb,
    },
    '0x1b74cb1878d107d1bf44ADa5472587f4B7799c3a': {
        name: 'AVANTIS',
        image: ava,
    },
    '0xd0004509B34A3ec8A1489CCBA9FA892A09945d1f': {
        name: 'MetaWarden',
        image: warden,
    },
}

export const VALIDATOR_ORDER = Object.keys(VALIDATOR_WALLETS)
