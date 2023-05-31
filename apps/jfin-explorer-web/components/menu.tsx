import { GlobalConfig } from '@utils/global-config'

export function MenuDemo() {
    return (
        <div
            style={{
                backgroundColor: 'tomato',
                color: 'white',
                fontWeight: 600,
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <div>JFIN Chain Explorer</div>
            <div
                style={{
                    backgroundColor: 'yellow',
                    color: 'black',
                    padding: '5px 10px',
                    borderRadius: 5,
                }}
            >
                <div>mode : {GlobalConfig.target().mode}</div>
                <div>network : {GlobalConfig.target().network}</div>
            </div>
        </div>
    )
}
